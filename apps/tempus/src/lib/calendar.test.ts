import { describe, it, expect } from 'vitest';
import { weekOf, monthOf, addMonths, addDays, monthLabel, weekLabel, onDay } from './calendar';

const TODAY = '2026-08-26'; // 水曜

describe('weekOf', () => {
  it('日曜始まりの7日を返す', () => {
    const w = weekOf(TODAY, TODAY);
    expect(w).toHaveLength(7);
    expect(w[0].day).toBe('2026-08-23'); // 日
    expect(w[6].day).toBe('2026-08-29'); // 土
    expect(w[0].dow).toBe(0);
  });

  it('今日に印が付く', () => {
    expect(weekOf(TODAY, TODAY).filter((d) => d.isToday).map((d) => d.day)).toEqual([TODAY]);
  });

  it('月をまたぐ週も途切れない', () => {
    const w = weekOf('2026-08-31', TODAY);
    expect(w.map((d) => d.day)).toContain('2026-09-05');
  });
});

describe('monthOf', () => {
  it('マス数は必ず7の倍数', () => {
    for (const d of ['2026-01-15', '2026-02-15', '2026-08-15', '2028-02-15']) {
      expect(monthOf(d, TODAY).length % 7).toBe(0);
    }
  });

  it('その月の日だけ inMonth が true', () => {
    const cells = monthOf('2026-08-15', TODAY);
    expect(cells.filter((c) => c.inMonth)).toHaveLength(31);
    expect(cells[0].inMonth).toBe(false); // 7/26(日)から始まる
    expect(cells[0].day).toBe('2026-07-26');
  });

  it('うるう年の2月は29日ある', () => {
    expect(monthOf('2028-02-10', TODAY).filter((c) => c.inMonth)).toHaveLength(29);
  });

  it('1日が日曜の月でも先頭が欠けない', () => {
    const cells = monthOf('2026-11-01', TODAY); // 2026-11-01 は日曜
    expect(cells[0].day).toBe('2026-11-01');
    expect(cells[0].inMonth).toBe(true);
  });
});

describe('addMonths', () => {
  it('存在しない日付は月末に寄せる（3月に飛ばさない）', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
  });

  it('年をまたげる', () => {
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15');
    expect(addMonths('2026-01-15', -1)).toBe('2025-12-15');
  });
});

describe('addDays', () => {
  it('月末・年末をまたげる', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });
});

describe('ラベル', () => {
  it('月', () => expect(monthLabel('2026-08-26')).toBe('2026年8月'));
  it('週（同月）', () => expect(weekLabel(weekOf(TODAY, TODAY))).toBe('8月 23日 〜 29日'));
  it('週（月またぎ）', () => expect(weekLabel(weekOf('2026-08-31', TODAY))).toBe('8月30日 〜 9月5日'));
});

describe('onDay', () => {
  const TZ = 'Asia/Tokyo';
  it('日をまたぐ項目は両方の日で拾える', () => {
    const item = { start: '2026-08-26T14:00:00Z', end: '2026-08-26T16:00:00Z' }; // JST 23:00-翌1:00
    expect(onDay([item], '2026-08-26', TZ)).toHaveLength(1);
    expect(onDay([item], '2026-08-27', TZ)).toHaveLength(1);
    expect(onDay([item], '2026-08-25', TZ)).toHaveLength(0);
  });

  it('JSTの深夜はUTCの前日だが、JSTの日付で拾える', () => {
    const item = { start: '2026-08-25T23:30:00Z', end: '2026-08-26T00:30:00Z' }; // JST 8/26 08:30-09:30
    expect(onDay([item], '2026-08-26', TZ)).toHaveLength(1);
  });

  it('windowStart〜dueAtの範囲に含まれる日はすべて拾う', () => {
    const items = [{ start: '2026-08-25T00:00:00', end: '2026-08-27T23:59:59', title: 'w' }];
    expect(onDay(items, '2026-08-24', TZ)).toHaveLength(0);
    expect(onDay(items, '2026-08-25', TZ)).toHaveLength(1);
    expect(onDay(items, '2026-08-26', TZ)).toHaveLength(1);
    expect(onDay(items, '2026-08-27', TZ)).toHaveLength(1);
    expect(onDay(items, '2026-08-28', TZ)).toHaveLength(0);
  });
});
