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
