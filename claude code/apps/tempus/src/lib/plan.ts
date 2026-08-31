// スケジュール自動提案アルゴリズム（純関数）。
// 外部依存ゼロ・副作用ゼロ。日時計算は Date と Intl のみで行う。
// 人が見て承認する前提のため、凝った最適化はせず「説明可能・予測可能」を優先する。

import type {
  BusyBlock,
  Importance,
  PlanInput,
  PlanResult,
  PlannedSlot,
  SchedulableTask,
  UnplacedReason,
} from '../types/domain';

// ---- 配点（ここだけ見れば調整できるようにまとめる） ----

const IMPORTANCE_BASE: Record<Importance, number> = {
  high: 30,
  mid: 20,
  low: 10,
};

const DUE_BONUS = {
  overdue: 50, // 期限の時刻そのものを過ぎている
  today: 40, // 今日中（期限の時刻はまだ来ていない）
  tomorrow: 25,
  within3Days: 15, // 2〜3日以内
  none: 0,
} as const;

const QUICK_WIN_BONUS = 5;
const QUICK_WIN_THRESHOLD_MIN = 15;

const DEFAULT_MIN_SLOT_MIN = 15;
const DEFAULT_BREAK_MIN = 5;
const ROUNDING_STEP_MIN = 5;

// ---- 優先スコア ----

/**
 * 「今日/明日」は timeZone の暦日で判定する。ここを UTC で見ると、JST の朝
 * （UTC では前日23時台）に今日締切のタスクが「期限切れ」に化けて並び順が狂う。
 * 既定を 'UTC' にしてあるのは後方互換のためで、呼び出し側は必ず渡すこと。
 */
export function priorityScore(task: SchedulableTask, now: string, timeZone = 'UTC'): number {
  const base = IMPORTANCE_BASE[task.importance];
  const due = dueBonus(task.dueAt, now, timeZone);
  const quickWin = task.estimateMin <= QUICK_WIN_THRESHOLD_MIN ? QUICK_WIN_BONUS : 0;
  return base + due + quickWin;
}

function dueBonus(dueAt: string | null, now: string, timeZone: string): number {
  if (dueAt === null) return DUE_BONUS.none;

  const dueMs = Date.parse(dueAt);
  const nowMs = Date.parse(now);
  if (Number.isNaN(dueMs) || Number.isNaN(nowMs)) return DUE_BONUS.none;

  if (dueMs < nowMs) return DUE_BONUS.overdue;

  const diffDays = calendarDayDiff(nowMs, dueMs, timeZone);
  if (diffDays <= 0) return DUE_BONUS.today;
  if (diffDays === 1) return DUE_BONUS.tomorrow;
  if (diffDays <= 3) return DUE_BONUS.within3Days;
  return DUE_BONUS.none;
}

function calendarDayDiff(nowMs: number, dueMs: number, timeZone: string): number {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((startOfLocalDay(dueMs, timeZone) - startOfLocalDay(nowMs, timeZone)) / dayMs);
}

/** その瞬間が timeZone で何月何日かを取り、その暦日の 0 時に丸めた値を返す */
function startOfLocalDay(utcMs: number, timeZone: string): number {
  const shifted = utcMs + getTimezoneOffsetMinutes(utcMs, timeZone) * 60000;
  const d = new Date(shifted);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

// ---- タイムゾーン変換（'YYYY-MM-DD' + 'HH:MM' + IANA名 → UTC ミリ秒） ----
//
// Intl.DateTimeFormat で「ある UTC 瞬間をそのタイムゾーンで表示したら何時か」を求め、
// 逆算してオフセットを出す標準的なテクニック。DST を持つタイムゾーンでも、
// 求めた瞬間で offset を取り直す2パス目で境界を吸収する。

function getTimezoneOffsetMinutes(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(new Date(utcMs));
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );
  return (asUtc - utcMs) / 60000;
}

function zonedTimeToUtcMs(dateStr: string, timeStr: string, timeZone: string): number {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const guessMs = Date.UTC(y, mo - 1, d, h, mi, 0);

  const offset1 = getTimezoneOffsetMinutes(guessMs, timeZone);
  let utcMs = guessMs - offset1 * 60000;

  // DST境界をまたぐケースの補正（2パス目）
  const offset2 = getTimezoneOffsetMinutes(utcMs, timeZone);
  if (offset2 !== offset1) {
    utcMs = guessMs - offset2 * 60000;
  }
  return utcMs;
}

// ---- 5分丸め ----

function ceilToStepMs(ms: number, stepMin = ROUNDING_STEP_MIN): number {
  const step = stepMin * 60000;
  return Math.ceil(ms / step) * step;
}

function floorToStepMs(ms: number, stepMin = ROUNDING_STEP_MIN): number {
  const step = stepMin * 60000;
  return Math.floor(ms / step) * step;
}

/**
 * 見積もり時間は切り上げて5分単位にする（人が見て気持ち悪くない・時間不足にならない）。
 * 0以下の見積もりでも最低5分のブロックを確保する。
 */
function roundUpToStepMin(min: number, stepMin = ROUNDING_STEP_MIN): number {
  return Math.max(stepMin, Math.ceil(min / stepMin) * stepMin);
}

// ---- busy のマージ・差し引き ----

export interface MsRange {
  start: number;
  end: number;
}

