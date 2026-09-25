// Tempus: Claude に1日の時間割を「講評」させる Edge Function。
//
// 設計の要: 時間の配置は決定的アルゴリズム（src/lib/plan.ts）がやる。Claude は口を出さない。
// 直接組ませると予定と衝突する案や1日を超える案が出るうえ、同じ入力でも毎回変わる。
// 「当てにならない」と思われた時点で使われなくなるので、Claude は言葉の判断だけに絞る。
//
// 呼び出し口は2つ:
//   ① ブラウザから  … Authorization: Bearer <ユーザーのJWT>
//   ② cron から     … x-plan-review-key: <共有シークレット>（LINEにも送る）
// ②で owner を解決するのは TEMPUS_OWNER_EMAIL。リクエスト側に owner を指定させない。

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.120.0';
import { buildInsights, type InsightTask } from '../_shared/insight.ts';

const need = (k: string): string => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`環境変数 ${k} が未設定です`);
  return v;
};

const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_ROLE_KEY = need('SUPABASE_SERVICE_ROLE_KEY');
// APIキーが無ければ計算だけで見立てを作る（費用ゼロ）。
// Claude が要るのは「似た作業をまとめろ」的な意味の判断だけで、
// 詰め込みすぎ・期限・順番は確定的に導けるため、無料でも実用になる。
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const USE_CLAUDE = ANTHROPIC_API_KEY.length > 0
  && Deno.env.get('PLAN_REVIEW_MODE') !== 'free';
const REVIEW_KEY = Deno.env.get('PLAN_REVIEW_KEY') ?? '';
const OWNER_EMAIL = Deno.env.get('TEMPUS_OWNER_EMAIL') ?? '';
const LINE_TOKEN = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN') ?? '';
const LINE_USER_ID = Deno.env.get('LINE_USER_ID') ?? '';

// 二瀬さんが明示的に選ばない限り Opus 5.5（Opus 5後継・同性能帯で入力$4/出力$20・Opus5比コスト減）。
// 安いモデルへの引き下げは本人の判断。
const MODEL = Deno.env.get('PLAN_REVIEW_MODEL') ?? 'claude-opus-5-5';

// 1日あたりの呼び出し上限。無料枠を守る思想と揃える（暴走した時の被害を有限にする）。
const MAX_CALLS_PER_DAY = Number(Deno.env.get('PLAN_REVIEW_MAX_CALLS') ?? '10');
const MAX_TASKS = 50;
const MAX_EVENTS = 30;

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const anthropic = USE_CLAUDE ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

type Note = { kind: 'overload' | 'order' | 'grouping' | 'deadline' | 'ok'; text: string };

/** 長さが違っても定数時間で比較する */
function timingSafeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  let diff = ab.length ^ bb.length;
  const n = Math.max(ab.length, bb.length);
  for (let i = 0; i < n; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-plan-review-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function resolveOwner(req: Request): Promise<{ ownerId: string; viaCron: boolean } | null> {
  const key = req.headers.get('x-plan-review-key');
  if (key && REVIEW_KEY && timingSafeEqual(key, REVIEW_KEY)) {
    if (!OWNER_EMAIL) throw new Error('TEMPUS_OWNER_EMAIL が未設定です');
    // 1人用アプリなので listUsers の1ページ目で足りるが、念のため探す
    for (let page = 1; page <= 5; page++) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const hit = data.users.find((u) => u.email === OWNER_EMAIL);
      if (hit) return { ownerId: hit.id, viaCron: true };
      if (data.users.length < 200) break;
    }
    throw new Error(`TEMPUS_OWNER_EMAIL(${OWNER_EMAIL}) のユーザーが見つかりません`);
  }

  const auth = req.headers.get('Authorization') ?? '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!jwt) return null;
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user) return null;
  return { ownerId: data.user.id, viaCron: false };
}

/** JSTのその日の 00:00 / 翌 00:00 を UTC で返す */
function dayBoundsJst(day: string): { start: string; end: string } {
  const [y, m, d] = day.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, -9, 0, 0));
  const end = new Date(start.getTime() + 86400000);
  return { start: start.toISOString(), end: end.toISOString() };
}

const hhmm = (iso: string) =>
  new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));

/**
 * Claude の応答からノートを取り出す。
 * 構造化出力ではなくプロンプトでJSONを頼み、こちらで防御的に読む方式にしている。
 * どのみち「壊れた応答でも落ちない」処理が要るので、経路を一本にした方が穴が減る。
 */
