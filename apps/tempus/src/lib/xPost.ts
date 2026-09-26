import type { Clip } from '../types/domain';

/** 貼る文字列。URLが本文に含まれていなければ末尾に足す */
export function clipPostText(clip: Pick<Clip, 'text' | 'url'>): string {
  return clip.url && !clip.text.includes(clip.url) ? `${clip.text}\n${clip.url}` : clip.text;
}

/**
 * X の投稿画面を本文入りで開くURL（ブラウザ版）。
 * コピー→Xを開く→貼る、の3手を1タップにするためのもの。
 */
export function xIntentUrl(clip: Pick<Clip, 'text' | 'url'>): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(clipPostText(clip))}`;
}

/** X アプリの投稿画面を本文入りで開くURL */
export function xAppUrl(clip: Pick<Clip, 'text' | 'url'>): string {
  return `twitter://post?message=${encodeURIComponent(clipPostText(clip))}`;
}

export type XAccount = 'builtjapan' | 'friday';

/**
 * どのアカウントから投稿する文案か。
 * X の URL では投稿アカウントを指定できないので、開く場所で分ける運用にしている:
 *   Built Japan … ブラウザ版 X（Built Japan でログイン）
 *   Friday商事  … X アプリ（Friday商事でログイン）
 * Built Japan の文案は必ず記事（builtjapan.com）へのリンクを含むので、それで見分ける。
 */
export function xAccountOf(clip: Pick<Clip, 'text' | 'url'>): XAccount {
  return /builtjapan\.com/i.test(clipPostText(clip)) ? 'builtjapan' : 'friday';
}

export function xPostTarget(clip: Pick<Clip, 'text' | 'url'>): { href: string; label: string } {
  return xAccountOf(clip) === 'builtjapan'
    ? { href: xIntentUrl(clip), label: 'Xで投稿（Built Japan）' }
    : { href: xAppUrl(clip), label: 'Xアプリで投稿（Friday商事）' };
}
