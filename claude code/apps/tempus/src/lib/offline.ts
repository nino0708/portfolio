import { createTask } from './tasks';

// 圏外でも起票だけは絶対に止めない。ローカルに貯めて復帰時に送る。
const KEY = 'tempus:pending_captures';

export interface PendingCapture {
  localId: string;
  title: string;
  createdAt: string;
  attempts?: number;
  lastError?: string;
}

export interface FlushResult {
  sent: number;
  failed: number;
  lastError: string | null;
}

/**
 * 通信できなかったのか、サーバーに拒否されたのかを見分ける。
 *
 * ここを区別しないと、サーバーが拒否しているのに「オフラインです」と表示して
 * キューに溜め続けることになる。実際にそれをやって、owner_id の不備で保存が
 * 全部失敗しているのに画面上は正常に見える、という事故を起こした。
 */
export function isOfflineError(e: unknown): boolean {
  if (!navigator.onLine) return true;
  const msg = e instanceof Error ? e.message : String(e);
  return /Failed to fetch|NetworkError|network request failed|Load failed/i.test(msg);
}

export function pending(): PendingCapture[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as PendingCapture[];
  } catch {
    return [];
  }
}

function write(list: PendingCapture[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function enqueue(title: string): PendingCapture {
  const item: PendingCapture = {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    createdAt: new Date().toISOString(),
  };
  write([...pending(), item]);
  return item;
}

/**
 * 送れたものだけキューから消す。
 * サーバーに拒否され続けるものは残るが、その理由を持ち帰って画面に出す
 * （黙って溜め続けない）。
 */
export async function flush(): Promise<FlushResult> {
  const list = pending();
  if (list.length === 0) return { sent: 0, failed: 0, lastError: null };

  const remaining: PendingCapture[] = [];
  let sent = 0;
  let lastError: string | null = null;

  for (const item of list) {
    try {
      await createTask(item.title, 'app');
      sent++;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      remaining.push({ ...item, attempts: (item.attempts ?? 0) + 1, lastError });
      if (isOfflineError(e)) break;   // 通信が死んでいるなら残りを試すだけ無駄
    }
  }
  write(remaining);
  return { sent, failed: remaining.length, lastError };
}

/** 送れないまま溜まったものを捨てる（画面から明示的に呼ぶ） */
export function discardAll(): void {
  localStorage.removeItem(KEY);
}

export function onReconnect(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener('online', handler);
  return () => window.removeEventListener('online', handler);
}
