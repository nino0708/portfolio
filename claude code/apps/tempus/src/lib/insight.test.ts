import { describe, it, expect } from 'vitest';
import { buildInsights, freeMinutes, type InsightTask, type InsightInput } from '../../supabase/functions/_shared/insight';

const TZ = 'Asia/Tokyo';
const DAY = '2026-08-26';
// JST の各時刻を ISO で作る
const at = (h: number, m = 0, day = 26) => new Date(Date.UTC(2026, 7, day, h - 9, m)).toISOString();

const task = (o: Partial<InsightTask> & { id: string; title: string }): InsightTask => ({
  estimateMin: 30, importance: 'mid', dueAt: null, status: 'todo',
  scheduledStart: null, scheduledEnd: null, ...o,
});

const base = (o: Partial<InsightInput> = {}): InsightInput => ({
  now: at(9), day: DAY, timezone: TZ,
  workdayStart: '09:00', workdayEnd: '22:00',
  busy: [], tasks: [], ...o,
});

describe('freeMinutes', () => {
  it('予定が無ければ稼働時間ぶん空いている', () => {
    expect(freeMinutes(base())).toBe(13 * 60);
  });

  it('予定のぶんだけ減る', () => {
    expect(freeMinutes(base({ busy: [{ start: at(10), end: at(11) }] }))).toBe(12 * 60);
  });

  it('重なった予定を二重に引かない', () => {
    const f = freeMinutes(base({
      busy: [{ start: at(10), end: at(12) }, { start: at(11), end: at(13) }],
    }));
    expect(f).toBe(10 * 60); // 10-13時の3時間ぶんだけ引かれる
  });

  it('今より前の時間は数えない', () => {
    expect(freeMinutes(base({ now: at(18) }))).toBe(4 * 60);
  });

  it('稼働時間が終わっていたら0', () => {
    expect(freeMinutes(base({ now: at(23) }))).toBe(0);
  });

  it('稼働時間の外にある予定は影響しない', () => {
    expect(freeMinutes(base({ busy: [{ start: at(6), end: at(8) }] }))).toBe(13 * 60);
  });
});

