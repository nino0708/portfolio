import { supabase } from './supabase';
import type { Verification } from '../types/domain';

type Row = Record<string, unknown>;

function rowToVerification(r: Row): Verification {
  return {
    id: r.id as string,
    ownerId: r.owner_id as string,
    hypothesis: r.hypothesis as string,
    result: (r.result as string) ?? null,
    nextAction: (r.next_action as string) ?? null,
    category: (r.category as string) ?? null,
    createdAt: r.created_at as string,
  };
}

/** 新しい順の一覧。当日カウンターはこの中から作成日で絞って呼び出し側が数える。 */
export async function listVerifications(limit = 200): Promise<Verification[]> {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(rowToVerification);
}

export async function createVerification(input: {
  hypothesis: string;
  result?: string | null;
  nextAction?: string | null;
  category?: string | null;
}): Promise<Verification> {
  const { data, error } = await supabase
    .from('verifications')
    .insert({
      hypothesis: input.hypothesis,
      result: input.result ?? null,
      next_action: input.nextAction ?? null,
      category: input.category ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToVerification(data);
}

/** 検証直後は空でもよい result/next_action を後から埋める・直す。 */
export async function updateVerification(id: string, patch: {
  result?: string | null;
  nextAction?: string | null;
  category?: string | null;
}): Promise<void> {
  const payload: Row = {};
  if ('result' in patch) payload.result = patch.result;
  if ('nextAction' in patch) payload.next_action = patch.nextAction;
  if ('category' in patch) payload.category = patch.category;
  const { error } = await supabase.from('verifications').update(payload).eq('id', id);
  if (error) throw error;
}
