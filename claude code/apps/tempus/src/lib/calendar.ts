// 週表示・月表示のためのマス目作り。表示に必要な計算だけを純粋な関数で持つ。
// 日付はすべて 'YYYY-MM-DD' の文字列で扱う（Date を持ち回すとタイムゾーンで事故るため）。

export interface DayCell {
  day: string;          // 'YYYY-MM-DD'
  inMonth: boolean;     // 月表示で「その月の日か」（前後の月のはみ出し分は false）
  isToday: boolean;
  dow: number;          // 0=日
}

export function dayOfWeek(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function addMonths(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const lastOfTarget = new Date(Date.UTC(y, m - 1 + n + 1, 0)).getUTCDate();
  // 1/31 の翌月は 2/28 に寄せる（存在しない日付で3月に飛ばさない）
  return new Date(Date.UTC(y, m - 1 + n, Math.min(d, lastOfTarget))).toISOString().slice(0, 10);
}

/** その日を含む週（日曜始まり）の7日 */
export function weekOf(day: string, today: string): DayCell[] {
  const start = addDays(day, -dayOfWeek(day));
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(start, i);
    return { day: d, inMonth: true, isToday: d === today, dow: dayOfWeek(d) };
  });
}

/** その月のカレンダー。前後の月を足して必ず7の倍数のマスにする */
export function monthOf(day: string, today: string): DayCell[] {
  const [y, m] = day.split('-').map(Number);
  const first = `${y}-${String(m).padStart(2, '0')}-01`;
  const lastDate = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const start = addDays(first, -dayOfWeek(first));
  const total = Math.ceil((dayOfWeek(first) + lastDate) / 7) * 7;

  return Array.from({ length: total }, (_, i) => {
    const d = addDays(start, i);
    return {
      day: d,
      inMonth: d.slice(0, 7) === first.slice(0, 7),
      isToday: d === today,
      dow: dayOfWeek(d),
    };
  });
}

export function monthLabel(day: string): string {
  const [y, m] = day.split('-');
  return `${y}年${Number(m)}月`;
}

export function weekLabel(cells: DayCell[]): string {
  if (cells.length === 0) return '';
  const f = cells[0].day.split('-');
  const l = cells[cells.length - 1].day.split('-');
  return f[1] === l[1]
    ? `${Number(f[1])}月 ${Number(f[2])}日 〜 ${Number(l[2])}日`
    : `${Number(f[1])}月${Number(f[2])}日 〜 ${Number(l[1])}月${Number(l[2])}日`;
}

/** ある日に該当する項目だけ拾う。開始と終了を持つものは日をまたいでも拾える */
export function onDay<T extends { start: string; end: string }>(
  items: T[], day: string, timezone: string,
): T[] {
  return items.filter((it) => {
    const s = localDay(it.start, timezone);
    const e = localDay(it.end, timezone);
    return s <= day && day <= e;
  });
}

export function localDay(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}
