/**
 * マイグレーションを本物の Postgres（PGlite = PG16 の WASM ビルド）に流し、
 * RLS が実際に他人を弾くかを挙動で確かめる。`npm run verify:db` で実行。
 *
 * 落とし穴: SET LOCAL はトランザクション内でしか効かない。外で使うと黙って無視され、
 * superuser のまま走って RLS を素通りする＝テストが通ったように見えて何も検証していない。
 * だから as()/asCommit() は必ず begin で包み、冒頭でハーネス自体の健全性を確認している。
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// パスに空白が含まれると URL.pathname は %20 のままになるので fileURLToPath を使う
const DIR = fileURLToPath(new URL('../migrations/', import.meta.url));
const db = await new PGlite();

await db.exec(`
  create schema if not exists auth;
  create table auth.users (id uuid primary key, email text,
    raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now());
  create or replace function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create role authenticated; create role anon; create role service_role;
  grant usage on schema auth to authenticated, anon, service_role;
  -- 本番の Supabase では anon にテーブル権限が既定で付く（作成時のトグルを OFF にしても
  -- 実際に付いていた）。それを再現しておかないと 0007 の剥奪が効いたかを検証できず、
  -- 「もともと権限が無いから通る」だけのテストになる。
  alter default privileges in schema public grant all on tables to anon;
`);
// .prod.sql は pg_cron / pg_net / vault を使うもので、PGlite には存在しない。
// ここで流すと検証が丸ごと落ちるので除外する（本番のSQLエディタでのみ実行する）。
const migrationFiles = readdirSync(DIR)
  .filter((f) => f.endsWith('.sql') && !f.endsWith('.prod.sql'))
  .sort();
for (const f of migrationFiles) {
  await db.exec(readFileSync(join(DIR, f), 'utf8'));
}

// Supabase では authenticated ロールで実行される。RLS は所有者だとすり抜けるので force する。
await db.exec(`
  -- public への権限は 0006_grants.sql が与える。ここで一括付与すると
  -- 「GRANTが正しいか」を何も検証しないテストになるので、絶対に足さないこと。
  grant execute on function auth.uid() to authenticated, anon, service_role;
  do $$ declare t text; begin
    for t in select tablename from pg_tables where schemaname='public' loop
      execute format('alter table public.%I force row level security', t);
    end loop; end $$;
`);

const A = '11111111-1111-1111-1111-111111111111';
const B = '22222222-2222-2222-2222-222222222222';
await db.exec(`insert into auth.users(id,email) values
  ('${A}','a@example.com'), ('${B}','b@example.com');`);

// ロール切り替えはセッションレベルの SET で行い、トランザクションは一切使わない。
//
// 最初は begin + SET LOCAL + rollback で書いていたが、それだと挿入がコミットされず、
// あとの読み取りの rollback でテストデータごと消えた（PGlite は単一接続なので、
// 別ユーザーの読み取りも同じトランザクションの中に入ってしまう）。
// SET LOCAL を使うなら「トランザクション外では黙って無視される」ことも合わせて罠になる。
const runAs = async (role, uid, sql) => {
  await db.exec(`set "request.jwt.claim.sub" = '${uid ?? ''}'; set role ${role};`);
  try {
    return await db.query(sql);
  } finally {
    await db.exec(`reset role; set "request.jwt.claim.sub" = '';`);
  }
};
const as = (uid, sql) => runAs('authenticated', uid, sql);
const asCommit = as;              // 自動コミットなので書き込みも同じ経路でよい
const asAnon = (sql) => runAs('anon', null, sql);

// ハーネス自体の健全性チェック: 本当に authenticated として実行できているか
{
  const who = await as(A, `select current_user::text u, auth.uid()::text uid`);
  if (who.rows[0].u !== 'authenticated' || who.rows[0].uid !== A) {
    console.error('ハーネスが壊れている:', who.rows[0]);
    process.exit(2);
  }
  console.log('（ハーネス確認: current_user=authenticated / auth.uid() 一致）\n');
}

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => {
  if (ok) { pass++; console.log(`OK   ${name}`); }
  else { fail++; console.log(`FAIL ${name} ${extra}`); }
};

// 新規ユーザーで profiles 行が自動生成されるか
const profs = await db.query(`select id from public.profiles order by id`);
check('新規ユーザーに profiles 行が自動作成される', profs.rows.length === 2, JSON.stringify(profs.rows));

// A がプロジェクトを作り、B を viewer で招く
const proj = await asCommit(A, `insert into public.projects(owner_id,name,color)
  values ('${A}','共有案件','#1f6f4a') returning id`);
const pid = proj.rows[0].id;
await asCommit(A, `insert into public.project_members(project_id,user_id,role)
  values ('${pid}','${B}','viewer')`);
// A のプロジェクト内タスクと、A の受信箱タスク（project_id = NULL）
await asCommit(A, `insert into public.tasks(owner_id,project_id,title) values ('${A}','${pid}','共有されるタスク')`);
await asCommit(A, `insert into public.tasks(owner_id,title) values ('${A}','受信箱の秘密')`);

// B から見えるもの
const bSees = await as(B, `select title from public.tasks order by title`);
const titles = bSees.rows.map(r => r.title);
check('B は共有プロジェクトのタスクが見える', titles.includes('共有されるタスク'), JSON.stringify(titles));
check('B は A の受信箱タスクが見えない', !titles.includes('受信箱の秘密'), JSON.stringify(titles));

// ログイン済みは自分のタスクを読める（＝付与が足りていて、締めすぎてもいない）
const aSees = await as(A, `select count(*)::int n from public.tasks`);
check('ログイン済みは自分のタスクを読める', aSees.rows[0].n === 2, JSON.stringify(aSees.rows));

// viewer は書けない
let wrote = false;
try {
  await asCommit(B, `insert into public.tasks(owner_id,project_id,title)
    values ('${B}','${pid}','viewerが書いた')`);
  wrote = true;
} catch { /* 期待通り弾かれる */ }
check('viewer はタスクを追加できない', !wrote);

