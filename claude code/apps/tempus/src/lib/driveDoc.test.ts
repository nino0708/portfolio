import { describe, it, expect } from 'vitest';
import {
  completionText, docHtml, docTitle, folderName, ymdInTz, INBOX_FOLDER_NAME,
} from '../../supabase/functions/_shared/driveDoc';

const base = {
  title: 'LPの構成を決める', notes: null, status: 'todo', dueAt: null, windowStart: null,
  actualMin: null, completedAt: null, createdAt: '2026-09-22T16:30:00Z',
};

describe('ymdInTz', () => {
  it('UTCでは前日でも、東京の日付で出す', () => {
    expect(ymdInTz('2026-09-22T16:30:00Z', 'Asia/Tokyo')).toBe('2026-09-23');
  });
});

describe('docTitle', () => {
  it('起票日（東京）_タイトル の形にする', () => {
    expect(docTitle(base, 'Asia/Tokyo')).toBe('2026-09-23_LPの構成を決める');
  });

  it('改行や連続した空白は1つの空白にまとめる', () => {
    expect(docTitle({ ...base, title: ' A\n  B ' }, 'Asia/Tokyo')).toBe('2026-09-23_A B');
  });

  it('空のタイトルは (無題) にする', () => {
    expect(docTitle({ ...base, title: '  ' }, 'Asia/Tokyo')).toBe('2026-09-23_(無題)');
  });

  it('長すぎるタイトルは切って … を付ける', () => {
    const t = docTitle({ ...base, title: 'あ'.repeat(200) }, 'Asia/Tokyo');
    expect(t.endsWith('…')).toBe(true);
    expect(t.length).toBe('2026-09-23_'.length + 120 + 1);
  });
});

describe('folderName', () => {
  it('プロジェクト名をそのまま使う', () => {
    expect(folderName('Built Japan')).toBe('Built Japan');
  });

  it('プロジェクトが無ければ受信箱', () => {
    expect(folderName(null)).toBe(INBOX_FOLDER_NAME);
    expect(folderName('  ')).toBe(INBOX_FOLDER_NAME);
  });
});

describe('docHtml', () => {
  it('思考ログの見出しを全部入れる', () => {
    const html = docHtml(base, 'Built Japan', 'Asia/Tokyo');
    for (const h of ['背景・目的', '考えたこと（日付ごとに追記）', '検討した選択肢と判断', '結果・振り返り']) {
      expect(html).toContain(`<h2>${h}</h2>`);
    }
    expect(html).toContain('プロジェクト: Built Japan');
  });

  it('タイトルやメモのHTMLは文字として書く', () => {
    const html = docHtml({ ...base, title: '<b>x</b>', notes: 'a & b\nc' }, null, 'Asia/Tokyo');
    expect(html).toContain('<h1>&lt;b&gt;x&lt;/b&gt;</h1>');
    expect(html).toContain('a &amp; b<br>c');
    expect(html).toContain(`プロジェクト: ${INBOX_FOLDER_NAME}`);
  });

  it('既に完了しているタスクは完了の記録も書く', () => {
    const html = docHtml(
      { ...base, status: 'done', completedAt: '2026-09-23T03:00:00Z', actualMin: 45 }, null, 'Asia/Tokyo',
    );
    expect(html).toContain('■ 2026-09-23 に完了（実績 45分）');
  });

  it('未完了なら完了の記録は書かない', () => {
    expect(docHtml(base, null, 'Asia/Tokyo')).not.toContain('に完了');
  });
});

describe('completionText', () => {
  it('実績が無ければ時間は書かない', () => {
    expect(completionText({ completedAt: '2026-09-23T03:00:00Z', actualMin: null }, 'Asia/Tokyo'))
      .toBe('\n■ 2026-09-23 に完了\n');
  });
});
