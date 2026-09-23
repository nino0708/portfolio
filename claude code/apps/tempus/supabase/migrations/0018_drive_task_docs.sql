-- Tempus: タスクごとの「思考ログ」Googleドキュメントを Drive に作って紐付ける。
--
-- Drive 上は  Tempus/<プロジェクト名>/<起票日>_<タイトル>  の形に置く。
-- プロジェクト未設定のタスクは  Tempus/受信箱/  に置く。
-- ドキュメントの実体は Drive 側にあり、ここには ID と URL を覚えておくだけ。
-- タスクを消してもドキュメントは消さない（Drive に残し続けるのが目的）。
-- 作成・移動・名前の付け直しは drive-sync（Edge Function）だけが行う。

alter table public.google_credentials
  add column drive_root_folder_id text,
  add column drive_inbox_folder_id text,
  add column drive_last_sync_at timestamptz,
  add column drive_last_error text;

comment on column public.google_credentials.drive_root_folder_id is
  'Drive 上の「Tempus」フォルダ。消されていたら drive-sync が作り直す。';
comment on column public.google_credentials.drive_inbox_folder_id is
  'プロジェクト未設定のタスクを置く「受信箱」フォルダ。';

alter table public.projects
  add column drive_folder_id text,
  add column drive_folder_name text;

comment on column public.projects.drive_folder_id is
  'このプロジェクトのタスクのドキュメントを置く Drive フォルダ。';
comment on column public.projects.drive_folder_name is
  'Drive 上のフォルダ名。name と食い違ったら（プロジェクト名を変えたら）次の同期で付け直す。';

alter table public.tasks
  add column drive_doc_id text,
  add column drive_doc_url text,
  add column drive_doc_title text,
  add column drive_parent_id text,
  add column drive_done_logged_at timestamptz;

comment on column public.tasks.drive_doc_id is
  '思考ログの Googleドキュメント。null = まだ作っていない（次の同期で作る）。';
comment on column public.tasks.drive_doc_url is
  'ドキュメントを開く URL。タスク詳細の「思考ログを開く」がこれを使う。';
comment on column public.tasks.drive_doc_title is
  'Drive 上のドキュメント名。タイトルを直したら次の同期で付け直す。';
comment on column public.tasks.drive_parent_id is
  'ドキュメントが今入っているフォルダ。プロジェクトを移したら次の同期で移動する。';
comment on column public.tasks.drive_done_logged_at is
  '完了の一文をドキュメントに追記した時刻。二重に追記しないための印。';

-- ドキュメントがまだ無いタスクを拾う同期処理用
create index if not exists tasks_owner_drive_doc_missing_idx
  on public.tasks (owner_id, created_at)
  where drive_doc_id is null;
