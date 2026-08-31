import { describe, expect, it } from 'vitest';
import { groupByTaskId, needsConfirmation, rowToTask } from './tasks';

describe('groupByTaskId', () => {
  it('task_id ごとに束ね、元の並び順を保つ', () => {
    const items = [
      { taskId: 'a', label: '1' },
      { taskId: 'b', label: '2' },
      { taskId: 'a', label: '3' },
    ];
    const grouped = groupByTaskId(items);
    expect(grouped.get('a')?.map((i) => i.label)).toEqual(['1', '3']);
    expect(grouped.get('b')?.map((i) => i.label)).toEqual(['2']);
  });

  // 紐付いていないクリップを '' や 'null' のキーで拾うと、無関係のタスクの詳細に出てしまう
  it('taskId が null の物は落とす', () => {
    const grouped = groupByTaskId([{ taskId: null, label: '単独' }]);
    expect(grouped.size).toBe(0);
  });

  it('空配列でも落ちない', () => {
    expect(groupByTaskId([]).size).toBe(0);
  });
});

describe('needsConfirmation', () => {
  it('見積もりの3倍を超えたら確認する', () => {
    expect(needsConfirmation(300, 30)).toBe(true);
    expect(needsConfirmation(60, 30)).toBe(false);
  });
});

describe('rowToTask', () => {
  const baseRow = {
    id: 't1', project_id: null, owner_id: 'u1', title: 'テスト', notes: null,
    status: 'todo', importance: 'mid', due_at: null,
    scheduled_start: null, scheduled_end: null,
    estimate_min: 30, estimate_is_inferred: true, actual_min: null,
    started_at: null, completed_at: null, source: 'app',
    created_at: '2026-08-20T00:00:00Z', updated_at: '2026-08-20T00:00:00Z',
  };

  it('window_start をそのまま windowStart に写す', () => {
    expect(rowToTask({ ...baseRow, window_start: '2026-08-25' }).windowStart).toBe('2026-08-25');
  });

  it('window_start が無ければ null になる', () => {
    expect(rowToTask(baseRow).windowStart).toBeNull();
  });
});
