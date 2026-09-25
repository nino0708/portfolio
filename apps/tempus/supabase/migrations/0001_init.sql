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
