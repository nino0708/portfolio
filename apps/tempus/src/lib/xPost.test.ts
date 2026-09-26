import { describe, expect, it } from 'vitest';
import { clipPostText, xIntentUrl } from './xPost';

describe('clipPostText', () => {
  it('URLが本文に無ければ末尾に足す', () => {
    expect(clipPostText({ text: '新着', url: 'https://a.jp/x' })).toBe('新着\nhttps://a.jp/x');
  });
  it('URLが本文に含まれていれば二重にしない', () => {
    expect(clipPostText({ text: '新着 https://a.jp/x', url: 'https://a.jp/x' })).toBe('新着 https://a.jp/x');
  });
  it('URLが無ければ本文だけ', () => {
    expect(clipPostText({ text: '本文', url: null })).toBe('本文');
  });
});

describe('xIntentUrl', () => {
  it('本文をエンコードして投稿画面のURLにする', () => {
    const u = xIntentUrl({ text: '東京の建築 #BuiltJapan & more', url: 'https://builtjapan.com/a?b=1' });
    expect(u.startsWith('https://x.com/intent/post?text=')).toBe(true);
    expect(decodeURIComponent(u.split('text=')[1])).toBe('東京の建築 #BuiltJapan & more\nhttps://builtjapan.com/a?b=1');
  });
});
