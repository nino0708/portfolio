// タスクごとの「思考ログ」Googleドキュメントを Drive に作り、置き場所と名前を揃える。
//
//   Tempus/                       … drive_root_folder_id
//   ├─ <プロジェクト名>/           … projects.drive_folder_id
//   │   └─ <起票日>_<タイトル>     … tasks.drive_doc_id
//   └─ その他タスク/              … drive_inbox_folder_id（プロジェクト未設定）
//
// 1回の呼び出しでやること:
//   ① ルート・その他タスク・プロジェクトのフォルダを用意する（消されていたら作り直す／名前を変えたら付け直す）
//   ② ドキュメントがまだ無いタスクに作る（既存タスクの取り込みもこれ。1回あたり上限あり）
//   ③ タイトルを直した／プロジェクトを移したタスクのドキュメントを付け直す・移す
//   ④ 完了したタスクのドキュメント末尾に完了日と実績を追記する
// タスクを消してもドキュメントは消さない。消す処理はこのファイルに一切書かない。
//
// 本文に { action: 'log' } を付けて呼ぶと、同期の代わりに1件の記録を書き足す:
//   { action: 'log', task_id?: string, task_title?: string, author?: 'AI' | '私' | ..., text: string }
// タスクは task_id か task_title（完全一致 → 部分一致の新しい順）で探す。
// ドキュメントがまだ無ければその場で作ってから書き足す。
// Claude のセッションやルーティンが「何をしたか」を残すための入口（x-drive-sync-key で呼ぶ）。
//
// 権限は drive.file（このアプリが作ったファイルにしか触れない）。
// 呼び出し口は calendar-sync と同じく2つ:
//   ① ブラウザから … Authorization: Bearer <ユーザーのJWT>
//   ② cron から   … x-drive-sync-key: <共有シークレット>

import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  ROOT_FOLDER_NAME, INBOX_FOLDER_NAME, completionText, docHtml, docTitle, folderName, logEntryText,
} from '../_shared/driveDoc.ts';

const need = (k: string): string => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`環境変数 ${k} が未設定です`);
  return v;
};

const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_ROLE_KEY = need('SUPABASE_SERVICE_ROLE_KEY');
const GOOGLE_CLIENT_ID = need('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = need('GOOGLE_CLIENT_SECRET');
// 専用の鍵が無ければ calendar-sync の鍵を使い回す（cron の設定を増やさないため）
const SYNC_KEY = Deno.env.get('DRIVE_SYNC_KEY') ?? Deno.env.get('CALENDAR_SYNC_KEY') ?? '';
const OWNER_EMAIL = Deno.env.get('TEMPUS_OWNER_EMAIL') ?? '';

// Edge Function の実行時間に収めるための1回あたりの上限。残りは次の呼び出しで拾う
const MAX_CREATE = 25;
const MAX_UPDATE = 40;

const FOLDER_MIME = 'application/vnd.google-apps.folder';
const DOC_MIME = 'application/vnd.google-apps.document';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-drive-sync-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json', ...cors } });

function timingSafeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  let diff = ab.length ^ bb.length;
  const n = Math.max(ab.length, bb.length);
  for (let i = 0; i < n; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

async function resolveOwner(req: Request): Promise<string | null> {
  const key = req.headers.get('x-drive-sync-key');
  if (key && SYNC_KEY && timingSafeEqual(key, SYNC_KEY)) {
    if (!OWNER_EMAIL) throw new Error('TEMPUS_OWNER_EMAIL が未設定です');
    for (let page = 1; page <= 5; page++) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const hit = data.users.find((u) => u.email === OWNER_EMAIL);
      if (hit) return hit.id;
      if (data.users.length < 200) break;
    }
    throw new Error(`TEMPUS_OWNER_EMAIL(${OWNER_EMAIL}) のユーザーが見つかりません`);
  }
  const auth = req.headers.get('Authorization') ?? '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!jwt) return null;
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user) return null;
  return data.user.id;
}

async function accessTokenFrom(refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`アクセストークンを取り直せない: ${body.error ?? res.status}`);
  }
  return body.access_token as string;
}

