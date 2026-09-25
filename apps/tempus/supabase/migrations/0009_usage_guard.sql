-- Tempus: 予算ガード（Supabase無料枠を超えて「止まる」ことを防ぐ）
--
-- 背景（docs/SPEC.md「制約」参照）: Supabase Freeプランは課金が発生しない。超過すると
-- 請求ではなくサービス制限（プロジェクト一時停止／DB読み取り専用／API 402）がかかる。
-- 守るべきは「請求」ではなく「止まらないこと」。Management APIには usage/quota/invoice の
-- エンドポイントが無いため、外部からは使用量を取得できず、自分で測るしかない。
--
-- 通信5GB/月だけはここでは測れない（Postgres/Storageの中から観測できる値ではない）ため、
-- 意図的に列を持たない。設計側で画像・添付をSupabaseに置かない方針にして構造的に
-- 食わせないようにしている（supabase/functions/usage-guard/README.md 参照）。

-- ============================================================
-- usage_snapshots: 日次の使用量スナップショット
-- ============================================================
create table public.usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  taken_at timestamptz not null default now(),
  db_bytes bigint,
  storage_bytes bigint,
  table_rows jsonb,
  auth_users int,
  edge_invocations int,
  notes text
);

comment on table public.usage_snapshots is
  '無料枠に対する使用量の日次スナップショット。usage-guard Edge Functionが毎日1行INSERTする。';

comment on column public.usage_snapshots.edge_invocations is
  'Management APIにEdge関数の呼び出し回数を取得するエンドポイントが無いため、
   collect_usage()では埋められない（常にNULL）。将来ダッシュボードの値を手入力する余地として残す。';

-- ============================================================
-- collect_usage(): 使用量を測って usage_snapshots に1行 INSERT し、その行を返す
--
-- SECURITY DEFINER にする理由: authenticated ユーザーに storage.objects / auth.users への
-- 直接 SELECT 権限は与えたくない（全ユーザー分の内訳が見えてしまう）。集計済みの数値だけを
-- この関数経由で返す。呼び出しは service_role（usage-guard Edge Function）のみを想定しており、
-- authenticated / anon には EXECUTE を与えない（下部のGRANT参照）。
-- ============================================================
create function public.collect_usage()
returns public.usage_snapshots
language plpgsql
security definer
set search_path = public
as $$
declare
  v_db_bytes bigint;
  v_storage_bytes bigint := null;
  v_auth_users int := null;
  v_table_rows jsonb := '{}'::jsonb;
  v_row_count bigint;
  v_tablename text;
  v_row public.usage_snapshots;
begin
  -- DBサイズ
  select pg_database_size(current_database()) into v_db_bytes;

  -- ストレージ: storage スキーマが無い環境（ローカル検証等）でも落ちないよう存在確認してから読む
  if to_regclass('storage.objects') is not null then
    execute 'select coalesce(sum((metadata->>''size'')::bigint), 0) from storage.objects'
      into v_storage_bytes;
  end if;

  -- 認証ユーザー数: 同じく auth.users の存在確認をしてから読む
  if to_regclass('auth.users') is not null then
    execute 'select count(*) from auth.users' into v_auth_users;
  end if;

  -- public の全テーブルの行数
  for v_tablename in
    select tablename from pg_tables where schemaname = 'public' order by tablename
  loop
    execute format('select count(*) from public.%I', v_tablename) into v_row_count;
    v_table_rows := v_table_rows || jsonb_build_object(v_tablename, v_row_count);
  end loop;

  insert into public.usage_snapshots (db_bytes, storage_bytes, table_rows, auth_users, edge_invocations)
  values (v_db_bytes, v_storage_bytes, v_table_rows, v_auth_users, null)
  returning * into v_row;

  return v_row;
end;
$$;

comment on function public.collect_usage() is
  '無料枠の使用量を実測して usage_snapshots に1行INSERTする。呼び出し元は
   usage-guard Edge Function（service_role）のみを想定。通信5GB/月はここでは測れない。';

-- ============================================================
-- prune_usage_snapshots(): 90日より古いスナップショットを削除する
--
-- 予算ガードの記録自体がDB容量（無料枠500MB）を圧迫したら本末転倒なので、
-- usage-guard Edge Function が毎日の実行の最後に呼ぶ。
-- ============================================================
create function public.prune_usage_snapshots()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted int;
begin
  delete from public.usage_snapshots where taken_at < now() - interval '90 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

comment on function public.prune_usage_snapshots() is
  '90日より古い usage_snapshots 行を削除する。予算ガード自身が無料枠を圧迫しないための自己防衛。';

-- ============================================================
-- usage_guard_state: 前回どこまで通知したかを覚えておくシングルトン
--
-- LINE pushは月200通枠を消費する（reply APIと違いカウント対象）ため、毎日は鳴らさず
-- 「90%以上」または「70%を初めて跨いだ時」だけ通知する（usage-guard/index.ts参照）。
-- その判定に必要な「前回どのレベルまで通知したか」を1行だけ持つ。
--
-- id を boolean かつ CHECK (id) にして常に true 固定にすることで、行が複数できないように
-- している（primary keyと合わせて「id=trueの行は高々1つ」を型システムで強制する定石）。
-- ============================================================
create table public.usage_guard_state (
  id boolean primary key default true check (id),
  last_notified_level text not null default 'none'
    check (last_notified_level in ('none', 'warn70', 'critical90')),
  last_notified_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.usage_guard_state is
  '予算ガードの通知状態（シングルトン1行）。usage-guard Edge Functionがservice_roleで直接更新する。';

insert into public.usage_guard_state (id, last_notified_level) values (true, 'none');

-- ============================================================
-- RLS
-- owner の概念が無いテーブル（Tempusは唯一のユーザー本人のための集計）なので、
-- 行単位ではなく「ログインしているか」だけで絞る。authenticated なら select 可、
-- insert/update/delete は不可（usage_snapshotsの書き込みは collect_usage()/
-- prune_usage_snapshots() 経由のみ。usage_guard_stateはusage-guard Edge Functionが
-- service_roleで直接UPDATEする＝RLS/GRANTを介さない）。
-- ============================================================
alter table public.usage_snapshots enable row level security;
alter table public.usage_guard_state enable row level security;

create policy usage_snapshots_select
  on public.usage_snapshots for select
  using (true);

create policy usage_guard_state_select
  on public.usage_guard_state for select
  using (true);

-- insert/update/delete のポリシーは両テーブルとも意図的に作らない
-- （＝authenticatedからは常に拒否される）。

-- ============================================================
-- GRANT（0006_grants.sql の流儀に合わせて明示的に書く）
-- ============================================================

-- select のみ。insert/update/delete は与えない。
grant select on public.usage_snapshots   to authenticated;
grant select on public.usage_guard_state to authenticated;

-- anon には一切与えない（0007_revoke_anon.sql の方針を継続。ここでも明示はしない）。

-- collect_usage() / prune_usage_snapshots() には authenticated / anon いずれにも
-- EXECUTE を与えない。毎日の測定はブラウザからの任意タイミングではなく
-- usage-guard Edge Function（service_role）からのみ起動させる意図的な制限。
--
-- PostgreSQLは関数作成時にEXECUTEをPUBLIC（≒全ロール）へ既定で付与するため、
-- 何もしないとauthenticated/anonからも呼べてしまう。明示的にPUBLICから剥奪する
-- （service_roleはPUBLIC経由ではなくSupabaseの既定権限で個別に持っているため影響しない）。
revoke execute on function public.collect_usage() from public;
revoke execute on function public.prune_usage_snapshots() from public;
