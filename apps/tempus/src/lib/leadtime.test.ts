import { describe, it, expect } from 'vitest';
import { leadTime, leadTimeLabel, needsAttention, urgencyRank } from './leadtime';

const TZ = 'Asia/Tokyo';
// 2026-08-26 10:00 JST
const NOW = '2026-08-26T01:00:00Z';

const at = (day: string, hhmm = '18:00') => {
  const [h, m] = hhmm.split(':').map(Number);
  const [y, mo, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - 9, m)).toISOString();
};

describe('leadTime（着手期限の逆算）', () => {
  it('1日で終わる仕事は期限当日が着手期限', () => {
    const lt = leadTime({ estimateMin: 60, dueAt: at('2026-08-30'), now: NOW, timezone: TZ });
    expect(lt.daysNeeded).toBe(1);
    expect(lt.startBy).toBe('2026-08-30');
    expect(lt.urgency).toBe('ok');
  });

  it('1日の可処分時間を超える仕事は、必要日数だけ前倒しになる', () => {
    // 600分 ÷ 180分/日 = 3.33 → 4日必要 → 期限の3日前から
    const lt = leadTime({ estimateMin: 600, dueAt: at('2026-08-30'), now: NOW, timezone: TZ });
    expect(lt.daysNeeded).toBe(4);
    expect(lt.startBy).toBe('2026-08-27');
    expect(lt.daysUntilStart).toBe(1);
    expect(lt.urgency).toBe('soon');
  });

  it('今日が着手期限なら today', () => {
    // 4日必要・期限8/29 → 着手期限は8/26＝今日
    const lt = leadTime({ estimateMin: 600, dueAt: at('2026-08-29'), now: NOW, timezone: TZ });
    expect(lt.startBy).toBe('2026-08-26');
    expect(lt.urgency).toBe('today');
  });

  it('着手期限を過ぎていたら impossible（期限自体はまだ先）', () => {
    // 4日必要・期限8/28 → 着手期限は8/25＝昨日。期限は明後日なのでまだ来ていない
    const lt = leadTime({ estimateMin: 600, dueAt: at('2026-08-28'), now: NOW, timezone: TZ });
    expect(lt.startBy).toBe('2026-08-25');
    expect(lt.daysUntilStart).toBe(-1);
    expect(lt.urgency).toBe('impossible');
  });

  it('期限そのものを過ぎていたら overdue', () => {
    const lt = leadTime({ estimateMin: 60, dueAt: at('2026-08-20'), now: NOW, timezone: TZ });
    expect(lt.urgency).toBe('overdue');
  });

  it('期限が無ければ判定しない', () => {
    const lt = leadTime({ estimateMin: 600, dueAt: null, now: NOW, timezone: TZ });
    expect(lt.startBy).toBeNull();
    expect(lt.urgency).toBe('none');
    expect(lt.daysNeeded).toBe(4);
  });

  it('1日の可処分時間を変えると必要日数が変わる', () => {
    const a = leadTime({ estimateMin: 600, dueAt: at('2026-08-30'), now: NOW, timezone: TZ, dailyCapacityMin: 60 });
    expect(a.daysNeeded).toBe(10);
    const b = leadTime({ estimateMin: 600, dueAt: at('2026-08-30'), now: NOW, timezone: TZ, dailyCapacityMin: 600 });
    expect(b.daysNeeded).toBe(1);
  });

  it('JSTの朝（UTCでは前日）でも今日の判定がずれない', () => {
    // 2026-08-26 08:00 JST = 2026-08-25 23:00 UTC
    const morning = '2026-08-25T23:00:00Z';
    const lt = leadTime({ estimateMin: 600, dueAt: at('2026-08-29'), now: morning, timezone: TZ });
    expect(lt.startBy).toBe('2026-08-26');
    expect(lt.urgency).toBe('today'); // UTC暦日で見ると soon に化ける
  });

  it('見積もりが極端に小さくても最低1日は必要', () => {
    const lt = leadTime({ estimateMin: 1, dueAt: at('2026-08-30'), now: NOW, timezone: TZ });
    expect(lt.daysNeeded).toBe(1);
  });
});

describe('leadTimeLabel', () => {
  it('余裕がある時は何も出さない（警告を薄めないため）', () => {
    const lt = leadTime({ estimateMin: 60, dueAt: at('2026-09-30'), now: NOW, timezone: TZ });
    expect(leadTimeLabel(lt)).toBeNull();
  });

  it('切羽詰まっている時は理由まで出す', () => {
    const lt = leadTime({ estimateMin: 600, dueAt: at('2026-08-29'), now: NOW, timezone: TZ });
    expect(leadTimeLabel(lt)).toContain('今日から');
    expect(leadTimeLabel(lt)).toContain('4日必要');
  });
});

describe('needsAttention', () => {
  const base = { status: 'todo' as const, importance: 'mid' as const };

  it('着手期限が来ているものだけを、切迫順に拾う', () => {
    const tasks = [
      { ...base, estimateMin: 60, dueAt: at('2026-09-30') },   // 余裕 → 対象外
      { ...base, estimateMin: 600, dueAt: at('2026-08-29') },  // today
      { ...base, estimateMin: 60, dueAt: at('2026-08-20') },   // overdue
      { ...base, estimateMin: 600, dueAt: at('2026-08-28') },  // impossible
      { ...base, estimateMin: 60, dueAt: null },               // 期限なし → 対象外
    ];
    const got = needsAttention(tasks, NOW, TZ);
    expect(got.map((g) => g.lead.urgency)).toEqual(['overdue', 'impossible', 'today']);
  });

  it('完了済みは拾わない', () => {
    const tasks = [{ ...base, status: 'done' as const, estimateMin: 60, dueAt: at('2026-08-20') }];
    expect(needsAttention(tasks, NOW, TZ)).toHaveLength(0);
  });
});

describe('urgencyRank', () => {
  it('切迫している順に大きい', () => {
    expect(urgencyRank('overdue')).toBeGreaterThan(urgencyRank('impossible'));
    expect(urgencyRank('impossible')).toBeGreaterThan(urgencyRank('today'));
    expect(urgencyRank('today')).toBeGreaterThan(urgencyRank('soon'));
    expect(urgencyRank('soon')).toBeGreaterThan(urgencyRank('ok'));
    expect(urgencyRank('ok')).toBeGreaterThan(urgencyRank('none'));
  });
});
