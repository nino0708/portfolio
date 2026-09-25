-- Tempus: clips を「どのタスクの分か」に紐付ける。
--
-- これまで clips は宙に浮いていた。agent-ingest が書き込むだけで読み手が一人もおらず、
-- X投稿文案が届いても画面のどこにも出なかった（0008でテーブルだけ作って止まっていた）。
-- タスク行を開くとその投稿文が出る形にするため、clips に task_id を足す。
--
-- 紐付けはリクエスト側から「タスクの dedupeKey」で指定する（agent-ingest が
-- agent_task_dedupe を引いて task_id に解決する）。ルーティンは自分が付けた
-- dedupeKey しか知らないので、UUIDを要求すると連携そのものが書けない。

alter table public.clips
  add column task_id uuid references public.tasks (id) on delete set null;

comment on column public.clips.task_id is
  'この文案が属するタスク。null = どのタスクにも紐付かない単独のクリップ。タスクが消えても文案は残す（on delete set null）。';

-- タスク行を開いた時に「そのタスクの分」だけを引く。
-- 紐付いていない行はこの索引に載せない（Free枠500MBを食わせないため）。
create index idx_clips_owner_task
  on public.clips (owner_id, task_id)
  where task_id is not null;