export function mergeBusy(blocks: BusyBlock[]): MsRange[] {
  const parsed: MsRange[] = blocks
    .map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end) && b.end > b.start)
    .sort((a, b) => a.start - b.start);

  const merged: MsRange[] = [];
  for (const b of parsed) {
    const last = merged[merged.length - 1];
    if (last && b.start <= last.end) {
      last.end = Math.max(last.end, b.end);
    } else {
      merged.push({ ...b });
    }
  }
  return merged;
}

export function subtractBusy(windowStart: number, windowEnd: number, merged: MsRange[]): MsRange[] {
  const gaps: MsRange[] = [];
  let cursor = windowStart;
  for (const b of merged) {
    const s = Math.max(b.start, windowStart);
    const e = Math.min(b.end, windowEnd);
    if (e <= windowStart || s >= windowEnd || e <= s) continue; // 窓の外
    if (s > cursor) gaps.push({ start: cursor, end: s });
    cursor = Math.max(cursor, e);
  }
  if (cursor < windowEnd) gaps.push({ start: cursor, end: windowEnd });
  return gaps;
}

// ---- 本体 ----

export function planDay(input: PlanInput): PlanResult {
  const minSlotMin = input.minSlotMin ?? DEFAULT_MIN_SLOT_MIN;
  const breakMin = roundUpToStepMin(input.breakMin ?? DEFAULT_BREAK_MIN);
  const nowMs = Date.parse(input.now);

  const slots: PlannedSlot[] = [];
  const unplaced: { taskId: string; reason: UnplacedReason }[] = [];

  const activeTasks: SchedulableTask[] = [];
  for (const t of input.tasks) {
    if (t.status === 'done') {
      unplaced.push({ taskId: t.id, reason: 'done' });
    } else {
      activeTasks.push(t);
    }
  }

  const dayStartMs = zonedTimeToUtcMs(input.day, input.workdayStart, input.timezone);
  const dayEndMs = zonedTimeToUtcMs(input.day, input.workdayEnd, input.timezone);

  // input.now より前は使わない
  const windowStart = Math.max(dayStartMs, nowMs);
  const windowEnd = dayEndMs;

  if (windowStart >= windowEnd) {
    // 今日の稼働時間帯そのものがもう終わっている（busyとは無関係の理由）
    for (const t of activeTasks) unplaced.push({ taskId: t.id, reason: 'past_due_window' });
    return { slots, unplaced };
  }

  const merged = mergeBusy(input.busy);
  const rawGaps = subtractBusy(windowStart, windowEnd, merged);

  const gaps = rawGaps
    .map((g) => ({ start: ceilToStepMs(g.start), end: floorToStepMs(g.end) }))
    .filter((g) => (g.end - g.start) / 60000 >= minSlotMin);

  if (gaps.length === 0) {
    for (const t of activeTasks) unplaced.push({ taskId: t.id, reason: 'no_room' });
    return { slots, unplaced };
  }

  // 「too_large」の判定基準は最初の（誰もまだ詰めていない）最大の空きサイズ。
  // 詰めていくうちに縮んだ後の空きと比べると、本来入るはずだったタスクまで
  // too_large 扱いになってしまうため、開始時点のサイズで固定する。
  const maxInitialGapMin = Math.max(...gaps.map((g) => (g.end - g.start) / 60000));

  const scoreByTaskId = new Map<string, number>();
  for (const t of activeTasks) scoreByTaskId.set(t.id, priorityScore(t, input.now, input.timezone));

  const sortedTasks = [...activeTasks].sort((a, b) => {
    const sa = scoreByTaskId.get(a.id)!;
    const sb = scoreByTaskId.get(b.id)!;
    if (sb !== sa) return sb - sa;
    return a.estimateMin - b.estimateMin;
  });

  for (const task of sortedTasks) {
    const needed = roundUpToStepMin(task.estimateMin);

    // 大きい空きから順に詰める（worst-fit）: 常にその時点で最大の残り容量を持つ
    // 空きを選ぶ。断片化を抑え、後続の小さいタスクの入り先を残しやすくするため。
    let bestIdx = -1;
    let bestDur = -1;
    for (let i = 0; i < gaps.length; i++) {
      const dur = (gaps[i].end - gaps[i].start) / 60000;
      if (dur < needed) continue;
      if (dur > bestDur || (dur === bestDur && gaps[i].start < gaps[bestIdx].start)) {
        bestDur = dur;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) {
      const reason: UnplacedReason = needed > maxInitialGapMin ? 'too_large' : 'no_room';
      unplaced.push({ taskId: task.id, reason });
      continue;
    }

    const gap = gaps[bestIdx];
    const startMs = gap.start;
    const endMs = startMs + needed * 60000;

    slots.push({
      taskId: task.id,
      start: new Date(startMs).toISOString(),
      end: new Date(endMs).toISOString(),
      score: scoreByTaskId.get(task.id)!,
    });

    if (endMs >= gap.end) {
      // 空きの末尾までぴったり使った → breakは不要、空きは消滅
      gaps.splice(bestIdx, 1);
      continue;
    }

    const newStart = endMs + breakMin * 60000;
    if (newStart >= gap.end) {
      gaps.splice(bestIdx, 1);
    } else {
      gaps[bestIdx] = { start: newStart, end: gap.end };
    }
  }

  return { slots, unplaced };
}
