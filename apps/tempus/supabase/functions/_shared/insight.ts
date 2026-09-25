// 「今日の見立て」を計算だけで出す。API費用ゼロ。
//
// Claude に言わせようとしていたことの大半は、実は確定的に導ける:
//   ・詰め込みすぎ → 見積もりの合計と、予定を引いた空き時間を比べるだけ
//   ・期限がやばい → 着手期限の逆算（leadtime）で出る
//   ・何から手を付けるか → 優先スコアの順
//   ・クイックウィン → 短いタスクの本数を数えるだけ
// 本当にLLMが要るのは「この2つは似た作業だからまとめろ」という意味の判断だけ。
// そこは無理に真似せず、無いなら無いままにする（それらしい嘘を出さない）。
//
// アプリと Edge Function の両方から読む。ここが唯一の実装。

export type InsightKind = 'overload' | 'order' | 'grouping' | 'deadline' | 'ok';
export interface Insight { kind: InsightKind; text: string }

export interface InsightTask {
  id: string;
  title: string;
  estimateMin: number;
  importance: 'low' | 'mid' | 'high';
  dueAt: string | null;
  status: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
}

export interface InsightBusy { start: string; end: string }

export interface InsightInput {
  now: string;            // ISO8601
  day: string;            // 'YYYY-MM-DD'
  timezone: string;
  workdayStart: string;   // 'HH:MM'
  workdayEnd: string;     // 'HH:MM'
  busy: InsightBusy[];    // カレンダーの予定
  tasks: InsightTask[];   // 未完了のタスク
  dailyCapacityMin?: number;
}

const QUICK_WIN_MAX_MIN = 15;
const DEFAULT_DAILY_CAPACITY_MIN = 180;

export function buildInsights(input: InsightInput): Insight[] {
  const out: Insight[] = [];
  const open = input.tasks.filter((t) => t.status !== 'done');

  // ---- ① 期限: 着手期限を過ぎている / 今日始めないと間に合わない ----
  const capacity = Math.max(1, input.dailyCapacityMin ?? DEFAULT_DAILY_CAPACITY_MIN);
  const today = localDay(input.now, input.timezone);
  const late: InsightTask[] = [];
  const startToday: InsightTask[] = [];

  for (const t of open) {
    if (!t.dueAt) continue;
    const daysNeeded = Math.max(1, Math.ceil(t.estimateMin / capacity));
    const due = localDay(t.dueAt, input.timezone);
    const startBy = addDays(due, -(daysNeeded - 1));
    const untilDue = diffDays(today, due);
    const untilStart = diffDays(today, startBy);
    if (untilDue < 0) late.push(t);
    else if (untilStart < 0) late.push(t);
    else if (untilStart === 0) startToday.push(t);
  }

  if (late.length === 1) {
    out.push({ kind: 'deadline', text: `「${short(late[0].title)}」は着手期限を過ぎている。今日やるなら最優先` });
  } else if (late.length > 1) {
    out.push({ kind: 'deadline', text: `着手期限を過ぎているものが${late.length}件ある。まずそこから` });
  }
  if (startToday.length > 0) {
    const names = startToday.slice(0, 2).map((t) => `「${short(t.title)}」`).join('と');
    out.push({
      kind: 'deadline',
      text: startToday.length <= 2
        ? `${names}は今日始めないと間に合わない`
        : `今日着手しないと間に合わないものが${startToday.length}件ある`,
    });
  }

  // ---- ② 詰め込みすぎ: 見積もりの合計 vs 予定を引いた空き ----
  const freeMin = freeMinutes(input);
  const plannedMin = open
    .filter((t) => t.scheduledStart && t.scheduledEnd)
    .reduce((a, t) => a + minutesBetween(t.scheduledStart!, t.scheduledEnd!), 0);
  const wantMin = open.reduce((a, t) => a + t.estimateMin, 0);

  if (freeMin <= 0 && open.length > 0) {
    out.push({ kind: 'overload', text: '今日は予定で埋まっていて空きが無い。タスクは明日以降に回す前提で' });
  } else if (wantMin > freeMin * 1.2 && open.length > 1) {
    const over = Math.round((wantMin - freeMin) / 6) / 10;
    out.push({
      kind: 'overload',
      text: `やること全部で${h(wantMin)}、今日の空きは${h(freeMin)}。${over}時間ぶんは今日は入らない`,
    });
  } else if (plannedMin > freeMin && plannedMin > 0) {
    out.push({ kind: 'overload', text: `配置済みが${h(plannedMin)}で空き${h(freeMin)}を超えている。どれか外した方がいい` });
  }

  // ---- ③ 順番: 何から手を付けるか ----
  const running = open.find((t) => t.status === 'doing');
  if (running) {
    out.push({ kind: 'order', text: `「${short(running.title)}」が計測中のまま。終わっているなら止める` });
  } else {
    const first = [...open].sort(byPriority(input.now, input.timezone, capacity))[0];
    if (first) out.push({ kind: 'order', text: `最初にやるなら「${short(first.title)}」` });
  }

  // ---- ④ クイックウィン: 短いものをまとめて減らす ----
  const quick = open.filter((t) => t.estimateMin <= QUICK_WIN_MAX_MIN);
  if (quick.length >= 3) {
    const total = quick.reduce((a, t) => a + t.estimateMin, 0);
    out.push({ kind: 'grouping', text: `${QUICK_WIN_MAX_MIN}分以内で終わるものが${quick.length}件（計${total}分）。まとめて片付けると数が減る` });
  }

  if (out.length === 0) {
    out.push({
      kind: 'ok',
      text: open.length === 0 ? 'やることは空。気持ちいい' : '特に問題なし。上から順に進めれば収まる',
    });
  }
  return out.slice(0, 5);
}

