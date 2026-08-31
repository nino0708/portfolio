-- Tempus: タスクに「着手可能日」を追加する。
--
-- これまで tasks には dueAt（終わらせる期限）しかなく、「いつから手を付けていいか」を
-- 表現できなかった。週次・月次で「この期間にやる」を俯瞰できるようにするため、
-- 着手可能日を追加する。dueAt 同様、必須ではない（タイトルだけで起票できる方針を崩さない）。

alter table public.tasks
  add column window_start date;

comment on column public.tasks.window_start is
  '着手可能日。null = 未設定。due_at と組み合わせて「いつからいつまでに終わらせるか」の期間を表す。';
