-- 毎朝7時に Claude の講評を作って LINE に送る。
--
-- ⚠️ .prod.sql は PGlite に pg_cron / pg_net / vault が無いため検証から除外される。
--    本番のSQLエディタでのみ実行すること。
--
-- 7時にしたのは、8時の予算ガードより前に置いて「今日の見立て → 使用量の警告」の順で
-- 届くようにするため。起きてすぐ今日の組み方が分かる状態にする。
--
-- ⚠️ 事前に Vault へ鍵を入れておくこと（値はマイグレーションに書かない）:
--      select vault.create_secret('<PLAN_REVIEW_KEYの値>', 'plan_review_key', 'plan-review Edge Function の共有シークレット');

do $$
begin
  if exists (select 1 from cron.job where jobname = 'tempus-plan-review-daily') then
    perform cron.unschedule('tempus-plan-review-daily');
  end if;
end $$;

-- 22:00 UTC = 翌 07:00 JST
select cron.schedule(
  'tempus-plan-review-daily',
  '0 22 * * *',
  $job$
  select net.http_post(
    url     := 'https://nucqcatwhwdjsphetops.supabase.co/functions/v1/plan-review',
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-plan-review-key',
                 (select decrypted_secret from vault.decrypted_secrets where name = 'plan_review_key')
               ),
    -- day を省略すると Edge Function 側が JST の当日を使う
    body    := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $job$
);
