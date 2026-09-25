import { describe, it, expect } from 'vitest';
import { occursOn, describeRule, isValidRule, dueToday, InvalidRuleError, type Recurrence } from './recurrence';

// 2026-08-26 は水曜
const WED = '2026-08-26';
const SAT = '2026-08-29';
const SUN = '2026-08-30';

describe('occursOn', () => {
  it('daily は毎日', () => {
    expect(occursOn('daily', WED)).toBe(true);
    expect(occursOn('daily', SUN)).toBe(true);
  });

  it('weekdays は平日だけ', () => {
    expect(occursOn('weekdays', WED)).toBe(true);
    expect(occursOn('weekdays', SAT)).toBe(false);
    expect(occursOn('weekdays', SUN)).toBe(false);
  });

  it('weekly は指定の曜日だけ', () => {
    expect(occursOn('weekly:3', WED)).toBe(true);   // 水
    expect(occursOn('weekly:1,5', WED)).toBe(false);
    expect(occursOn('weekly:0', SUN)).toBe(true);   // 日
  });

  it('monthly は指定日', () => {
    expect(occursOn('monthly:26', WED)).toBe(true);
    expect(occursOn('monthly:1', WED)).toBe(false);
  });

  it('31日指定は、31日が無い月では月末に寄る', () => {
    expect(occursOn('monthly:31', '2026-02-28')).toBe(true);   // 2月は28日まで
    expect(occursOn('monthly:31', '2026-04-30')).toBe(true);   // 4月は30日まで
    expect(occursOn('monthly:31', '2026-05-30')).toBe(false);  // 5月は31日がある
    expect(occursOn('monthly:31', '2026-05-31')).toBe(true);
  });

  it('うるう年の2月29日も扱える', () => {
    expect(occursOn('monthly:31', '2028-02-29')).toBe(true);
    expect(occursOn('monthly:29', '2028-02-29')).toBe(true);
  });

  it('壊れたルールは例外にする（黙って false にしない）', () => {
    expect(() => occursOn('yearly', WED)).toThrow(InvalidRuleError);
    expect(() => occursOn('weekly:9', WED)).toThrow(InvalidRuleError);
    expect(() => occursOn('weekly', WED)).toThrow(InvalidRuleError);
    expect(() => occursOn('monthly:0', WED)).toThrow(InvalidRuleError);
  });
});

describe('describeRule', () => {
  it('日本語で読める', () => {
    expect(describeRule('daily')).toBe('毎日');
    expect(describeRule('weekdays')).toBe('平日（月〜金）');
    expect(describeRule('weekly:1,3')).toBe('毎週 月・水曜');
    expect(describeRule('monthly:15')).toBe('毎月 15日');
  });
});

describe('isValidRule', () => {
  it('妥当性を判定できる', () => {
    expect(isValidRule('daily')).toBe(true);
    expect(isValidRule('weekly:0,6')).toBe(true);
    expect(isValidRule('weekly:7')).toBe(false);
    expect(isValidRule('')).toBe(false);
  });
});

describe('dueToday', () => {
  const r = (id: string, rule: string, active = true): Recurrence => ({
    id, title: id, rule, estimateMin: 15, active, checklist: [], timeOfDay: null,
  });

  it('該当するものだけ返す', () => {
    const got = dueToday([r('a', 'daily'), r('b', 'weekly:1')], WED, new Set());
    expect(got.map((x) => x.id)).toEqual(['a']);
  });

  it('停止中は返さない', () => {
    expect(dueToday([r('a', 'daily', false)], WED, new Set())).toHaveLength(0);
  });

  it('すでに今日起こした分は返さない（二重起票の防止）', () => {
    expect(dueToday([r('a', 'daily')], WED, new Set(['a']))).toHaveLength(0);
  });

  it('壊れたルールが1件あっても、他の繰り返しは止まらない', () => {
    const got = dueToday([r('bad', 'nonsense'), r('good', 'daily')], WED, new Set());
    expect(got.map((x) => x.id)).toEqual(['good']);
  });
});
