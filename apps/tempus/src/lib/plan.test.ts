import { describe, it, expect } from 'vitest';
import { planDay, priorityScore } from './plan';
import type { PlanInput, SchedulableTask } from '../types/domain';

function task(overrides: Partial<SchedulableTask> & { id: string }): SchedulableTask {
  return {
    title: overrides.id,
    estimateMin: 30,
    importance: 'mid',
    dueAt: null,
    status: 'todo',
    ...overrides,
  };
}

function baseInput(overrides: Partial<PlanInput>): PlanInput {
  return {
    now: '2026-08-24T00:00:00Z',
    day: '2026-08-24',
    timezone: 'Asia/Tokyo',
    workdayStart: '09:00',
    workdayEnd: '18:00',
    busy: [],
    tasks: [],
    ...overrides,
  };
}

describe('planDay', () => {
  it('予定が1つも無い日は優先度順に隙間なく詰めて全部置ける', () => {
    const input = baseInput({
      workdayEnd: '18:00',
      tasks: [
        task({ id: 't3', importance: 'low', estimateMin: 45 }),
        task({ id: 't1', importance: 'high', estimateMin: 60 }),
        task({ id: 't2', importance: 'mid', estimateMin: 30 }),
      ],
    });

    const result = planDay(input);

    expect(result.unplaced).toEqual([]);
    expect(result.slots).toEqual([
      { taskId: 't1', start: '2026-08-24T00:00:00.000Z', end: '2026-08-24T01:00:00.000Z', score: 30 },
      { taskId: 't2', start: '2026-08-24T01:05:00.000Z', end: '2026-08-24T01:35:00.000Z', score: 20 },
      { taskId: 't3', start: '2026-08-24T01:40:00.000Z', end: '2026-08-24T02:25:00.000Z', score: 10 },
    ]);
  });

  it('予定がびっしりで1つも置けない日は全部 unplaced/no_room になる', () => {
    const input = baseInput({
      busy: [{ start: '2026-08-23T23:00:00Z', end: '2026-08-24T09:30:00Z' }],
      tasks: [task({ id: 't1' }), task({ id: 't2' })],
    });

    const result = planDay(input);

    expect(result.slots).toEqual([]);
    expect(result.unplaced.sort((a, b) => a.taskId.localeCompare(b.taskId))).toEqual([
      { taskId: 't1', reason: 'no_room' },
      { taskId: 't2', reason: 'no_room' },
    ]);
  });

  it('busy が重複・順不同でも正しくマージされてから引かれる', () => {
    const input = baseInput({
      workdayStart: '09:00',
      workdayEnd: '12:00',
      // 意図的に順不同・重複させる。マージが正しければ 09:30-11:00 の1本になり、
      // 残る空きは 09:00-09:30(30分) と 11:00-12:00(60分) の2つだけになる。
      busy: [
        { start: '2026-08-24T01:00:00Z', end: '2026-08-24T02:00:00Z' }, // 10:00-11:00 JST
        { start: '2026-08-24T00:30:00Z', end: '2026-08-24T01:30:00Z' }, // 09:30-10:30 JST
      ],
      tasks: [task({ id: 't1', estimateMin: 40 })],
    });

    const result = planDay(input);

    // マージが壊れていると 09:00-10:00 あたりに誤った隙間ができ、そこに置かれてしまう。
    expect(result.slots).toEqual([
      { taskId: 't1', start: '2026-08-24T02:00:00.000Z', end: '2026-08-24T02:40:00.000Z', score: expect.any(Number) },
    ]);
  });

  it('now が昼の場合、午前中の空きは使われない', () => {
    const input = baseInput({
      now: '2026-08-24T04:00:00Z', // 13:00 JST
      workdayStart: '09:00',
      workdayEnd: '18:00',
      tasks: [task({ id: 't1', importance: 'high', estimateMin: 30 })],
    });

    const result = planDay(input);

    expect(result.slots).toHaveLength(1);
    expect(result.slots[0].start).toBe('2026-08-24T04:00:00.000Z');
  });

  it('見積もりが空き時間より大きいタスクは飛ばされ、後続の小さいタスクが入る', () => {
    const input = baseInput({
      workdayStart: '09:00',
      workdayEnd: '10:00', // 60分しかない
      tasks: [
        task({ id: 'big', importance: 'high', estimateMin: 90 }),
        task({ id: 'small', importance: 'low', estimateMin: 20 }),
      ],
    });

    const result = planDay(input);

    expect(result.unplaced).toEqual([{ taskId: 'big', reason: 'too_large' }]);
    expect(result.slots).toEqual([
      { taskId: 'small', start: '2026-08-24T00:00:00.000Z', end: '2026-08-24T00:20:00.000Z', score: 10 },
    ]);
  });

  it('期限切れタスクが最優先で置かれる', () => {
    const input = baseInput({
      workdayStart: '09:00',
      workdayEnd: '09:30', // 30分しかない → どちらか1つしか入らない
      tasks: [
        task({ id: 'high-no-due', importance: 'high', estimateMin: 20 }),
        task({ id: 'overdue-low', importance: 'low', estimateMin: 20, dueAt: '2026-08-20T00:00:00Z' }),
      ],
    });

    const result = planDay(input);

    expect(result.slots).toEqual([
      { taskId: 'overdue-low', start: '2026-08-24T00:00:00.000Z', end: '2026-08-24T00:20:00.000Z', score: 60 },
    ]);
    expect(result.unplaced).toEqual([{ taskId: 'high-no-due', reason: 'no_room' }]);
  });

  it('入力タスクは slots と unplaced に過不足なく1回ずつ現れる（取りこぼしゼロ）', () => {
    const input = baseInput({
      workdayStart: '09:00',
      workdayEnd: '12:00',
      busy: [{ start: '2026-08-24T01:00:00Z', end: '2026-08-24T01:30:00Z' }],
      tasks: [
        task({ id: 'done1', status: 'done' }),
        task({ id: 'too-big-1', estimateMin: 200 }),
        task({ id: 'too-big-2', estimateMin: 500 }),
        task({ id: 'mid1', importance: 'mid', estimateMin: 50 }),
        task({ id: 'low1', importance: 'low', estimateMin: 20 }),
        task({ id: 'overdue1', importance: 'high', estimateMin: 45, dueAt: '2026-08-01T00:00:00Z' }),
      ],
    });

    const result = planDay(input);
    const allIds = [...result.slots.map((s) => s.taskId), ...result.unplaced.map((u) => u.taskId)];

    expect(new Set(allIds).size).toBe(allIds.length);
    expect(allIds.sort()).toEqual(input.tasks.map((t) => t.id).sort());
  });

  it('日付をまたぐ busy を渡しても壊れず、正しく空きから差し引かれる', () => {
    const input = baseInput({
      workdayStart: '09:00',
      workdayEnd: '18:00',
      busy: [
        // 完全に窓の外（前日22時〜翌2時）: 影響なしのはず
        { start: '2026-08-23T13:00:00Z', end: '2026-08-23T17:00:00Z' },
        // 前日23時(JST)〜当日10時(JST)にまたがる: 09:00-10:00 JSTだけ塞ぐ
        { start: '2026-08-23T14:00:00Z', end: '2026-08-24T01:00:00Z' },
      ],
      tasks: [task({ id: 't1', estimateMin: 30 })],
    });

    const result = planDay(input);

    expect(result.slots).toEqual([
      { taskId: 't1', start: '2026-08-24T01:00:00.000Z', end: '2026-08-24T01:30:00.000Z', score: expect.any(Number) },
    ]);
  });

  it("timezone='Asia/Tokyo' で UTC との9時間差を正しく扱う", () => {
    const input = baseInput({
      now: '2026-08-23T23:00:00Z', // 08:00 JST（稼働開始前）
      workdayStart: '09:00',
      workdayEnd: '10:00',
      timezone: 'Asia/Tokyo',
      tasks: [task({ id: 't1', estimateMin: 30 })],
    });

    const result = planDay(input);

    // 09:00 JST は 00:00Z のはず
    expect(result.slots).toEqual([
      { taskId: 't1', start: '2026-08-24T00:00:00.000Z', end: '2026-08-24T00:30:00.000Z', score: expect.any(Number) },
    ]);
  });

  it('稼働時間帯そのものが now より前なら全部 unplaced/past_due_window になる', () => {
    const input = baseInput({
      now: '2026-08-24T10:00:00Z', // 19:00 JST（稼働終了後）
      workdayStart: '09:00',
      workdayEnd: '18:00',
      tasks: [task({ id: 't1' })],
    });

    const result = planDay(input);

    expect(result.slots).toEqual([]);
    expect(result.unplaced).toEqual([{ taskId: 't1', reason: 'past_due_window' }]);
  });
});

