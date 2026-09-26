import type { Clip } from '../types/domain';

/** 貼る文字列。URLが本文に含まれていなければ末尾に足す */
export function clipPostText(clip: Pick<Clip, 'text' | 'url'>): string {
  return clip.url && !clip.text.includes(clip.url) ? `${clip.text}\n${clip.url}` : clip.text;
}

/**
 * X の投稿画面を本文入りで開くURL。iPhone では X アプリが入っていればアプリで開く。
 * コピー→Xを開く→貼る、の3手を1タップにするためのもの。
 */
export function xIntentUrl(clip: Pick<Clip, 'text' | 'url'>): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(clipPostText(clip))}`;
}
