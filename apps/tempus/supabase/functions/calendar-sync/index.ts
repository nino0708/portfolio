// Googleカレンダーをサーバー側で取り込む。
//
// これまではブラウザの session.provider_token で直接Googleを叩いていたが、
// あのトークンは再読み込みで消えるため「ログイン直後の一瞬」しか取得できなかった。
// 保存した更新用トークンからアクセストークンを取り直す方式にして、
// 再ログインなしで・cronからも取り込めるようにする。
//
// 呼び出し口は2つ:
//   ① ブラウザから … Authorization: Bearer <ユーザーのJWT>
//      初回は body に refreshToken を載せて渡す（以後はサーバーが持っている）
//   ② cron から   … x-calendar-sync-key: <共有シークレット>

import { createClient } from 'npm:@supabase/supabase-js@2';

const need = (k: string): string => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`環境変数 ${k} が未設定です`);
  return v;
};

const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_ROLE_KEY = need('SUPABASE_SERVICE_ROLE_KEY');
const GOOGLE_CLIENT_ID = need('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = need('GOOGLE_CLIENT_SECRET');
const SYNC_KEY = Deno.env.get('CALENDAR_SYNC_KEY') ?? '';
const OWNER_EMAIL = Deno.env.get('TEMPUS_OWNER_EMAIL') ?? '';

const DEFAULT_DAYS = 21;   // 何日先まで取り込むか。週表示と月表示の手前をカバーする
const MAX_EVENTS = 250;

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-calendar-sync-key',
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
  const key = req.headers.get('x-calendar-sync-key');
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

/** 更新用トークンからアクセストークンを取り直す */
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
    // invalid_grant = 本人が連携を解除した / トークンが失効した。再ログインが要る
    throw new Error(`アクセストークンを取り直せない: ${body.error ?? res.status}`);
  }
  return body.access_token as string;
}

type GEvent = {
  id: string; summary?: string; status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

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

  const body = await req.json().catch(() => ({}));
  const days = Math.min(60, Math.max(1, Number(body?.days) || DEFAULT_DAYS));

  // 初回だけブラウザが更新用トークンを渡してくる。以後はここに保存されたものを使う。
  if (typeof body?.refreshToken === 'string' && body.refreshToken.length > 10) {
    const { error } = await db.from('google_credentials').upsert({
      owner_id: ownerId,
      refresh_token: body.refreshToken,
      scope: typeof body?.scope === 'string' ? body.scope : null,
      updated_at: new Date().toISOString(),
      last_error: null,
    }, { onConflict: 'owner_id' });
    if (error) return json({ ok: false, error: `トークンを保存できない: ${error.message}` }, 500);
  }

  const { data: cred } = await db.from('google_credentials')
    .select('refresh_token').eq('owner_id', ownerId).maybeSingle();

  if (!cred?.refresh_token) {
    // まだ一度も渡されていない。ブラウザ側でログインし直せば渡ってくる。
    return json({ ok: false, needsReconnect: true, error: 'Googleの連携情報がまだ保存されていない' }, 409);
  }

  let token: string;
  try {
    token = await accessTokenFrom(cred.refresh_token);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await db.from('google_credentials')
      .update({ last_error: msg }).eq('owner_id', ownerId);
    return json({ ok: false, needsReconnect: true, error: msg }, 409);
  }

  const now = new Date();
  const timeMin = new Date(now.getTime() - 2 * 86400000);          // 少し過去も取る（今日の朝の予定など）
  const timeMax = new Date(now.getTime() + days * 86400000);

  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('timeMin', timeMin.toISOString());
  url.searchParams.set('timeMax', timeMax.toISOString());
  url.searchParams.set('singleEvents', 'true');   // 繰り返しは個々の予定に展開して取る
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', String(MAX_EVENTS));

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const msg = `カレンダーを読めない: HTTP ${res.status}`;
    await db.from('google_credentials').update({ last_error: msg }).eq('owner_id', ownerId);
    return json({ ok: false, error: msg }, 502);
  }
  const payload = await res.json() as { items?: GEvent[] };

  const rows = (payload.items ?? [])
    .filter((e) => e.status !== 'cancelled')
    .map((e) => {
      const isAllDay = !e.start?.dateTime;
      const s = e.start?.dateTime ?? (e.start?.date ? `${e.start.date}T00:00:00Z` : null);
      const en = e.end?.dateTime ?? (e.end?.date ? `${e.end.date}T00:00:00Z` : null);
      if (!s || !en) return null;
      return {
        owner_id: ownerId,
        google_event_id: e.id,
        calendar_id: 'primary',
        title: e.summary ?? '(無題)',
        start_at: s,
        end_at: en,
        is_all_day: isAllDay,
        synced_at: new Date().toISOString(),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  let upserted = 0;
  if (rows.length > 0) {
    const { error } = await db.from('calendar_events_cache')
      .upsert(rows, { onConflict: 'owner_id,calendar_id,google_event_id' });
    if (error) return json({ ok: false, error: `保存できない: ${error.message}` }, 500);
    upserted = rows.length;
  }

  // 取り込み範囲より古いキャッシュは消す（無料枠のDB容量を無駄に食わないため）
  const { count: deleted } = await db.from('calendar_events_cache')
    .delete({ count: 'exact' })
    .eq('owner_id', ownerId)
    .lt('end_at', timeMin.toISOString());

  await db.from('google_credentials')
    .update({ last_sync_at: new Date().toISOString(), last_error: null })
    .eq('owner_id', ownerId);

  return json({ ok: true, upserted, deleted: deleted ?? 0, days, from: timeMin.toISOString(), to: timeMax.toISOString() });
});