/** Google 側のエラー。権限不足（drive.file を許可していない）は再ログインで直るので区別する */
class GoogleError extends Error {
  constructor(public status: number, message: string, public scopeMissing = false) {
    super(message);
  }
}

async function google<T>(token: string, url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  if (res.ok) return await res.json() as T;
  const body = await res.text();
  // API が有効になっていない（has not been used / disabled）のは再ログインでは直らないので含めない
  const scopeMissing = res.status === 403 && /insufficient|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(body);
  throw new GoogleError(res.status, `HTTP ${res.status} ${url.split('?')[0]}: ${body.slice(0, 300)}`, scopeMissing);
}

/** フォルダがまだ使えるか（消された・ゴミ箱に入れられたら使えない） */
async function folderAlive(token: string, id: string | null): Promise<boolean> {
  if (!id) return false;
  try {
    const f = await google<{ trashed?: boolean }>(token, `${DRIVE}/${id}?fields=id,trashed`);
    return !f.trashed;
  } catch (e) {
    if (e instanceof GoogleError && e.status === 404) return false;
    throw e;
  }
}

async function createFolder(token: string, name: string, parent: string | null): Promise<string> {
  const f = await google<{ id: string }>(token, `${DRIVE}?fields=id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: FOLDER_MIME, ...(parent ? { parents: [parent] } : {}) }),
  });
  return f.id;
}

async function patchFile(
  token: string, id: string, patch: { name?: string; addParent?: string; removeParent?: string | null },
): Promise<void> {
  const url = new URL(`${DRIVE}/${id}`);
  url.searchParams.set('fields', 'id');
  if (patch.addParent) url.searchParams.set('addParents', patch.addParent);
  if (patch.addParent && patch.removeParent) url.searchParams.set('removeParents', patch.removeParent);
  await google(token, url.toString(), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch.name ? { name: patch.name } : {}),
  });
}

/** HTML をアップロードして Googleドキュメントに変換させる */
async function createDoc(
  token: string, name: string, parent: string, html: string,
): Promise<{ id: string; webViewLink: string }> {
  const boundary = `tempus${crypto.randomUUID().replace(/-/g, '')}`;
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify({ name, mimeType: DOC_MIME, parents: [parent] }),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    `--${boundary}--`,
  ].join('\r\n');
  return await google<{ id: string; webViewLink: string }>(
    token,
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
    { method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body },
  );
}

/** ドキュメントの末尾に追記する。人が書いた中身には触らない */
async function appendToDoc(token: string, id: string, text: string): Promise<void> {
  await google(token, `https://docs.googleapis.com/v1/documents/${id}:batchUpdate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ insertText: { endOfSegmentLocation: {}, text } }] }),
  });
}

type ProjectRow = { id: string; name: string; drive_folder_id: string | null; drive_folder_name: string | null };
type TaskRow = {
  id: string; project_id: string | null; title: string; notes: string | null; status: string;
  due_at: string | null; window_start: string | null; actual_min: number | null;
  completed_at: string | null; created_at: string;
  drive_doc_id: string | null; drive_doc_title: string | null; drive_parent_id: string | null;
  drive_done_logged_at: string | null;
};

const toDocTask = (t: TaskRow) => ({
  title: t.title, notes: t.notes, status: t.status, dueAt: t.due_at, windowStart: t.window_start,
  actualMin: t.actual_min, completedAt: t.completed_at, createdAt: t.created_at,
});

// 1本の文字列リテラルにしておく（連結すると supabase-js が列を型として読めなくなる）
const TASK_COLS =
  'id,project_id,title,notes,status,due_at,window_start,actual_min,completed_at,created_at,drive_doc_id,drive_doc_title,drive_parent_id,drive_done_logged_at';

type Stats = { foldersCreated: number; foldersRenamed: number; docsCreated: number; docsUpdated: number; completionsLogged: number };
type Cred = { refresh_token: string; drive_root_folder_id: string | null; drive_inbox_folder_id: string | null };

/** ドキュメントの置き場所。プロジェクトのフォルダ（無ければ その他タスク）と、本文に書くプロジェクト名 */
type Placement = {
  parentFor: (t: TaskRow) => string;
  projectFor: (t: TaskRow) => string | null;
};

