import { supabase } from './supabase';
import type { Clip } from '../types/domain';

type Row = Record<string, unknown>;

function rowToClip(r: Row): Clip {
  return {
    id: r.id as string,
    ownerId: r.owner_id as string,
    taskId: (r.task_id as string) ?? null,
    label: r.label as string,
    text: r.text as string,
    url: (r.url as string) ?? null,
    imageUrl: (r.image_url as string) ?? null,
    kind: r.kind as string,
    postedAt: (r.posted_at as string) ?? null,
    createdAt: r.created_at as string,
  };
}

/**
 * 投稿文案の一覧。タスクに紐付いた分と、紐付いていない単独の分の両方を返す。
 * 未投稿を先に見せたいので posted_at の有無で並べ、その中は新しい順。
 */
export async function listClips(limit = 100): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .order('posted_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(rowToClip);
}

/** 「投稿した」の記録。人が押せる唯一の書き込み（RLSもこの列だけ許可している） */
export async function setClipPosted(id: string, posted: boolean): Promise<void> {
  const { error } = await supabase
    .from('clips')
    .update({ posted_at: posted ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}
