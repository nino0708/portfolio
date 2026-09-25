-- ==================== migrations/0001_init.sql ====================
-- Tempus: 初期スキーマ
-- src/types/domain.ts が唯一の正。カラムは camelCase -> snake_case に変換して一致させている。
-- gen_random_uuid() は PostgreSQL 13+ でコア組み込み（Supabase の PG15 では拡張不要）。

-- ============================================================
-- profiles: auth.users の 1:1 拡張
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  line_user_id text unique, -- LINE起票の突合キー
  timezone text not null default 'Asia/Tokyo',
  workday_start text not null default '09:00'
    check (workday_start ~ '^([01]\d|2[0-3]):[0-5]\d$'),
  workday_end text not null default '22:00'
    check (workday_end ~ '^([01]\d|2[0-3]):[0-5]\d$'),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'auth.users の拡張プロフィール。新規登録時にトリガーで自動作成される。';

-- ============================================================
-- projects
-- ============================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  color text not null default '#3B82F6',
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- project_members: プロジェクト単位の共有
-- ============================================================
create table public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- ============================================================
-- tasks
-- project_id が NULL = 受信箱（未仕分け）。project 削除時はタスクを消さず受信箱に戻す。
-- 必須項目はタイトルのみ。それ以外は DEFAULT または NULL 許容。
-- ============================================================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  notes text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done', 'behind')),
  importance text not null default 'mid' check (importance in ('low', 'mid', 'high')),
  due_at timestamptz,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  estimate_min integer not null default 30,
  estimate_is_inferred boolean not null default true, -- true = 推定値（UIでバッジ表示）
  actual_min integer,
  started_at timestamptz, -- 実績計測の開始時刻。裏でタイマーは回さない
  completed_at timestamptz,
  source text not null default 'app' check (source in ('app', 'line', 'shortcut', 'template', 'routine')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- task_checklist_items
-- ============================================================
create table public.task_checklist_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  label text not null,
  done boolean not null default false,
  position integer not null default 0
);

-- ============================================================
-- time_entries: 実績時間（開始/終了の記録、裏タイマーなし）
-- ============================================================
create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  minutes integer not null,
  was_confirmed boolean not null default false, -- 止め忘れ疑いで人が確認・修正したか
  created_at timestamptz not null default now()
);

-- ============================================================
-- calendar_events_cache: Google カレンダーの読み取りキャッシュ（v1は読み取りのみ）
-- ============================================================
create table public.calendar_events_cache (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  google_event_id text not null,
  calendar_id text not null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_all_day boolean not null default false,
  synced_at timestamptz not null default now(),
  unique (owner_id, calendar_id, google_event_id) -- 再同期での重複キャッシュを防ぐ
);

-- ============================================================
-- トリガー: 新規ユーザー登録時に profiles を自動作成
-- ============================================================
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, timezone, workday_start, workday_end)
  values (new.id, 'Asia/Tokyo', '09:00', '22:00')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- トリガー: updated_at 自動更新（updated_at を持つのは tasks のみ）
-- ============================================================
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ==================== migrations/0002_indexes.sql ====================
-- Tempus: インデックス
-- 実クエリに効くものだけ。Free枠500MBを食うので使われないインデックスは作らない。
-- profiles.line_user_id は 0001 の UNIQUE 制約で既にインデックス済み（④逆引き）なのでここでは作らない。

-- ① 自分の未完了タスクを優先度順（status <> 'done' の部分インデックス）
create index idx_tasks_owner_open_priority
  on public.tasks (owner_id, status, importance, due_at)
  where status <> 'done';

-- ② 指定日の scheduled_start 範囲
create index idx_tasks_owner_scheduled_start
  on public.tasks (owner_id, scheduled_start)
  where scheduled_start is not null;

-- ③ 指定日の calendar_events_cache 範囲
create index idx_calendar_events_owner_start
  on public.calendar_events_cache (owner_id, start_at);

-- ⑤ task_id での time_entries 参照
create index idx_time_entries_task_id
  on public.time_entries (task_id);

-- ==================== migrations/0003_rls.sql ====================
-- Tempus: Row Level Security
-- 設計思想: 共有はプロジェクト単位。project_id が NULL のタスク（受信箱）は所有者本人だけ。
--
-- 罠: project_members のポリシーが project_members 自体を SELECT する条件式を書くと、
-- ポリシー評価 -> ポリシー評価 -> ... と無限再帰して "infinite recursion detected in policy"
-- エラーになる。回避のため、判定ロジックは SECURITY DEFINER の helper function に切り出す。
-- SECURITY DEFINER 関数はテーブル所有者（マイグレーション実行ロール）の権限で生データに
-- アクセスするため RLS を経由せず、再帰の入口にならない。