/** ① ルート・その他タスク・プロジェクトのフォルダを用意する（消されていたら作り直す／名前を変えたら付け直す） */
async function prepareFolders(token: string, ownerId: string, cred: Cred, stats: Stats): Promise<Placement> {
  let rootId = cred.drive_root_folder_id;
  if (!(await folderAlive(token, rootId))) {
    rootId = await createFolder(token, ROOT_FOLDER_NAME, null);
    stats.foldersCreated++;
    await db.from('google_credentials')
      .update({ drive_root_folder_id: rootId, drive_inbox_folder_id: null }).eq('owner_id', ownerId);
    cred.drive_inbox_folder_id = null;
  }
  let inboxId = cred.drive_inbox_folder_id;
  if (!(await folderAlive(token, inboxId))) {
    inboxId = await createFolder(token, INBOX_FOLDER_NAME, rootId);
    stats.foldersCreated++;
    await db.from('google_credentials').update({ drive_inbox_folder_id: inboxId }).eq('owner_id', ownerId);
  }

  const { data: projects, error: pErr } = await db.from('projects')
    .select('id,name,drive_folder_id,drive_folder_name').eq('owner_id', ownerId);
  if (pErr) throw new Error(`プロジェクトを読めない: ${pErr.message}`);

  const folderOf = new Map<string, string>();
  for (const p of (projects ?? []) as ProjectRow[]) {
    const name = folderName(p.name);
    if (!(await folderAlive(token, p.drive_folder_id))) {
      const id = await createFolder(token, name, rootId);
      stats.foldersCreated++;
      await db.from('projects').update({ drive_folder_id: id, drive_folder_name: name }).eq('id', p.id);
      folderOf.set(p.id, id);
      continue;
    }
    folderOf.set(p.id, p.drive_folder_id!);
    if (p.drive_folder_name !== name) {
      await patchFile(token, p.drive_folder_id!, { name });
      stats.foldersRenamed++;
      await db.from('projects').update({ drive_folder_name: name }).eq('id', p.id);
    }
  }
  const projectName = new Map(((projects ?? []) as ProjectRow[]).map((p) => [p.id, p.name]));
  const inbox = inboxId!;
  return {
    // 他人が持ち主のプロジェクトに入っているタスクは、自分の その他タスク に置く
    parentFor: (t) => (t.project_id && folderOf.get(t.project_id)) || inbox,
    projectFor: (t) => (t.project_id && folderOf.has(t.project_id) ? projectName.get(t.project_id) ?? null : null),
  };
}

/**
 * ② タスクのドキュメントを作って紐付ける。紐付けた（または先に紐付いていた）ドキュメントの ID を返す。
 * 同時に2本走っても二重に紐付けない。負けた方は自分が作ったものをゴミ箱へ入れ、勝った方の ID を使う。
 */
async function createDocFor(
  token: string, t: TaskRow, place: Placement, tz: string, stats: Stats,
): Promise<{ id: string; url: string | null } | null> {
  const title = docTitle({ title: t.title, createdAt: t.created_at }, tz);
  const parent = place.parentFor(t);
  const doc = await createDoc(token, title, parent, docHtml(toDocTask(t), place.projectFor(t), tz));
  const { data: won } = await db.from('tasks').update({
    drive_doc_id: doc.id,
    drive_doc_url: doc.webViewLink,
    drive_doc_title: title,
    drive_parent_id: parent,
    drive_done_logged_at: t.status === 'done' ? new Date().toISOString() : null,
  }).eq('id', t.id).is('drive_doc_id', null).select('id');
  if (won && won.length > 0) {
    stats.docsCreated++;
    return { id: doc.id, url: doc.webViewLink };
  }
  await google(token, `${DRIVE}/${doc.id}?fields=id`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }),
  });
  const { data: other } = await db.from('tasks').select('drive_doc_id,drive_doc_url').eq('id', t.id).maybeSingle();
  return other?.drive_doc_id ? { id: other.drive_doc_id as string, url: (other.drive_doc_url as string) ?? null } : null;
}

type LogBody = { action: 'log'; task_id?: unknown; task_title?: unknown; author?: unknown; text?: unknown };

