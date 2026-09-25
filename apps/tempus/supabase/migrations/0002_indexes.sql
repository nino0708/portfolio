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