// project_members のポリシーが無限再帰しないこと（再帰すると例外かハングになる）
let recursed = false;
try {
  await as(B, `select count(*) from public.project_members`);
} catch (e) {
  recursed = /recursion|stack depth/i.test(e.message);
  if (!recursed) throw e;
}
check('project_members のRLSが無限再帰しない', !recursed);

// 他人のプロフィールは読めない
const bProf = await as(B, `select id from public.profiles`);
check('profiles は本人の行しか見えない',
  bProf.rows.length === 1 && bProf.rows[0].id === B, JSON.stringify(bProf.rows));

// --- 0006_grants.sql の検証（自動公開を切っているので、明示付与が唯一の入口） ---

// 未ログイン（anon）は何も読めない
let anonRead = false;
try { await asAnon(`select count(*) from public.tasks`); anonRead = true; } catch { /* 期待通り */ }
check('未ログイン(anon)はタスクを読めない', !anonRead);

// LINE の内部テーブルはブラウザから触れない（service_role 専用）
let sawLineTable = false;
try { await as(B, `select count(*) from public.line_webhook_events`); sawLineTable = true; } catch { /* 期待通り */ }
check('line_webhook_events は authenticated から触れない', !sawLineTable);

// --- owner_id の既定値（本番で実際に踏んだ事故の回帰テスト） ---
//
// owner_id が not null なのに既定値が無く、クライアントも指定していなかったため、
// タスクの保存が毎回失敗していた。しかもアプリ側が失敗を「オフライン」と誤判定して
// キューに逃がしていたので、画面上はエラーが見えなかった。

{
  let ok = false, msg = '';
  try {
    await as(A, `insert into public.tasks (title) values ('owner_id を書かずに保存')`);
    ok = true;
  } catch (e) { msg = e.message; }
  check('owner_id を指定しなくてもタスクを保存できる', ok, msg);
}

{
  const r = await as(A, `select owner_id::text o from public.tasks where title = 'owner_id を書かずに保存'`);
  check('その行の持ち主がログイン中の本人になっている',
    r.rows.length === 1 && r.rows[0].o === A, JSON.stringify(r.rows));
}

{
  // 他人のIDを詐称して書き込めないこと（既定値があっても RLS が効いているか）
  let blocked = false;
  try {
    await as(A, `insert into public.tasks (title, owner_id) values ('なりすまし', '${B}')`);
  } catch { blocked = true; }
  check('他人を持ち主にしたタスクは作れない', blocked);
}

// --- 0016_clip_task_link.sql: 投稿文案とタスクの紐付け ---
//
// clips は agent-ingest（service_role）が書くのでここでは superuser で入れ、
// 読み取りとタスク削除時の挙動だけを authenticated の目線で確かめる。

{
  const t = await db.query(`insert into public.tasks(owner_id,title)
    values ('${A}','Friday商事 X投稿') returning id`);
  const taskId = t.rows[0].id;
  await db.query(`insert into public.clips(owner_id,label,text,task_id,dedupe_key)
    values ('${A}','朝の投稿','（投稿文）','${taskId}','clip-1')`);

  const aSees = await as(A, `select task_id::text tid from public.clips where dedupe_key='clip-1'`);
  check('本人は自分のクリップと紐付いたタスクIDを読める',
    aSees.rows.length === 1 && aSees.rows[0].tid === taskId, JSON.stringify(aSees.rows));

  const bSees = await as(B, `select count(*)::int n from public.clips`);
  check('他人のクリップは読めない', bSees.rows[0].n === 0, JSON.stringify(bSees.rows));

  // タスクを消しても投稿文まで道連れにしない（on delete set null）
  await asCommit(A, `delete from public.tasks where id = '${taskId}'`);
  const after = await as(A, `select task_id from public.clips where dedupe_key='clip-1'`);
  check('タスクを消してもクリップは残り、紐付けだけが外れる',
    after.rows.length === 1 && after.rows[0].task_id === null, JSON.stringify(after.rows));
}

// --- 0019_verifications.sql: 検証ログ（tasks/clips とは無関係の独立テーブル） ---

{
  await asCommit(A, `insert into public.verifications (hypothesis) values ('Aの仮説')`);

  const aSees = await as(A, `select hypothesis from public.verifications`);
  check('本人は自分の検証ログを読める',
    aSees.rows.length === 1 && aSees.rows[0].hypothesis === 'Aの仮説', JSON.stringify(aSees.rows));

  const bSees = await as(B, `select count(*)::int n from public.verifications`);
  check('他人の検証ログは読めない', bSees.rows[0].n === 0, JSON.stringify(bSees.rows));

  let spoofed = false;
  try {
    await as(A, `insert into public.verifications (hypothesis, owner_id) values ('なりすまし','${B}')`);
  } catch { spoofed = true; }
  check('他人を持ち主にした検証ログは作れない', spoofed);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exitCode = 1;