describe('buildInsights', () => {
  it('タスクが無ければ空だと言う', () => {
    const n = buildInsights(base());
    expect(n).toHaveLength(1);
    expect(n[0].kind).toBe('ok');
    expect(n[0].text).toContain('空');
  });

  it('着手期限を過ぎたタスクを名指しする', () => {
    // 600分 = 4日必要。期限が明後日なら着手期限は昨日
    const n = buildInsights(base({
      tasks: [task({ id: 't1', title: 'RDS移行の設計書', estimateMin: 600, dueAt: at(18, 0, 28) })],
    }));
    const d = n.find((x) => x.kind === 'deadline');
    expect(d).toBeDefined();
    expect(d!.text).toContain('RDS移行の設計書');
    expect(d!.text).toContain('着手期限');
  });

  it('着手期限切れが複数なら件数で言う', () => {
    const n = buildInsights(base({
      tasks: [
        task({ id: 'a', title: 'A', estimateMin: 600, dueAt: at(18, 0, 28) }),
        task({ id: 'b', title: 'B', estimateMin: 600, dueAt: at(18, 0, 28) }),
      ],
    }));
    expect(n.find((x) => x.kind === 'deadline')!.text).toContain('2件');
  });

  it('今日着手しないと間に合わないものを拾う', () => {
    // 600分 = 4日必要。期限が3日後なら着手期限は今日
    const n = buildInsights(base({
      tasks: [task({ id: 't', title: '月刊AWS 9月号', estimateMin: 600, dueAt: at(18, 0, 29) })],
    }));
    expect(n.find((x) => x.kind === 'deadline')!.text).toContain('今日始めないと');
  });

  it('総量が空きを超えたら、超過ぶんを時間で言う', () => {
    const n = buildInsights(base({
      now: at(19), // 空きは3時間
      tasks: [
        task({ id: 'a', title: 'A', estimateMin: 240 }),
        task({ id: 'b', title: 'B', estimateMin: 240 }),
      ],
    }));
    const o = n.find((x) => x.kind === 'overload');
    expect(o).toBeDefined();
    expect(o!.text).toContain('時間ぶんは今日は入らない');
  });

  it('予定で埋まっていたら、その旨だけ言う', () => {
    const n = buildInsights(base({
      busy: [{ start: at(9), end: at(22) }],
      tasks: [task({ id: 'a', title: 'A' })],
    }));
    expect(n.find((x) => x.kind === 'overload')!.text).toContain('空きが無い');
  });

  it('余裕があるなら詰め込みすぎとは言わない', () => {
    const n = buildInsights(base({ tasks: [task({ id: 'a', title: 'A', estimateMin: 30 })] }));
    expect(n.map((x) => x.kind)).not.toContain('overload');
  });

  it('計測しっぱなしのタスクを指摘する', () => {
    const n = buildInsights(base({
      tasks: [task({ id: 'a', title: '監視設定の見直し', status: 'doing' })],
    }));
    const o = n.find((x) => x.kind === 'order')!;
    expect(o.text).toContain('計測中');
    expect(o.text).toContain('監視設定の見直し');
  });

  it('計測中が無ければ「最初にやるなら」を出す', () => {
    const n = buildInsights(base({
      tasks: [
        task({ id: 'a', title: '低いやつ', importance: 'low', estimateMin: 60 }),
        task({ id: 'b', title: '高いやつ', importance: 'high', estimateMin: 60 }),
      ],
    }));
    expect(n.find((x) => x.kind === 'order')!.text).toContain('高いやつ');
  });

  it('短いタスクが3件以上あればまとめを勧める', () => {
    const n = buildInsights(base({
      tasks: [
        task({ id: 'a', title: 'A', estimateMin: 10 }),
        task({ id: 'b', title: 'B', estimateMin: 15 }),
        task({ id: 'c', title: 'C', estimateMin: 5 }),
      ],
    }));
    const g = n.find((x) => x.kind === 'grouping')!;
    expect(g.text).toContain('3件');
    expect(g.text).toContain('30分');
  });

  it('短いタスクが2件ならまとめは勧めない', () => {
    const n = buildInsights(base({
      tasks: [task({ id: 'a', title: 'A', estimateMin: 10 }), task({ id: 'b', title: 'B', estimateMin: 10 })],
    }));
    expect(n.map((x) => x.kind)).not.toContain('grouping');
  });

  it('完了済みは数に入れない', () => {
    const n = buildInsights(base({
      tasks: [
        task({ id: 'a', title: 'A', estimateMin: 10, status: 'done' }),
        task({ id: 'b', title: 'B', estimateMin: 10, status: 'done' }),
        task({ id: 'c', title: 'C', estimateMin: 10, status: 'done' }),
      ],
    }));
    expect(n).toHaveLength(1);
    expect(n[0].kind).toBe('ok');
  });

  it('長いタイトルは切り詰める', () => {
    const n = buildInsights(base({
      tasks: [task({ id: 'a', title: 'あ'.repeat(50), status: 'doing' })],
    }));
    expect(n.find((x) => x.kind === 'order')!.text).toContain('…');
  });

  it('指摘は最大5件', () => {
    const n = buildInsights(base({
      now: at(20),
      tasks: [
        task({ id: 'a', title: 'A', estimateMin: 600, dueAt: at(18, 0, 25) }),
        task({ id: 'b', title: 'B', estimateMin: 600, dueAt: at(18, 0, 29) }),
        task({ id: 'c', title: 'C', estimateMin: 10, status: 'doing' }),
        task({ id: 'd', title: 'D', estimateMin: 10 }),
        task({ id: 'e', title: 'E', estimateMin: 10 }),
        task({ id: 'f', title: 'F', estimateMin: 10 }),
      ],
    }));
    expect(n.length).toBeLessThanOrEqual(5);
  });

  it('JSTの朝（UTCでは前日）でも期限の判定がずれない', () => {
    // 2026-08-26 08:00 JST = 2026-08-25 23:00 UTC
    const n = buildInsights(base({
      now: '2026-08-25T23:00:00Z',
      tasks: [task({ id: 't', title: '今日締切', estimateMin: 600, dueAt: at(18, 0, 29) })],
    }));
    expect(n.find((x) => x.kind === 'deadline')!.text).toContain('今日始めないと');
  });
});
