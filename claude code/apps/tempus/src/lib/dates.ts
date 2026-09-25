// タイムゾーンは常に profile の値（既定 Asia/Tokyo）を使う。端末のTZに依存させない。

export function todayInTz(tz: string, now = new Date()): string {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return f.format(now); // YYYY-MM-DD
}

/** 指定タイムゾーンの「その日の 00:00 / 翌日 00:00」を UTC の Date で返す */
export function dayBoundsUtc(day: string, tz: string): { start: Date; end: Date } {
  const start = zonedTimeToUtc(day, '00:00', tz);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/** 'YYYY-MM-DD' + 'HH:MM' をそのタイムゾーンの時刻として解釈し、UTCのDateにする */
export function zonedTimeToUtc(day: string, hhmm: string, tz: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  // まずUTCとして仮に作り、そのTZでの表示との差分でオフセットを求めて補正する
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = tzOffsetMs(new Date(guess), tz);
  return new Date(guess - offset);
}

function tzOffsetMs(at: Date, tz: string): number {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: Record<string, number> = {};
  for (const { type, value } of f.formatToParts(at)) {
    if (type !== 'literal') p[type] = Number(value);
  }
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
  return asUtc - at.getTime();
}

export function fmtTime(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));
}

export function minutesBetween(aIso: string, bIso: string): number {
  return Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 60000);
}

/** そのタイムゾーンでの「その日の何時何分か」を分数（0〜1439）で返す */
export function minutesOfDayInTz(iso: string, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(iso));
  const hh = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const mm = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return hh * 60 + mm;
}
