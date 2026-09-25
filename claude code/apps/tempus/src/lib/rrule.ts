// GoogleカレンダーのRRULE（RFC5545）を Tempus の繰り返しルールに変換する。
//
// Tempus のルールは 'daily' / 'weekdays' / 'weekly:1,3' / 'monthly:15' の4種だけ。
// RRULE はもっと表現力があるので、**表せないものは取り込まない**。
// 無理に近い形へ丸めると「毎月第2火曜」が「毎月8日」になったりして、
// 静かにズレたタスクが毎月生まれることになる。落とすなら理由を添えて落とす。

export type ConvertResult =
  | { ok: true; rule: string }
  | { ok: false; reason: string };

const DAY_NUM: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

/**
 * @param rrule 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE' の形（'RRULE:' は有無どちらでも可）
 * @param dtstart 開始日 'YYYY-MM-DD'。BYDAY/BYMONTHDAY が無い時に曜日・日を補うのに使う
 */
export function rruleToTempus(rrule: string, dtstart: string): ConvertResult {
  const body = rrule.replace(/^RRULE:/i, '').trim();
  if (!body) return { ok: false, reason: '繰り返しルールが空' };

  const parts: Record<string, string> = {};
  for (const kv of body.split(';')) {
    const i = kv.indexOf('=');
    if (i > 0) parts[kv.slice(0, i).toUpperCase()] = kv.slice(i + 1).toUpperCase();
  }

  const interval = parts.INTERVAL ? Number(parts.INTERVAL) : 1;
  if (!Number.isFinite(interval) || interval < 1) return { ok: false, reason: 'INTERVALが不正' };
  if (interval > 1) return { ok: false, reason: `${interval}回おきの繰り返しには未対応` };

  switch (parts.FREQ) {
    case 'DAILY':
      return { ok: true, rule: 'daily' };

    case 'WEEKLY': {
      const byday = parts.BYDAY ? parts.BYDAY.split(',').map((s) => s.trim()) : [];
      if (byday.length === 0) {
        const d = weekdayOf(dtstart);
        if (d === null) return { ok: false, reason: '開始日が読めない' };
        return { ok: true, rule: `weekly:${d}` };
      }
      // '2MO'（第2月曜）のような序数付きは週次では出ないが、来たら弾く
      if (byday.some((b) => !(b in DAY_NUM))) {
        return { ok: false, reason: '曜日の指定に未対応の形式が含まれる' };
      }
      const nums = byday.map((b) => DAY_NUM[b]).sort((a, b) => a - b);
      const isWeekdays = nums.length === 5 && nums.every((n, i) => n === i + 1);
      return { ok: true, rule: isWeekdays ? 'weekdays' : `weekly:${nums.join(',')}` };
    }

    case 'MONTHLY': {
      if (parts.BYDAY) return { ok: false, reason: '「第N曜日」の繰り返しには未対応' };
      const raw = parts.BYMONTHDAY ?? String(dayOf(dtstart) ?? '');
      const days = raw.split(',').map((s) => Number(s.trim()));
      if (days.length === 0 || days.some((d) => !Number.isInteger(d))) {
        return { ok: false, reason: '日付の指定が読めない' };
      }
      // -1（月末）などの負の指定は表せない
      if (days.some((d) => d < 1 || d > 31)) return { ok: false, reason: '月末からの逆算指定には未対応' };
      return { ok: true, rule: `monthly:${days.sort((a, b) => a - b).join(',')}` };
    }

    case 'YEARLY':
      return { ok: false, reason: '毎年の繰り返しには未対応' };

    default:
      return { ok: false, reason: `未知の繰り返し種別: ${parts.FREQ ?? '(なし)'}` };
  }
}

/** RRULE群から最初の RRULE 行を取り出す（Googleは EXDATE や RDATE も同じ配列に入れてくる） */
export function pickRrule(recurrence: string[] | null | undefined): string | null {
  if (!recurrence) return null;
  return recurrence.find((r) => /^RRULE[:;]/i.test(r.trim())) ?? null;
}

/** 終わりが決まっている繰り返しか（COUNT/UNTIL付き）。取り込む時に注意を出すため */
export function hasEnd(rrule: string): boolean {
  return /(^|;)(COUNT|UNTIL)=/i.test(rrule.replace(/^RRULE:/i, ''));
}

function weekdayOf(day: string): number | null {
  const m = day.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay();
}

function dayOf(day: string): number | null {
  const m = day.match(/^\d{4}-\d{2}-(\d{2})/);
  return m ? Number(m[1]) : null;
}
