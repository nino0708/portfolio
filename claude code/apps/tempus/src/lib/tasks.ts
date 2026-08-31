import { supabase } from './supabase';
import { dayBoundsUtc, minutesBetween } from './dates';
import type { Task, TaskStatus, Importance, TaskSource } from '../types/domain';

type Row = Record<string, unknown>;

export function rowToTask(r: Row): Task {
  return {
    id: r.id as string,
    projectId: (r.project_id as string) ?? null,
    ownerId: r.owner_id as string,
    title: r.title as string,
    notes: (r.notes as string) ?? null,
    status: r.status as TaskStatus,
    importance: r.importance as Importance,
    dueAt: (r.due_at as string) ?? null,
    scheduledStart: (r.scheduled_start as string) ?? null,
    scheduledEnd: (r.scheduled_end as string) ?? null,
    windowStart: (r.window_start as string) ?? null,
    estimateMin: r.estimate_min as number,
    estimateIsInferred: r.estimate_is_inferred as boolean,
    actualMin: (r.actual_min as number) ?? null,
    startedAt: (r.started_at as string) ?? null,
    completedAt: (r.completed_at as string) ?? null,
    source: r.source as TaskSource,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export async function listOpenTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .neq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []).map(rowToTask);
}

export async function listDayTasks(day: string, tz: string): Promise<Task[]> {
  const { start, end } = dayBoundsUtc(day, tz);
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .not('scheduled_start', 'is', null)
    .lt('scheduled_start', end.toISOString())
    .gt('scheduled_end', start.toISOString())
    .order('scheduled_start');
  if (error) throw error;
  return (data ?? []).map(rowToTask);
}

/**
 * 起票。必須はタイトルだけ。見積もりは過去の実績から推定して仮入れする。
 * 推定であることを estimate_is_inferred で持ち、UIでバッジ表示して後から直せるようにする。
 */
export async function createTask(title: string, source: TaskSource = 'app'): Promise<Task> {
  const clean = title.trim();
  if (!clean) throw new Error('タイトルが空です');
  const estimate = await inferEstimate(clean);
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: clean.slice(0, 200),
      notes: clean.length > 200 ? clean : null,
      source,
      estimate_min: estimate,
      estimate_is_inferred: true,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToTask(data);
}

/**
 * 見積もり推定。過去に似たタイトルで完了した実績の中央値を使う。
 * 実績が無ければ 30 分（仕様の既定値）。凝った学習はしない — 説明できることを優先。
 */
export async function inferEstimate(title: string): Promise<number> {
  const key = title.trim().slice(0, 12);
  if (key.length < 2) return 30;
  const { data } = await supabase
    .from('tasks')
    .select('actual_min')
    .eq('status', 'done')
    .not('actual_min', 'is', null)
    .ilike('title', `%${key}%`)
    .limit(20);
  const vals = (data ?? []).map((r: Row) => r.actual_min as number).filter((n) => n > 0).sort((a, b) => a - b);
  if (vals.length === 0) return 30;
  const mid = vals[Math.floor(vals.length / 2)];
  return Math.max(5, Math.round(mid / 5) * 5);
}

export async function updateTask(id: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('tasks').update(patch).eq('id', id);
  if (error) throw error;
}

export async function startTask(id: string): Promise<void> {
  await updateTask(id, { status: 'doing', started_at: new Date().toISOString() });
}

/**
 * 止め忘れ判定。裏でタイマーは回さず、終了時に開始時刻との差を取るだけなので
 * 寝落ちすると巨大な実績が入る。ここで拾って人に確認させる。
 */
export function needsConfirmation(minutes: number, estimateMin: number): boolean {
  return minutes > Math.max(estimateMin * 3, 240);
}

export async function finishTask(
  task: Task,
  opts: { minutesOverride?: number } = {},
): Promise<{ minutes: number; needsConfirm: boolean }> {
  const endedAt = new Date().toISOString();
  const raw = task.startedAt ? minutesBetween(task.startedAt, endedAt) : 0;
  const minutes = opts.minutesOverride ?? raw;
  const needsConfirm = opts.minutesOverride === undefined && needsConfirmation(raw, task.estimateMin);

  if (needsConfirm) return { minutes: raw, needsConfirm: true };

  await updateTask(task.id, {
    status: 'done',
    completed_at: endedAt,
    actual_min: minutes,
    started_at: null,
  });
  if (task.startedAt) {
    await supabase.from('time_entries').insert({
      task_id: task.id,
      started_at: task.startedAt,
      ended_at: endedAt,
      minutes,
      was_confirmed: opts.minutesOverride !== undefined,
    });
  }
  return { minutes, needsConfirm: false };
}

/**
 * タスクにぶら下がる物（手順・投稿文案）を task_id ごとに束ねる。
 * 一覧を1回だけ引いて行ごとに配り直すための小道具で、紐付いていない物（taskId=null）は落とす。
 */
export function groupByTaskId<T extends { taskId: string | null }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    if (item.taskId === null) continue;
    const bucket = map.get(item.taskId);
    if (bucket) bucket.push(item);
    else map.set(item.taskId, [item]);
  }
  return map;
}

/** 開始しっぱなしのタスク（夜と朝に通知で拾う対象） */
export async function listRunningTasks(): Promise<Task[]> {
  const { data } = await supabase.from('tasks').select('*').not('started_at', 'is', null);
  return (data ?? []).map(rowToTask);
}