function parseNotes(text: string): Note[] {
  const kinds = new Set(['overload', 'order', 'grouping', 'deadline', 'ok']);
  const tryParse = (s: string): unknown => { try { return JSON.parse(s); } catch { return null; } };

  let parsed = tryParse(text.trim());
  if (parsed === null) {
    // ```json ... ``` や前後の説明文が付いてきた場合に配列部分だけ拾う
    const m = text.match(/\[[\s\S]*\]/);
    if (m) parsed = tryParse(m[0]);
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((n): n is Record<string, unknown> => typeof n === 'object' && n !== null)
    .map((n) => ({
      kind: kinds.has(String(n.kind)) ? (n.kind as Note['kind']) : 'ok',
      text: String(n.text ?? '').trim().slice(0, 200),
    }))
    .filter((n) => n.text.length > 0)
    .slice(0, 5);
}

async function pushLine(notes: Note[], day: string): Promise<boolean> {
  if (!LINE_TOKEN || !LINE_USER_ID || notes.length === 0) return false;
  const body = `☀ ${day} の見立て\n\n` + notes.map((n) => `・${n.text}`).join('\n');
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LINE_TOKEN}` },
    // push は月200通の無料枠を消費する。毎朝1回＝月30通なので収まる。
    body: JSON.stringify({ to: LINE_USER_ID, messages: [{ type: 'text', text: body.slice(0, 4900) }] }),
  });
  return res.ok;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'POSTのみ' }, 405);

  let owner: { ownerId: string; viaCron: boolean } | null;
  try {
    owner = await resolveOwner(req);
  } catch (e) {
    console.error('owner解決に失敗', e);
    return json({ ok: false, error: String(e) }, 500);
  }
  if (!owner) return json({ ok: false, error: '認証が必要です' }, 401);

  const bodyIn = await req.json().catch(() => ({}));
  const day: string = typeof bodyIn?.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(bodyIn.day)
    ? bodyIn.day
    : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
  const force = bodyIn?.force === true;

  // 同じ日の講評が既にあれば作り直さない（開くたびにAPIを叩かない）
  if (!force) {
    const { data: cached } = await db.from('plan_reviews')
      .select('notes, model, created_at')
      .eq('owner_id', owner.ownerId).eq('for_date', day).maybeSingle();
    if (cached) {
      return json({ ok: true, day, notes: cached.notes, cached: true, model: cached.model });
    }
  }

  // 1日の呼び出し上限
  const { count } = await db.from('plan_review_usage')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', owner.ownerId).eq('for_date', day);
  if ((count ?? 0) >= MAX_CALLS_PER_DAY) {
    return json({ ok: false, error: `今日はもう上限（${MAX_CALLS_PER_DAY}回）`, notes: [] }, 429);
  }

  const { start, end } = dayBoundsJst(day);

  const [{ data: events }, { data: tasks }] = await Promise.all([
    db.from('calendar_events_cache')
      .select('title, start_at, end_at, is_all_day')
      .eq('owner_id', owner.ownerId)
      .lt('start_at', end).gt('end_at', start)
      .order('start_at').limit(MAX_EVENTS),
    db.from('tasks')
      .select('title, estimate_min, importance, due_at, scheduled_start, scheduled_end, status')
      .eq('owner_id', owner.ownerId)
      .neq('status', 'done')
      .order('due_at', { ascending: true, nullsFirst: false })
      .limit(MAX_TASKS),
  ]);

  // notes（自由記述）は渡さない。本業は匿名化して入れる運用だが、渡す情報は少ないほどよい。
  const evLines = (events ?? []).map((e) =>
    e.is_all_day ? `- 終日: ${e.title}` : `- ${hhmm(e.start_at)}〜${hhmm(e.end_at)} ${e.title}`);
  const taskLines = (tasks ?? []).map((t) => {
    const when = t.scheduled_start ? `[${hhmm(t.scheduled_start)}に配置済] ` : '';
    const due = t.due_at ? ` 期限:${String(t.due_at).slice(0, 10)}` : '';
    return `- ${when}${t.title}（${t.estimate_min}分・重要度${t.importance}${due}）`;
  });

  const system = [
    'あなたは日本語で答える実務的なアシスタントです。',
    '相手は個人事業と会社員を兼ねるエンジニアで、短く端的な文章を好みます。絵文字は使いません。',
    '',
    '与えられるのは「今日の予定」と「未完了のタスク」です。',
    '時間の配置は別の決定的なアルゴリズムが既に行っています。**あなたは配置を提案しません**。',
    'あなたの仕事は、その日の組み方に対する短い判断を述べることです。例:',
    '- 総量が1日に収まらないなら、何を翌日に回すべきか',
    '- 似た作業をまとめると切り替えコストが減るなら、その組み合わせ',
    '- 期限から逆算して今日着手しないと間に合わないもの',
    '- 特に問題がなければ、そう言う（無理に指摘を作らない）',
    '',
    '出力は**JSONの配列のみ**。前後に説明文やコードブロックを付けないこと。',
    '各要素は {"kind": "overload"|"order"|"grouping"|"deadline"|"ok", "text": "…"} の形。',
    'text は1文・60字以内。要素は最大5個。指摘が無ければ kind:"ok" を1つだけ返す。',
  ].join('\n');

  const userMsg = [
    `日付: ${day}（JST）`,
    '',
    '## 今日の予定',
    evLines.length ? evLines.join('\n') : '（予定なし）',
    '',
    '## 未完了のタスク',
    taskLines.length ? taskLines.join('\n') : '（タスクなし）',
  ].join('\n');

  let notes: Note[] = [];
  let inputTokens = 0, outputTokens = 0, ok = true, note = '';
  const usedModel = USE_CLAUDE ? MODEL : 'deterministic';

  if (!USE_CLAUDE) {
    // ---- 無料経路: 計算だけで見立てを作る ----
    const insightTasks: InsightTask[] = (tasks ?? []).map((t) => ({
      id: String(t.title), title: t.title,
      estimateMin: t.estimate_min ?? 30,
      importance: (t.importance ?? 'mid') as InsightTask['importance'],
      dueAt: t.due_at ?? null,
      status: t.status ?? 'todo',
      scheduledStart: t.scheduled_start ?? null,
      scheduledEnd: t.scheduled_end ?? null,
    }));
    const busy = (events ?? [])
      .filter((e) => !e.is_all_day)
      .map((e) => ({ start: e.start_at, end: e.end_at }));

    // 朝に回す前提なので、その日の稼働開始時刻から見る
    const nowIso = new Date().toISOString();
    notes = buildInsights({
      now: nowIso, day, timezone: 'Asia/Tokyo',
      workdayStart: '09:00', workdayEnd: '22:00',
      busy, tasks: insightTasks,
    }) as Note[];
    if (notes.length === 0) { ok = false; note = '見立てを作れませんでした'; }
  } else {
    try {
      const res = await anthropic!.messages.create({
        model: MODEL,
        max_tokens: 4000,
        // 判断は要るが重い推論ではない。効率を優先して低めに置く。
        thinking: { type: 'adaptive' },
        output_config: { effort: 'low' },
        system,
        messages: [{ role: 'user', content: userMsg }],
      });

      inputTokens = res.usage?.input_tokens ?? 0;
      outputTokens = res.usage?.output_tokens ?? 0;

      if (res.stop_reason === 'refusal') {
        ok = false; note = '拒否されました';
      } else {
        // 型述語を自作すると SDK の TextBlock（citations 必須）と食い違うので書かない
        const text = res.content
          .map((b) => (b.type === 'text' ? b.text : ''))
          .join('\n');
        notes = parseNotes(text);
        if (notes.length === 0) { ok = false; note = '応答を解釈できませんでした'; }
      }
    } catch (e) {
      ok = false;
      note = e instanceof Error ? e.message : String(e);
      console.error('Claude呼び出しに失敗', e);
    }
  }

  await db.from('plan_review_usage').insert({
    owner_id: owner.ownerId, for_date: day, model: usedModel,
    input_tokens: inputTokens, output_tokens: outputTokens, ok, note: note || null,
  });

  if (notes.length > 0) {
    await db.from('plan_reviews').upsert(
      { owner_id: owner.ownerId, for_date: day, notes, model: usedModel },
      { onConflict: 'owner_id,for_date' },
    );
  }

  const pushed = owner.viaCron ? await pushLine(notes, day) : false;

  return json({
    ok, day, notes, cached: false, model: usedModel,
    usage: { inputTokens, outputTokens },
    linePushed: pushed,
    note: note || undefined,
  }, ok ? 200 : 502);
});
