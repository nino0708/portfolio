import { supabase } from './supabase';

export interface DriveSyncResult {
  ok: boolean;
  needsReconnect?: boolean;
  error?: string;
  docsCreated?: number;
  remaining?: number;
}

/**
 * 思考ログのドキュメントを Drive に作る・揃える（drive-sync を呼ぶ）。
 * 1回の呼び出しで作れる数に上限があるので、既存タスクをまとめて取り込む時は
 * 残りが無くなるまで数回呼ぶ。取りこぼしは cron が拾う。
 */
export async function syncDrive(maxRounds = 6): Promise<DriveSyncResult> {
  let created = 0;
  for (let round = 0; round < maxRounds; round++) {
    const { data, error } = await supabase.functions.invoke('drive-sync', { body: {} });
    // 2xx 以外は error 側に来る。本文（needsReconnect など）は Response から読み直す
    const res: DriveSyncResult = error
      ? await (error as { context?: Response }).context?.json().catch(() => null)
        ?? { ok: false, error: error.message }
      : data;
    if (!res.ok) return { ...res, docsCreated: created };
    created += res.docsCreated ?? 0;
    if (!res.remaining || !res.docsCreated) return { ...res, docsCreated: created };
  }
  return { ok: true, docsCreated: created };
}

export interface DriveLogResult {
  ok: boolean;
  needsReconnect?: boolean;
  error?: string;
  docUrl?: string | null;
}

/**
 * タスクの思考ログ（「進め方の記録（AIと私）」）に1件書き足す。
 * ドキュメントがまだ無ければ drive-sync がその場で作る。
 */
export async function appendDriveLog(taskId: string, text: string, author = '私'): Promise<DriveLogResult> {
  const { data, error } = await supabase.functions.invoke('drive-sync', {
    body: { action: 'log', task_id: taskId, author, text },
  });
  if (!error) return data as DriveLogResult;
  return await (error as { context?: Response }).context?.json().catch(() => null)
    ?? { ok: false, error: error.message };
}