-- ============================================================
-- helper functions（SECURITY DEFINER で RLS を経由せず判定する）
-- ============================================================

-- プロジェクトのオーナーか
create function public.is_project_owner(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = p_user_id
  );
$$;

-- プロジェクトのメンバー（オーナー含む）として閲覧権があるか
create function public.is_project_member(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    public.is_project_owner(p_project_id, p_user_id)
    or exists (
      select 1 from public.project_members
      where project_id = p_project_id and user_id = p_user_id
    );
$$;

-- プロジェクトへの書き込み権があるか（owner ロール or editor ロール、またはプロジェクトオーナー本人）
create function public.can_edit_project(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    public.is_project_owner(p_project_id, p_user_id)
    or exists (
      select 1 from public.project_members
      where project_id = p_project_id
        and user_id = p_user_id
        and role in ('owner', 'editor')
    );
$$;

-- ============================================================
-- RLS 有効化
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_checklist_items enable row level security;
alter table public.time_entries enable row level security;
alter table public.calendar_events_cache enable row level security;

-- ============================================================
-- profiles: 本人のみ。display_name の同僚公開は下の関数経由で行う
-- （RLS は行単位の制御しかできず列単位では絞れないため、
-- 　「同じプロジェクトのメンバーは display_name だけ見える」は
-- 　このテーブルのポリシーを緩めるのではなく別関数で実現する）
-- ============================================================
create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = id);

create policy profiles_insert_own
  on public.profiles for insert
  with check (auth.uid() = id);

create policy profiles_update_own
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 将来の担当表示用: 同じプロジェクトのメンバーの id / display_name だけを返す
create function public.get_project_member_names(p_project_id uuid)
returns table (id uuid, display_name text)
language sql
security definer
stable
set search_path = public
as $$
  select p.id, p.display_name
  from public.profiles p
  where public.is_project_member(p_project_id, auth.uid())
    and (
      p.id in (select user_id from public.project_members where project_id = p_project_id)
      or p.id = (select owner_id from public.projects where id = p_project_id)
    );
$$;

-- ============================================================
-- projects
-- ============================================================
create policy projects_select
  on public.projects for select
  using (owner_id = auth.uid() or public.is_project_member(id, auth.uid()));

create policy projects_insert
  on public.projects for insert
  with check (owner_id = auth.uid());

create policy projects_update
  on public.projects for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy projects_delete
  on public.projects for delete
  using (owner_id = auth.uid());

-- ============================================================
-- project_members
-- 追加/削除/ロール変更はプロジェクトオーナーのみ（メンバーは自分の脱退のみ可）
-- ============================================================
create policy project_members_select
  on public.project_members for select
  using (
    user_id = auth.uid()
    or public.is_project_owner(project_id, auth.uid())
    or public.is_project_member(project_id, auth.uid())
  );

create policy project_members_insert
  on public.project_members for insert
  with check (public.is_project_owner(project_id, auth.uid()));

create policy project_members_update
  on public.project_members for update
  using (public.is_project_owner(project_id, auth.uid()))
  with check (public.is_project_owner(project_id, auth.uid()));

create policy project_members_delete
  on public.project_members for delete
  using (public.is_project_owner(project_id, auth.uid()) or user_id = auth.uid());

-- ============================================================
-- tasks
-- ============================================================
create policy tasks_select
  on public.tasks for select
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.is_project_member(project_id, auth.uid()))
  );

create policy tasks_insert
  on public.tasks for insert
  with check (
    owner_id = auth.uid()
    and (project_id is null or public.can_edit_project(project_id, auth.uid()))
  );

create policy tasks_update
  on public.tasks for update
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  )
  with check (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  );

create policy tasks_delete
  on public.tasks for delete
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  );

-- ============================================================
-- task_checklist_items: 親タスクの可視性/編集権をそのまま継承
-- ============================================================
create policy task_checklist_items_select
  on public.task_checklist_items for select
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.is_project_member(t.project_id, auth.uid()))
        )
    )
  );

-- insert/update/delete を個別に定義（for all にすると select ポリシーと重複評価されるため）
create policy task_checklist_items_insert
  on public.task_checklist_items for insert
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

create policy task_checklist_items_update
  on public.task_checklist_items for update
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  )
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

create policy task_checklist_items_delete
  on public.task_checklist_items for delete
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

-- ============================================================
-- time_entries: 実績時間は本人のみ（読み書きとも）
-- ============================================================
create policy time_entries_all
  on public.time_entries for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ============================================================
