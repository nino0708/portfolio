import { supabase } from './supabase';
import type { ChecklistItem } from '../types/domain';

type Row = Record<string, unknown>;

function rowToItem(r: Row): ChecklistItem {
  return {
    id: r.id as string,
    taskId: r.task_id as string,
    label: r.label as string,
    done: r.done as boolean,
    position: r.position as number,
  };
}

/**
 * 指定したタスクの手順をまとめて引く。行ごとに1回ずつ問い合わせると
 * タスクの数だけリクエストが飛ぶので、開いていない行の分も含めて一度に取る。
 */
export async function listChecklistItems(taskIds: string[]): Promise<ChecklistItem[]> {
  if (taskIds.length === 0) return [];
  const { data, error } = await supabase
    .from('task_checklist_items')
    .select('*')
    .in('task_id', taskIds)
    .order('position');
  if (error) throw error;
  return (data ?? []).map(rowToItem);
}

export async function setChecklistDone(id: string, done: boolean): Promise<void> {
  const { error } = await supabase.from('task_checklist_items').update({ done }).eq('id', id);
  if (error) throw error;
}
