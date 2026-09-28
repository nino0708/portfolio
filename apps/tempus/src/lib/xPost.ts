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
 * どのアカウントから投稿する文案か（ボタンの表示名に使う）。
 * X の URL では投稿アカウントを指定できないので、どちらも X アプリで開き、
 * アプリ側でアカウントを切り替えてから投稿する運用にしている
 * （ブラウザ版は読み込みが遅く時間がかかるため使わない）。
 * Built Japan の文案は必ず記事（builtjapan.com）へのリンクを含むので、それで見分ける。
 */
export function xAccountOf(clip: Pick<Clip, 'text' | 'url'>): XAccount {
  return /builtjapan\.com/i.test(clipPostText(clip)) ? 'builtjapan' : 'friday';
}

export function xPostTarget(clip: Pick<Clip, 'text' | 'url'>): { href: string; label: string } {
  return {
    href: xAppUrl(clip),
    label: xAccountOf(clip) === 'builtjapan' ? 'Xアプリで投稿（Built Japan）' : 'Xアプリで投稿（Friday商事）',
  };
}
