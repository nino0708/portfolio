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
