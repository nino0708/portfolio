-- owner_id に「今ログインしている人」を既定値として入れる。
--
-- 経緯: owner_id が not null なのに既定値が無く、クライアントも指定していなかったため、
-- タスクの保存が毎回 not-null 違反で失敗していた。本番で実際に踏んだ。
--
-- 直し方は「クライアント側で毎回 owner_id を入れる」でもよいが、それだと
-- 入れ忘れた経路（今後増えるINSERT）が同じ事故を起こす。DB側に既定値を置けば
-- どの経路から入れても必ず正しい持ち主が入る。RLS の with check とも整合する。
--
-- 注意: auth.uid() は service_role で実行すると NULL を返す。Edge Function からの
-- INSERT は今まで通り owner_id を明示すること（agent-ingest はそうしている）。

alter table public.tasks                 alter column owner_id set default auth.uid();
alter table public.projects              alter column owner_id set default auth.uid();
alter table public.time_entries          alter column owner_id set default auth.uid();
alter table public.calendar_events_cache alter column owner_id set default auth.uid();
alter table public.recurrences           alter column owner_id set default auth.uid();
alter table public.recurrence_runs       alter column owner_id set default auth.uid();

-- project_members は「誰を招くか」を指定する表で、持ち主が自分とは限らないため既定値を置かない。