describe('priorityScore', () => {
  const now = '2026-08-24T00:00:00Z';

  it('重要度の基礎点が正しい', () => {
    expect(priorityScore(task({ id: 'a', importance: 'high', estimateMin: 60 }), now)).toBe(30);
    expect(priorityScore(task({ id: 'b', importance: 'mid', estimateMin: 60 }), now)).toBe(20);
    expect(priorityScore(task({ id: 'c', importance: 'low', estimateMin: 60 }), now)).toBe(10);
  });

  it('期限切れは+50される', () => {
    const t = task({ id: 'a', importance: 'low', estimateMin: 60, dueAt: '2026-08-01T00:00:00Z' });
    expect(priorityScore(t, now)).toBe(10 + 50);
  });

  it('15分以内のクイックウィンは+5される', () => {
    const t = task({ id: 'a', importance: 'low', estimateMin: 10, dueAt: null });
    expect(priorityScore(t, now)).toBe(10 + 5);
  });
});

describe('priorityScore のタイムゾーン（回帰）', () => {
  // JST の朝は UTC ではまだ前日。ここを UTC 暦日で判定すると、
  // 今日締切のタスクが「明日」に化けて優先順位が下がる。
  const now = '2026-08-24T23:30:00Z'; // = 2026-08-25 08:30 JST
  const dueToday = '2026-08-25T14:00:00Z'; // = 2026-08-25 23:00 JST（JSTでは今日中）
  const task: SchedulableTask = {
    id: 't', title: '今日締切', estimateMin: 60,
    importance: 'mid', dueAt: dueToday, status: 'todo',
  };

  it('Asia/Tokyo では「今日中」として加点される', () => {
    const tokyo = priorityScore(task, now, 'Asia/Tokyo');
    const utc = priorityScore(task, now, 'UTC');
    expect(tokyo).toBeGreaterThan(utc);
  });

  it('JSTの同じ暦日なら、UTCで日付をまたいでいても同じ扱いになる', () => {
    const morning = priorityScore(task, '2026-08-24T23:30:00Z', 'Asia/Tokyo'); // 08-25 08:30 JST
    const noon = priorityScore(task, '2026-08-25T03:00:00Z', 'Asia/Tokyo');    // 08-25 12:00 JST
    expect(morning).toBe(noon);
  });

  it('planDay の結果はタイムゾーンで変わる（UTCだと勝者が入れ替わる）', () => {
    // A: 重要度high + 3日以内(+15) = 45。UTCでもJSTでも 45 のまま動かない
    const a: SchedulableTask = {
      id: 'a', title: '3日以内', estimateMin: 60,
      importance: 'high', dueAt: '2026-08-27T14:00:00Z', status: 'todo',
    };
    // B: 重要度low。JSTなら今日中(+40)で 50、UTCだと明日(+25)で 35 にしかならない
    const b: SchedulableTask = { ...task, id: 'b', importance: 'low' };

    const base = {
      now, day: '2026-08-25',
      workdayStart: '09:00', workdayEnd: '10:00', // 60分＝1件しか入らない
      busy: [], tasks: [a, b],
    };

    expect(planDay({ ...base, timezone: 'Asia/Tokyo' }).slots[0].taskId).toBe('b');
    expect(planDay({ ...base, timezone: 'UTC' }).slots[0].taskId).toBe('a');
  });
});