-- calendar_events_cache: Google カレンダーの個人キャッシュ。本人のみ
-- ============================================================
create policy calendar_events_cache_all
  on public.calendar_events_cache for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ==================== migrations/0004_seed_dev.sql ====================
-- Tempus: 開発用シード（コメントアウト状態で配置。手で流す用）
-- 実行前に auth.users にテストユーザーを作成し、以下の <YOUR_USER_ID> を実際の uuid に置き換えること。
--
-- begin;
--
-- insert into public.profiles (id, display_name, timezone, workday_start, workday_end)
-- values ('<YOUR_USER_ID>', '開発太郎', 'Asia/Tokyo', '09:00', '22:00')
-- on conflict (id) do nothing;
--
-- insert into public.projects (id, owner_id, name, color)
-- values ('00000000-0000-0000-0000-000000000001', '<YOUR_USER_ID>', '本業', '#3B82F6')
-- on conflict (id) do nothing;
--
-- insert into public.tasks (project_id, owner_id, title, status, importance, estimate_min, estimate_is_inferred, source)
-- values
--   (null, '<YOUR_USER_ID>', '受信箱のタスク（未仕分け）', 'todo', 'mid', 30, true, 'app'),
--   ('00000000-0000-0000-0000-000000000001', '<YOUR_USER_ID>', 'プロジェクトのタスク', 'todo', 'high', 60, false, 'line');
--
-- commit;

-- ==================== migrations/0005_line_events.sql ====================
-- LINE webhookの冪等性テーブル。
--
-- LINEはwebhookのレスポンスが遅い/失敗した場合に同一イベントを再送することがある。
-- webhookEventIdをここに記録し、2回目以降の到着ではタスクを二重に作らない
-- （supabase/functions/line-webhook/index.ts 参照）。
--
-- 注意: public.tasks(id) への外部キーがあるため、tasksテーブルを作る0001_init.sqlより
-- 後に適用されること（マイグレーションはファイル名順に適用されるので通常は問題ない）。

create table if not exists public.line_webhook_events (
  event_id text primary key,
  task_id uuid references public.tasks (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.line_webhook_events is
  'LINE webhookの再送対策。event_id(=webhookEventId)ごとに1回だけタスクを起票する。';

-- Edge FunctionはSUPABASE_SERVICE_ROLE_KEYで操作する（RLSをバイパスする）。
-- 一般ユーザー（anon/authenticated）からは読み書き不要なので明示的に閉じる。
alter table public.line_webhook_events enable row level security;
revoke all on public.line_webhook_events from anon, authenticated;

-- ==================== migrations/0006_grants.sql ====================
-- 明示的な権限付与。
--
-- Supabase プロジェクト作成時に「Automatically expose new tables」を OFF にしているため、
-- 新しいテーブルは自動では公開されない。ここで許可したものだけが Data API から触れる。
--
-- なぜ自動公開に頼らないか: 自動公開のまま RLS を付け忘れたテーブルを作ると、データが
-- 黙って漏れる。明示付与なら書き忘れたテーブルは "permission denied" でうるさく壊れる。
-- 同じ付け忘れでも、後者は事故にならない。
--
-- 実際にアクセスできること／できないことは `npm run verify:db` で検証している。

-- スキーマ自体の使用許可。これだけでは中身は一切見えない。
grant usage on schema public to anon, authenticated;

-- 匿名（未ログイン）には一切与えない。ログインして初めて自分の行が見える。
-- anon への grant は下に一切書かないこと。

grant select, insert, update, delete on public.profiles             to authenticated;
grant select, insert, update, delete on public.projects             to authenticated;
grant select, insert, update, delete on public.project_members      to authenticated;
grant select, insert, update, delete on public.tasks                to authenticated;
grant select, insert, update, delete on public.task_checklist_items to authenticated;
grant select, insert, update, delete on public.time_entries         to authenticated;
grant select, insert, update, delete on public.calendar_events_cache to authenticated;

-- line_webhook_events には意図的に何も与えない。
-- Edge Function が service_role で書く内部テーブルで、ブラウザからは触る必要がない。

-- RLSポリシーの中で呼ばれる関数は、問い合わせたユーザーの権限で実行される。
-- ここで EXECUTE を与えないと、ポリシー評価そのものが権限エラーで落ちる。
grant execute on function public.is_project_owner(uuid, uuid)        to authenticated;
grant execute on function public.is_project_member(uuid, uuid)       to authenticated;
grant execute on function public.can_edit_project(uuid, uuid)        to authenticated;
grant execute on function public.get_project_member_names(uuid)      to authenticated;

-- handle_new_user / set_updated_at はトリガー経由でのみ動くので付与不要。

