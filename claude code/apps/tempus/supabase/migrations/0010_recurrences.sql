-- 「毎日やっている作業」を毎朝タスクとして自動で起こす仕組み。
--
-- X投稿のように毎日やる作業を、その都度手で書くのは起票コストそのもの。
-- ルールだけ登録しておけば、その日に該当する分が自動でタスクになる。
--
-- ルールは cron 式ではなく人が読める短い文字列で持つ（'daily' / 'weekdays' /
-- 'weekly:1,3,5' / 'monthly:15'）。判定の実体は src/lib/recurrence.ts にあり、
-- そちらにテストがある。DBは保存だけを担当し、解釈はしない。

create table public.recurrences (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users (id) on delete cascade,
  project_id   uuid references public.projects (id) on delete set null,
  title        text not null,
  notes        text,
  rule         text not null,
  time_of_day  text,                                   -- 'HH:MM' 置きたい時間帯のヒント
  estimate_min integer not null default 30,
  importance   text not null default 'mid' check (importance in ('low','mid','high')),
  checklist    jsonb not null default '[]'::jsonb,     -- 定型作業の手順（文字列の配列）
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger recurrences_set_updated_at
  before update on public.recurrences
  for each row execute function public.set_updated_at();

-- その日にどの繰り返しを起こしたかの記録。
-- unique 制約が二重起票を防ぐ唯一の砦。アプリを複数タブで開いても1件しか入らない。
create table public.recurrence_runs (
  id            uuid primary key default gen_random_uuid(),
  recurrence_id uuid not null references public.recurrences (id) on delete cascade,
  owner_id      uuid not null references auth.users (id) on delete cascade,
  for_date      date not null,
  task_id       uuid references public.tasks (id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (recurrence_id, for_date)
);

create index recurrences_owner_active_idx
  on public.recurrences (owner_id) where active;

create index recurrence_runs_owner_date_idx
  on public.recurrence_runs (owner_id, for_date);

-- ---- RLS ----
alter table public.recurrences enable row level security;
alter table public.recurrence_runs enable row level security;

create policy recurrences_own on public.recurrences
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy recurrence_runs_own on public.recurrence_runs
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ---- GRANT（0006 の流儀: authenticated にだけ明示付与。anon には与えない）----
grant select, insert, update, delete on public.recurrences     to authenticated;
grant select, insert, update, delete on public.recurrence_runs to authenticated;
revoke all on public.recurrences     from anon;
revoke all on public.recurrence_runs from anon;
