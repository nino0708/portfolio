// 「毎日やっている作業」を毎朝タスクとして自動で起こすためのルール判定。
//
// ルールは人が読める短い文字列で持つ。cron 式にしないのは、設定画面で意味が分かることと、
// 判定を目で追えることを優先したため。
//
//   daily            毎日
//   weekdays         平日（月〜金）
//   weekly:1,3,5     指定の曜日（0=日 1=月 ... 6=土）
//   monthly:15       毎月15日（その月に無い日付なら月末に丸める）

export type RecurrenceRule = string;

export interface Recurrence {
  id: string;
  title: string;
  rule: RecurrenceRule;
  estimateMin: number;
  active: boolean;
  checklist: string[];
  timeOfDay: string | null;   // 'HH:MM'
}

export class InvalidRuleError extends Error {}

/** その日（'YYYY-MM-DD'）にこのルールが該当するか */
export function occursOn(rule: RecurrenceRule, day: string): boolean {
  const [kind, arg] = rule.split(':');
  const dow = dayOfWeek(day);

  switch (kind) {
    case 'daily':
      return true;
    case 'weekdays':
      return dow >= 1 && dow <= 5;
    case 'weekly': {
      const days = parseNums(arg, 0, 6);
      return days.includes(dow);
    }
    case 'monthly': {
      const wanted = parseNums(arg, 1, 31);
      const [y, m, d] = day.split('-').map(Number);
      const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
      // 31日指定の月末が30日までしかない月では、月末日に寄せる
      return wanted.some((w) => d === Math.min(w, lastDay));
    }
    default:
      throw new InvalidRuleError(`未知の繰り返しルール: ${rule}`);
  }
}

/** 設定画面に出す日本語表記 */
export function describeRule(rule: RecurrenceRule): string {
  const [kind, arg] = rule.split(':');
  const names = ['日', '月', '火', '水', '木', '金', '土'];
  switch (kind) {
    case 'daily': return '毎日';
    case 'weekdays': return '平日（月〜金）';
    case 'weekly': return `毎週 ${parseNums(arg, 0, 6).map((d) => names[d]).join('・')}曜`;
    case 'monthly': return `毎月 ${parseNums(arg, 1, 31).join('・')}日`;
    default: throw new InvalidRuleError(`未知の繰り返しルール: ${rule}`);
  }
}

export function isValidRule(rule: RecurrenceRule): boolean {
  try {
    occursOn(rule, '2026-01-01');
    return true;
  } catch {
    return false;
  }
}

/** その日に起こすべき繰り返しを選ぶ。すでに起こした分は alreadyDone で除く */
export function dueToday(
  recurrences: Recurrence[], day: string, alreadyDone: Set<string>,
): Recurrence[] {
  return recurrences.filter(
    (r) => r.active && !alreadyDone.has(r.id) && safeOccurs(r.rule, day),
  );
}

// 壊れたルールが1件混ざっても、他の繰り返しまで止めない
function safeOccurs(rule: RecurrenceRule, day: string): boolean {
  try {
    return occursOn(rule, day);
  } catch {
    return false;
  }
}

function dayOfWeek(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function parseNums(arg: string | undefined, min: number, max: number): number[] {
  if (!arg) throw new InvalidRuleError('繰り返しルールに値がありません');
  const nums = arg.split(',').map((s) => Number(s.trim()));
  if (nums.length === 0 || nums.some((n) => !Number.isInteger(n) || n < min || n > max)) {
    throw new InvalidRuleError(`値が範囲外です (${min}〜${max}): ${arg}`);
  }
  return nums;
}
