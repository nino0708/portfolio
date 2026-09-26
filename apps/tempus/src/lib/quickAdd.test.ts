import { describe, expect, it } from 'vitest';
import { expandQuickAdd } from '../../supabase/functions/_shared/quickAdd';

describe('expandQuickAdd', () => {
  it('title と notes だけでタスク1件にする', () => {
    expect(expandQuickAdd({ title: ' 記事を読む ', notes: 'https://a.jp' }))
      .toEqual({ agent: 'iPhone共有', tasks: [{ title: '記事を読む', notes: 'https://a.jp' }] });
  });
  it('notes が空なら付けない', () => {
    expect(expandQuickAdd({ title: '牛乳', notes: '' })).toEqual({ agent: 'iPhone共有', tasks: [{ title: '牛乳' }] });
  });
  it('通常の形式はそのまま', () => {
    const body = { agent: '編集部', tasks: [{ title: 'x' }] };
    expect(expandQuickAdd(body)).toBe(body);
  });
  it('title が無ければそのまま（通常の検証に任せる）', () => {
    const body = { notes: 'だけ' };
    expect(expandQuickAdd(body)).toBe(body);
  });
});
