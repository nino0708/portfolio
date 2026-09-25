-- Tempus: 外部AIエージェント（Fridayのクラウドルーティン等）からの受け口。
--
-- Google Driveに置きっぱなしになっている各部署の日次/週次レポートと、コピペするだけの
-- X投稿文案を、Edge Function（supabase/functions/agent-ingest）経由でここに集約する。
-- 書き込みは常にそのEdge FunctionがSUPABASE_SERVICE_ROLE_KEYで行う（RLSをバイパスする）。
-- ブラウザ（authenticated）側は自分の行を読むだけで、書き込みは clips.posted_at の
-- チェックのみ許可する（「投稿した」を人が押せるように）。

-- ============================================================
-- reports: 各部署のレポート（Google Driveに保存されていたMarkdown）
-- ============================================================
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  source text not null,          -- 例 '仕入れリサーチ部'
  title text not null,
  body_md text,
  url text,
  reported_for date,             -- 何日分のレポートか
  dedupe_key text not null,      -- 省略時はEdge Function側でsource+title+reportedForから生成
  created_at timestamptz not null default now(),
  unique (owner_id, dedupe_key)  -- 同じレポートの二重登録を防ぐ
);

comment on table public.reports is
  '外部エージェントが送ってくる各部署レポート。agent-ingest Edge Functionのみが書き込む。';

-- ============================================================
-- clips: 「貼るだけ」テキスト（X投稿文案など）
-- ============================================================
create table public.clips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  text text not null,
  url text,
  kind text not null default 'x_post',
  posted_at timestamptz,         -- 人が「投稿した」を押した時刻。null = 未処理
  dedupe_key text not null,
  created_at timestamptz not null default now(),
  unique (owner_id, dedupe_key)
);

comment on table public.clips is
  '外部エージェントが送ってくるコピペ用テキスト。posted_atはUIから人が更新する唯一の書き込み経路。';

-- ============================================================
-- agent_ingest_log: 何をいつ受け取ったかの記録
-- ============================================================
create table public.agent_ingest_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  agent text not null,           -- 送ってきたルーティン名（例 '社長室（秘書）'）
  received_at timestamptz not null default now(),
  counts jsonb not null default '{}'::jsonb,  -- 例 {"tasks":3,"reports":1,"clips":2}
  raw_bytes integer not null default 0
);

comment on table public.agent_ingest_log is
  'agent-ingest Edge Functionが受け取ったリクエストの監査ログ。挿入のみ・訂正しない。';

-- ============================================================
-- agent_task_dedupe: tasksの冪等性を側テーブルで持つ（line_webhook_eventsと同じ考え方）。
--
-- tasks自体にdedupe_keyカラムを足すとsrc/types/domain.tsのTask型と食い違ってしまう
-- （domain.tsが唯一の正）。なのでtasksのスキーマには一切触れず、dedupe_key -> task_id
-- の対応だけをここに持たせて、agent-ingestからの重複INSERTをON CONFLICTで弾く。
-- ============================================================
create table public.agent_task_dedupe (
  owner_id uuid not null references auth.users (id) on delete cascade,
  dedupe_key text not null,
  task_id uuid references public.tasks (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (owner_id, dedupe_key)
);

comment on table public.agent_task_dedupe is
  'agent-ingestが起票したtasksの冪等性キー。ブラウザからは触れない（service_role専用）。';

-- line_webhook_eventsと同じ扱い: RLSは有効化した上でanon/authenticated双方から明示的に閉じる。
alter table public.agent_task_dedupe enable row level security;
revoke all on public.agent_task_dedupe from anon, authenticated;

-- ============================================================
-- インデックス（ホーム集約の主要クエリにだけ効かせる。Free枠500MB節約のため最小限）
-- ============================================================

-- ホームの「新着レポート」表示（本人の最近順）
create index idx_reports_owner_created
  on public.reports (owner_id, created_at desc);

-- ホームの「未投稿クリップ」表示（posted_at is null のものだけを頻繁に引く）
create index idx_clips_owner_unposted
  on public.clips (owner_id, created_at desc)
  where posted_at is null;

-- ============================================================
-- RLS: 3テーブルとも有効化。owner_id = auth.uid() の本人だけが読める。
-- ============================================================
alter table public.reports enable row level security;
alter table public.clips enable row level security;
alter table public.agent_ingest_log enable row level security;

create policy reports_select_own
  on public.reports for select
  using (owner_id = auth.uid());

-- update だけ許可（reportsは基本Edge Functionが書くのみだが、grants/policyの対称性のため
-- reports/clips 双方に用意する。今のUIはclips.posted_atしか更新しない）
create policy reports_update_own
  on public.reports for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy clips_select_own
  on public.clips for select
  using (owner_id = auth.uid());

-- 人が「投稿した」を押してposted_atを更新できるようにする唯一の書き込み経路
create policy clips_update_own
  on public.clips for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy agent_ingest_log_select_own
  on public.agent_ingest_log for select
  using (owner_id = auth.uid());

-- insert/delete のポリシーは意図的に作らない。書き込みはEdge Functionのservice_role
-- （RLSをバイパスする）のみが行う。

-- ============================================================
-- GRANT: 0006_grants.sql の流儀に合わせて authenticated にだけ明示付与。
-- anon への grant はここでも一切書かない（0007_revoke_anon.sql の方針を継続）。
-- ============================================================
grant select, update on public.reports         to authenticated;
grant select, update on public.clips           to authenticated;
grant select         on public.agent_ingest_log to authenticated;

-- 念のため anon には明示的に何も無いことを確認する意味で書いておく（0007の
-- alter default privileges によりデフォルトで付与されないが、defense in depth）。
revoke all on public.reports, public.clips, public.agent_ingest_log from anon;
