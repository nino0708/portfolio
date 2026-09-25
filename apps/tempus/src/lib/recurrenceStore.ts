import { supabase } from './supabase';
import { dueToday, type Recurrence } from './recurrence';
import { rowToTask } from './tasks';
import type { Task } from '../types/domain';

type Row = Record<string, unknown>;

function rowToRecurrence(r: Row): Recurrence {
  return {
    id: r.id as string,
    title: r.title as string,
    rule: r.rule as string,
    estimateMin: r.estimate_min as number,
    active: r.active as boolean,
    checklist: (r.checklist as string[]) ?? [],
    timeOfDay: (r.time_of_day as string) ?? null,
  };
}

export async function listRecurrences(): Promise<Recurrence[]> {
  const { data, error } = await supabase.from('recurrences').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []).map(rowToRecurrence);
}

export async function createRecurrence(input: {
  title: string; rule: string; estimateMin?: number; checklist?: string[]; timeOfDay?: string | null;
}): Promise<void> {
  const { error } = await supabase.from('recurrences').insert({
    title: input.title.trim(),
    rule: input.rule,
    estimate_min: input.estimateMin ?? 30,
    checklist: input.checklist ?? [],
    time_of_day: input.timeOfDay ?? null,
  });
  if (error) throw error;
}

export async function setRecurrenceActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('recurrences').update({ active }).eq('id', id);
  if (error) throw error;
}

export async function deleteRecurrence(id: string): Promise<void> {
  const { error } = await supabase.from('recurrences').delete().eq('id', id);
  if (error) throw error;
}

/**
 * その日の分の繰り返しをタスクとして起こす。アプリを開いた時に毎回呼ぶ。
 *
 * 二重起票の防止は recurrence_runs の unique(recurrence_id, for_date) が担う。
 * 複数タブや複数端末から同時に開いても、DBが後勝ちを弾く。
 * だから「先に runs を取る → 入っていなければ作る」の競合は気にしなくてよい。
 */
export async function materializeForDay(day: string): Promise<Task[]> {
  const [recs, runs] = await Promise.all([
    listRecurrences(),
    supabase.from('recurrence_runs').select('recurrence_id').eq('for_date', day),
  ]);
  const already = new Set((runs.data ?? []).map((r: Row) => r.recurrence_id as string));
  const todo = dueToday(recs, day, already);
  if (todo.length === 0) return [];

  const created: Task[] = [];
  for (const rec of todo) {
    // 先に予約席を取る。ここが弾かれたら他のタブが作った＝何もしない
    const claim = await supabase
      .from('recurrence_runs')
      .insert({ recurrence_id: rec.id, for_date: day })
      .select('id')
      .single();
    if (claim.error) continue;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: rec.title,
        estimate_min: rec.estimateMin,
        estimate_is_inferred: false,   // 繰り返しは自分で決めた値なので推定ではない
        source: 'template',
      })
      .select()
      .single();

    if (error || !task) {
      // タスクが作れなかったら予約も取り消す（明日また試せるように）
      await supabase.from('recurrence_runs').delete().eq('id', claim.data.id);
      continue;
    }

    await supabase.from('recurrence_runs').update({ task_id: task.id }).eq('id', claim.data.id);

    if (rec.checklist.length > 0) {
      await supabase.from('task_checklist_items').insert(
        rec.checklist.map((label, i) => ({ task_id: task.id, label, position: i })),
      );
    }
    created.push(rowToTask(task));
  }
  return created;
}