/** 記録を書き足す相手のタスクを探す。完了・削除前のものも含めて、持ち主のタスクだけから探す */
async function findTask(ownerId: string, body: LogBody): Promise<TaskRow | null> {
  if (typeof body.task_id === 'string' && body.task_id) {
    const { data } = await db.from('tasks').select(TASK_COLS)
      .eq('owner_id', ownerId).eq('id', body.task_id).maybeSingle();
    return (data as TaskRow | null) ?? null;
  }
  const title = typeof body.task_title === 'string' ? body.task_title.trim() : '';
  if (!title) return null;
  const { data: exact } = await db.from('tasks').select(TASK_COLS)
    .eq('owner_id', ownerId).eq('title', title).order('created_at', { ascending: false }).limit(1);
  if (exact && exact.length > 0) return exact[0] as TaskRow;
  // ilike の % と _ は文字として扱う
  const pattern = `%${title.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const { data: near } = await db.from('tasks').select(TASK_COLS)
    .eq('owner_id', ownerId).ilike('title', pattern).order('created_at', { ascending: false }).limit(1);
  return near && near.length > 0 ? near[0] as TaskRow : null;
}

async function handleLog(
  token: string, ownerId: string, cred: Cred, tz: string, body: LogBody,
  fail: (msg: string, status: number, needsReconnect?: boolean) => Promise<Response>,
): Promise<Response> {
  const text = typeof body.text === 'string' ? body.text : '';
  const entry = logEntryText({
    author: typeof body.author === 'string' ? body.author : null, text, at: new Date().toISOString(),
  }, tz);
  if (!entry) return json({ ok: false, error: 'text が空' }, 400);
  if (!body.task_id && !body.task_title) return json({ ok: false, error: 'task_id か task_title が必要' }, 400);

  const task = await findTask(ownerId, body);
  // 持ち主の違うタスクは「無い」扱い（有るか無いかも漏らさない）
  if (!task) return json({ ok: false, error: 'タスクが見つからない' }, 404);

  const stats: Stats = { foldersCreated: 0, foldersRenamed: 0, docsCreated: 0, docsUpdated: 0, completionsLogged: 0 };
  try {
    let doc = task.drive_doc_id ? { id: task.drive_doc_id, url: null as string | null } : null;
    if (!doc) {
      const place = await prepareFolders(token, ownerId, cred, stats);
      doc = await createDocFor(token, task, place, tz, stats);
      if (!doc) return json({ ok: false, error: 'ドキュメントを用意できなかった' }, 502);
    }
    await appendToDoc(token, doc.id, entry);
    const { data: row } = await db.from('tasks').select('drive_doc_url').eq('id', task.id).maybeSingle();
    return json({
      ok: true, taskId: task.id, taskTitle: task.title,
      docUrl: (row?.drive_doc_url as string | undefined) ?? doc.url, docCreated: stats.docsCreated > 0,
    });
  } catch (e) {
    if (e instanceof GoogleError && e.scopeMissing) {
      return await fail(`Drive を使う許可がまだ無い。ログインし直して許可して: ${e.message}`, 409, true);
    }
    // 人が Drive からドキュメントを消した場合は 404。作り直しはしない（消したのは本人の意思）
    if (e instanceof GoogleError && e.status === 404) {
      return json({ ok: false, error: 'ドキュメントが Drive から消されている（作り直さない）' }, 410);
    }
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 502);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'POSTのみ' }, 405);

  let ownerId: string | null;
  try {
    ownerId = await resolveOwner(req);
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
  if (!ownerId) return json({ ok: false, error: '認証が必要です' }, 401);

  const reqBody = await req.json().catch(() => ({})) as Record<string, unknown> | null;

  const { data: credRow } = await db.from('google_credentials')
    .select('refresh_token,drive_root_folder_id,drive_inbox_folder_id')
    .eq('owner_id', ownerId).maybeSingle();
  if (!credRow?.refresh_token) {
    return json({ ok: false, needsReconnect: true, error: 'Googleの連携情報がまだ保存されていない' }, 409);
  }
  const cred = credRow as Cred;

  const fail = async (msg: string, status: number, needsReconnect = false) => {
    await db.from('google_credentials').update({ drive_last_error: msg }).eq('owner_id', ownerId);
    return json({ ok: false, needsReconnect, error: msg }, status);
  };

  let token: string;
  try {
    token = await accessTokenFrom(cred.refresh_token);
  } catch (e) {
    return await fail(e instanceof Error ? e.message : String(e), 409, true);
  }

  const { data: profile } = await db.from('profiles').select('timezone').eq('id', ownerId).maybeSingle();
  const tz = (profile?.timezone as string | undefined) ?? 'Asia/Tokyo';

  if (reqBody?.action === 'log') return await handleLog(token, ownerId, cred, tz, reqBody as LogBody, fail);

  const stats: Stats = { foldersCreated: 0, foldersRenamed: 0, docsCreated: 0, docsUpdated: 0, completionsLogged: 0 };
  const errors: string[] = [];

  try {
    // ① フォルダ
    const place = await prepareFolders(token, ownerId, cred, stats);

    // ② ドキュメントがまだ無いタスク（既存タスクも古い順に取り込む）
    const { data: missing, error: mErr } = await db.from('tasks')
      .select(TASK_COLS).eq('owner_id', ownerId).is('drive_doc_id', null)
      .order('created_at', { ascending: true }).limit(MAX_CREATE);
    if (mErr) throw new Error(`タスクを読めない: ${mErr.message}`);

    for (const t of (missing ?? []) as TaskRow[]) {
      try {
        await createDocFor(token, t, place, tz, stats);
      } catch (e) {
        if (e instanceof GoogleError && e.scopeMissing) throw e;
        errors.push(`${t.title}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // ③④ 既にあるドキュメントの名前・置き場所・完了の追記
    const { data: linked, error: lErr } = await db.from('tasks')
      .select(TASK_COLS).eq('owner_id', ownerId).not('drive_doc_id', 'is', null)
      .order('updated_at', { ascending: false }).limit(500);
    if (lErr) throw new Error(`タスクを読めない: ${lErr.message}`);

    let budget = MAX_UPDATE;
    for (const t of (linked ?? []) as TaskRow[]) {
      if (budget <= 0) break;
      const title = docTitle({ title: t.title, createdAt: t.created_at }, tz);
      const parent = place.parentFor(t);
      const needsLog = t.status === 'done' && !t.drive_done_logged_at;
      if (title === t.drive_doc_title && parent === t.drive_parent_id && !needsLog) continue;
      budget--;
      try {
        if (title !== t.drive_doc_title || parent !== t.drive_parent_id) {
          await patchFile(token, t.drive_doc_id!, {
            name: title !== t.drive_doc_title ? title : undefined,
            addParent: parent !== t.drive_parent_id ? parent : undefined,
            removeParent: t.drive_parent_id,
          });
          await db.from('tasks').update({ drive_doc_title: title, drive_parent_id: parent }).eq('id', t.id);
          stats.docsUpdated++;
        }
        if (needsLog) {
          await appendToDoc(token, t.drive_doc_id!, completionText(
            { completedAt: t.completed_at, actualMin: t.actual_min }, tz,
          ));
          await db.from('tasks').update({ drive_done_logged_at: new Date().toISOString() }).eq('id', t.id);
          stats.completionsLogged++;
        }
      } catch (e) {
        if (e instanceof GoogleError && e.scopeMissing) throw e;
        // 人がドキュメントを Drive から消した場合は 404 になる。作り直しはしない（消したのは本人の意思）
        errors.push(`${t.title}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } catch (e) {
    if (e instanceof GoogleError && e.scopeMissing) {
      return await fail(`Drive を使う許可がまだ無い。ログインし直して許可して: ${e.message}`, 409, true);
    }
    return await fail(e instanceof Error ? e.message : String(e), 502);
  }

  const { count: remaining } = await db.from('tasks')
    .select('id', { count: 'exact', head: true }).eq('owner_id', ownerId).is('drive_doc_id', null);

  await db.from('google_credentials').update({
    drive_last_sync_at: new Date().toISOString(),
    drive_last_error: errors.length > 0 ? errors.slice(0, 5).join('\n') : null,
  }).eq('owner_id', ownerId);

  return json({ ok: true, ...stats, remaining: remaining ?? 0, errors });
});