// ---- 補助 ----

function byPriority(now: string, tz: string, capacity: number) {
  const base = { high: 30, mid: 20, low: 10 } as const;
  const score = (t: InsightTask): number => {
    let s = base[t.importance];
    if (t.dueAt) {
      const daysNeeded = Math.max(1, Math.ceil(t.estimateMin / capacity));
      const due = localDay(t.dueAt, tz);
      const untilDue = diffDays(localDay(now, tz), due);
      const untilStart = diffDays(localDay(now, tz), addDays(due, -(daysNeeded - 1)));
      if (untilDue < 0) s += 50;
      else if (untilStart <= 0) s += 40;
      else if (untilStart === 1) s += 25;
      else if (untilStart <= 3) s += 15;
    }
    if (t.estimateMin <= QUICK_WIN_MAX_MIN) s += 5;
    return s;
  };
  return (a: InsightTask, b: InsightTask) => score(b) - score(a) || a.estimateMin - b.estimateMin;
}

/** 稼働時間帯から予定を引いた空き分数。今より前は数えない */
export function freeMinutes(input: InsightInput): number {
  const dayStart = zonedMs(input.day, input.workdayStart, input.timezone);
  const dayEnd = zonedMs(input.day, input.workdayEnd, input.timezone);
  const from = Math.max(dayStart, Date.parse(input.now));
  if (from >= dayEnd) return 0;

  const merged = mergeBusy(input.busy);
  let free = dayEnd - from;
  for (const b of merged) {
    const s = Math.max(from, Date.parse(b.start));
    const e = Math.min(dayEnd, Date.parse(b.end));
    if (e > s) free -= e - s;
  }
  return Math.max(0, Math.round(free / 60000));
}

function mergeBusy(busy: InsightBusy[]): InsightBusy[] {
  const sorted = [...busy]
    .filter((b) => Date.parse(b.end) > Date.parse(b.start))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const out: InsightBusy[] = [];
  for (const b of sorted) {
    const last = out[out.length - 1];
    if (last && Date.parse(b.start) <= Date.parse(last.end)) {
      if (Date.parse(b.end) > Date.parse(last.end)) last.end = b.end;
    } else {
      out.push({ ...b });
    }
  }
  return out;
}

const h = (min: number) => `${Math.round(min / 6) / 10}時間`;
const short = (s: string) => (s.length > 18 ? `${s.slice(0, 18)}…` : s);
const minutesBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 60000);

function localDay(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function diffDays(from: string, to: string): number {
  const p = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((p(to) - p(from)) / 86400000);
}

/** 'YYYY-MM-DD' + 'HH:MM' をそのタイムゾーンの時刻として解釈し UTC ミリ秒にする */
function zonedMs(day: string, hhmm: string, timeZone: string): number {
  const [y, mo, d] = day.split('-').map(Number);
  const [hh, mi] = hhmm.split(':').map(Number);
  const guess = Date.UTC(y, mo - 1, d, hh, mi);
  const off = tzOffsetMs(new Date(guess), timeZone);
  return guess - off;
}

function tzOffsetMs(at: Date, timeZone: string): number {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: Record<string, number> = {};
  for (const part of f.formatToParts(at)) if (part.type !== 'literal') p[part.type] = Number(part.value);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - at.getTime();
}
