-- 未ログイン(anon)から public スキーマの権限を明示的に剥奪する。
--
-- 経緯: プロジェクト作成時に「Automatically expose new tables」を OFF にすれば
-- anon には権限が付かないと想定していたが、実際に本番へ流したところ anon から
-- tasks/profiles などが HTTP 200 で叩けた（中身は RLS が弾いて [] だった）。
-- つまり RLS だけが唯一の防波堤になっていた。RLS を1テーブル書き忘れたら即漏れる。
--
-- Tempus は全機能がログイン必須なので、anon には何も要らない。権限の層でも閉じる。
-- 認証（/auth/v1/*）は PostgREST を通らないので、これでログインは壊れない。

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

-- 今後このスキーマに作られるテーブルにも効かせる（付け忘れ防止）
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

-- スキーマ自体の usage は残す。これだけでは中身は一切見えず、
-- 剥奪すると PostgREST のエラーが分かりにくくなるため。
