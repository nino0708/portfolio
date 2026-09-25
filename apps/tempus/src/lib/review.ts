import { supabase } from './supabase';

/**
 * Claude の見立てを使うか。既定は無効（無料で運用する前提）。
 * 使うなら .env.local に VITE_CLAUDE_REVIEW=1 を足し、
 * Supabase 側に ANTHROPIC_API_KEY を設定する。
 */
export const CLAUDE_REVIEW_ENABLED = import.meta.env.VITE_CLAUDE_REVIEW === '1';

export type ReviewKind = 'overload' | 'order' | 'grouping' | 'deadline' | 'ok';
export interface ReviewNote { kind: ReviewKind; text: string }

/**
 * その日の講評を取りに行く。
 * 講評が出ないだけで時間割の機能は止めたくないので、失敗しても throw せず空を返す。
 */
export async function fetchPlanReview(
  day: string, opts: { force?: boolean } = {},
): Promise<{ notes: ReviewNote[]; model: string | null; cached: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('plan-review', {
      body: { day, force: opts.force === true },
    });
    if (error) return { notes: [], model: null, cached: false, error: error.message };
    return {
      notes: Array.isArray(data?.notes) ? (data.notes as ReviewNote[]) : [],
      model: (data?.model as string) ?? null,
      cached: data?.cached === true,
      error: data?.ok === false ? (data?.note ?? '講評を取得できなかった') : null,
    };
  } catch (e) {
    return { notes: [], model: null, cached: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * 今日ぶんの講評を、既にあれば読むだけ（APIを叩かない）。
 * 毎朝7時のcronが書いた行もここで拾う。
 *
 * model も一緒に読む。これが 'deterministic' なら計算で出した見立てで、Claudeは
 * 使っていない。取らずに「保存済みの行がある＝Claude」と扱うと、無料運用のままなのに
 * 「Claude の見立て」と表示されてしまう。
 */
export async function loadCachedReview(
  day: string,
): Promise<{ notes: ReviewNote[]; model: string | null }> {
  const { data } = await supabase
    .from('plan_reviews').select('notes, model').eq('for_date', day).maybeSingle();
  return {
    notes: Array.isArray(data?.notes) ? (data.notes as ReviewNote[]) : [],
    model: (data?.model as string) ?? null,
  };
}

/** 見立ての出どころ。Claudeを使った時だけ 'Claude' と名乗る */
export function reviewSourceLabel(model: string | null, fromCache: boolean): string {
  if (model === null) return '計算による見立て（無料）';
  if (model === 'deterministic') {
    return fromCache ? '計算による見立て（無料・毎朝7時に作成）' : '計算による見立て（無料）';
  }
  return `Claude の見立て（${model}）`;
}

export const KIND_LABEL: Record<ReviewKind, string> = {
  overload: '詰めすぎ',
  order:    '順番',
  grouping: 'まとめ',
  deadline: '期限',
  ok:       '所見',
};
