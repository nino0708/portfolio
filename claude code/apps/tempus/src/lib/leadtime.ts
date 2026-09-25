// 「いつから始めないと間に合わないか」を期限と見積もりから逆算する。
//
// 期限だけ見ていると「まだ3日ある」と思ったまま、実は今日始めないと詰む、が起きる。
// 見積もりが1日に使える時間を超えるタスクほどこれが起きやすい。
//
// 精度より説明できることを優先している: 「20時間かかる／1日3時間使える → 7日必要
// → 期限の6日前から」という単純な割り算で、なぜその日付なのかが必ず言える。

import type { Importance, TaskStatus } from '../types/domain';

/** 1日のうちタスクに実際に使える時間の既定値。会議や移動を引いた現実的な値 */
export const DEFAULT_DAILY_CAPACITY_MIN = 180;

export type Urgency = 'none' | 'ok' | 'soon' | 'today' | 'overdue' | 'impossible';

export interface LeadTimeInput {
  estimateMin: number;
  dueAt: string | null;
  now: string;
  timezone: string;
  dailyCapacityMin?: number;
}

export interface LeadTime {
  /** 必要な稼働日数（切り上げ） */
  daysNeeded: number;
  /** 着手期限。これを過ぎると期限に間に合わない。期限が無ければ null */
  startBy: string | null;   // 'YYYY-MM-DD'
  /** 着手期限まであと何日か。負なら過ぎている */
  daysUntilStart: number | null;
  urgency: Urgency;
}

export function leadTime(input: LeadTimeInput): LeadTime {
  const capacity = Math.max(1, input.dailyCapacityMin ?? DEFAULT_DAILY_CAPACITY_MIN);
  const daysNeeded = Math.max(1, Math.ceil(input.estimateMin / capacity));

  if (input.dueAt === null) {
    return { daysNeeded, startBy: null, daysUntilStart: null, urgency: 'none' };
  }

  const today = localDay(input.now, input.timezone);
  const due = localDay(input.dueAt, input.timezone);

  // 期限当日も作業日に数えるので、必要日数から1引いた分だけ前倒しする
  const startBy = addDays(due, -(daysNeeded - 1));
  const daysUntilStart = diffDays(today, startBy);
  const daysUntilDue = diffDays(today, due);

  let urgency: Urgency;
  if (daysUntilDue < 0) urgency = 'overdue';
  else if (daysUntilStart < 0) urgency = 'impossible';  // 着手期限を過ぎている＝間に合わない
  else if (daysUntilStart === 0) urgency = 'today';
  else if (daysUntilStart <= 2) urgency = 'soon';
  else urgency = 'ok';

  return { daysNeeded, startBy, daysUntilStart, urgency };
}

/** 画面に出す短い説明。なぜその判定なのかが分かる文にする */
export function leadTimeLabel(lt: LeadTime): string | null {
  switch (lt.urgency) {
    case 'overdue':    return '期限切れ';
    case 'impossible': return `間に合わない（${lt.daysNeeded}日必要・着手期限 ${lt.startBy} を過ぎた）`;
    case 'today':      return `今日から始めないと間に合わない（${lt.daysNeeded}日必要）`;
    case 'soon':       return `あと${lt.daysUntilStart}日で着手期限（${lt.daysNeeded}日必要）`;
    default:           return null;
  }
}

/** 一覧の並べ替え用。着手が切羽詰まっているものほど大きい */
export function urgencyRank(u: Urgency): number {
  return { overdue: 5, impossible: 4, today: 3, soon: 2, ok: 1, none: 0 }[u];
}

export interface LeadTimeTask {
  estimateMin: number;
  dueAt: string | null;
  status: TaskStatus;
  importance: Importance;
}

/** 着手期限を過ぎている・今日が期限のタスクだけ拾う（通知や警告バナー用） */
export function needsAttention<T extends LeadTimeTask>(
  tasks: T[], now: string, timezone: string, dailyCapacityMin?: number,
): { task: T; lead: LeadTime }[] {
  return tasks
    .filter((t) => t.status !== 'done' && t.dueAt !== null)
    .map((t) => ({
      task: t,
      lead: leadTime({ estimateMin: t.estimateMin, dueAt: t.dueAt, now, timezone, dailyCapacityMin }),
    }))
    .filter((x) => urgencyRank(x.lead.urgency) >= urgencyRank('today'))
    .sort((a, b) => urgencyRank(b.lead.urgency) - urgencyRank(a.lead.urgency));
}

// ---- 日付ユーティリティ（タイムゾーンはプロフィールの値で固定して扱う） ----

function localDay(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

function diffDays(from: string, to: string): number {
  const p = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((p(to) - p(from)) / 86400000);
}
