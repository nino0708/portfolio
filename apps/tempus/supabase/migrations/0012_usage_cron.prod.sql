-- 予算ガードを毎日1回自動で走らせる。
--
-- ⚠️ ファイル名が .prod.sql なのは、pg_cron / pg_net / vault が PGlite（ローカル検証用の
--    WASM版Postgres）に存在せず、`npm run verify:db` では流せないため。検証側で除外している。
--    本番のSQLエディタでのみ実行すること。
--
-- なぜ外部のスケジューラ（GitHub Actions等）ではなく Supabase 内で回すか:
--   ①依存先が増えない ②この定期実行自体が「7日間未使用でプロジェクト停止」の防止になる
--
-- Free プランは課金が発生しない。これは請求監視ではなく「止まらないこと」の監視。

-- 1) 拡張機能。ダッシュボードの Database > Extensions から有効化済みなら create は不要だが、
--    冪等なので流して構わない。失敗する場合はダッシュボードから pg_cron と pg_net を有効化すること。
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- 2) 共有シークレットは Vault に入れる。cron のジョブ定義は pg_catalog に平文で残るため、
--    ジョブ本体に鍵を直書きすると `select * from cron.job` で誰でも読めてしまう。
--    ここでは入れない（値をマイグレーションに書かないため）。先に下記を1回だけ手で実行しておくこと:
--
--      select vault.create_secret('<USAGE_GUARD_KEYの値>', 'usage_guard_key', 'usage-guard Edge Function の共有シークレット');
--
--    入れ替えるときは:
--      select vault.update_secret((select id from vault.secrets where name='usage_guard_key'), '<新しい値>');

-- 3) 二重登録を防ぐため、同名ジョブがあれば先に外す
do $$
begin
  if exists (select 1 from cron.job where jobname = 'tempus-usage-guard-daily') then
    perform cron.unschedule('tempus-usage-guard-daily');
  end if;
end $$;

-- 4) 毎日 JST 08:00 に実行する。cron は UTC なので 23:00 UTC = 翌 08:00 JST。
--    朝にしたのは、警告が出た日にその日のうちに手を打てるようにするため。
select cron.schedule(
  'tempus-usage-guard-daily',
  '0 23 * * *',
  $job$
  select net.http_post(
    url     := 'https://nucqcatwhwdjsphetops.supabase.co/functions/v1/usage-guard',
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-usage-guard-key',
                 (select decrypted_secret from vault.decrypted_secrets where name = 'usage_guard_key')
               ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 20000
  );
  $job$
);

-- 5) 一般ユーザーからは cron / net に一切触らせない（既定でも触れないが明示しておく）
revoke all on schema cron from anon, authenticated;
