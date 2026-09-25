import { describe, it, expect } from 'vitest';
import { rruleToTempus, pickRrule, hasEnd } from './rrule';

// 2026-08-26 は水曜
const WED = '2026-08-26';

const ok = (r: string, d = WED) => {
  const v = rruleToTempus(r, d);
  if (!v.ok) throw new Error(`変換に失敗: ${v.reason}`);
  return v.rule;
};
const ng = (r: string, d = WED) => {
  const v = rruleToTempus(r, d);
  if (v.ok) throw new Error(`弾かれるべきだが通った: ${v.rule}`);
  return v.reason;
};

describe('rruleToTempus — 変換できるもの', () => {
  it('毎日', () => expect(ok('RRULE:FREQ=DAILY')).toBe('daily'));
  it('RRULE: が無くても読める', () => expect(ok('FREQ=DAILY')).toBe('daily'));
  it('小文字でも読める', () => expect(ok('rrule:freq=daily')).toBe('daily'));

  it('平日（月〜金）は weekdays にまとまる', () =>
    expect(ok('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR')).toBe('weekdays'));

  it('曜日の順序が入れ替わっていても weekdays と判定する', () =>
    expect(ok('RRULE:FREQ=WEEKLY;BYDAY=FR,MO,WE,TU,TH')).toBe('weekdays'));

  it('特定の曜日', () => expect(ok('RRULE:FREQ=WEEKLY;BYDAY=MO,WE')).toBe('weekly:1,3'));
  it('日曜', () => expect(ok('RRULE:FREQ=WEEKLY;BYDAY=SU')).toBe('weekly:0'));

  it('BYDAYが無い週次は開始日の曜日を使う', () =>
    expect(ok('RRULE:FREQ=WEEKLY')).toBe('weekly:3')); // 8/26は水曜

  it('毎月の日付指定', () => expect(ok('RRULE:FREQ=MONTHLY;BYMONTHDAY=15')).toBe('monthly:15'));
  it('毎月の複数日', () => expect(ok('RRULE:FREQ=MONTHLY;BYMONTHDAY=1,15')).toBe('monthly:1,15'));

  it('BYMONTHDAYが無い月次は開始日の日を使う', () =>
    expect(ok('RRULE:FREQ=MONTHLY')).toBe('monthly:26'));

  it('COUNT付きでも変換はできる', () =>
    expect(ok('RRULE:FREQ=DAILY;COUNT=10')).toBe('daily'));

  it('INTERVAL=1 は明示されていても通る', () =>
    expect(ok('RRULE:FREQ=DAILY;INTERVAL=1')).toBe('daily'));
});

describe('rruleToTempus — 表せないものは理由付きで弾く', () => {
  it('隔週（INTERVAL=2）', () =>
    expect(ng('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO')).toContain('2回おき'));

  it('第2火曜（MONTHLY + BYDAY）', () =>
    expect(ng('RRULE:FREQ=MONTHLY;BYDAY=2TU')).toContain('第N曜日'));

  it('月末（BYMONTHDAY=-1）', () =>
    expect(ng('RRULE:FREQ=MONTHLY;BYMONTHDAY=-1')).toContain('月末'));

  it('毎年', () => expect(ng('RRULE:FREQ=YEARLY')).toContain('毎年'));
  it('空', () => expect(ng('RRULE:')).toContain('空'));
  it('未知の種別', () => expect(ng('RRULE:FREQ=HOURLY')).toContain('未知'));

  it('曜日に序数が付いていたら弾く', () =>
    expect(ng('RRULE:FREQ=WEEKLY;BYDAY=2MO')).toContain('未対応の形式'));

  it('INTERVALが不正', () => expect(ng('RRULE:FREQ=DAILY;INTERVAL=0')).toContain('INTERVAL'));
});

describe('pickRrule', () => {
  it('RRULE行だけを拾う', () => {
    expect(pickRrule(['EXDATE;TZID=Asia/Tokyo:20260901T090000', 'RRULE:FREQ=DAILY']))
      .toBe('RRULE:FREQ=DAILY');
  });
  it('RRULEが無ければnull', () => expect(pickRrule(['EXDATE:20260901'])).toBeNull());
  it('空・未定義でも落ちない', () => {
    expect(pickRrule([])).toBeNull();
    expect(pickRrule(null)).toBeNull();
    expect(pickRrule(undefined)).toBeNull();
  });
});

describe('hasEnd', () => {
  it('COUNT付きは終わりがある', () => expect(hasEnd('RRULE:FREQ=DAILY;COUNT=5')).toBe(true));
  it('UNTIL付きは終わりがある', () => expect(hasEnd('RRULE:FREQ=DAILY;UNTIL=20261231T000000Z')).toBe(true));
  it('無期限', () => expect(hasEnd('RRULE:FREQ=DAILY')).toBe(false));
  it('COUNTという文字が別の場所にあっても誤検知しない', () =>
    expect(hasEnd('RRULE:FREQ=WEEKLY;BYDAY=MO')).toBe(false));
});
