import { describe, it, expect } from 'vitest';
import {
  completionText, docHtml, docTitle, folderName, logAuthor, logEntryText, ymdHmInTz, ymdInTz,
  INBOX_FOLDER_NAME, LOG_HEADING,
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

  it('プロジェクトが無ければ その他タスク', () => {
    expect(INBOX_FOLDER_NAME).toBe('その他タスク');
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

  it('進め方の記録の見出しを一番最後の見出しにする（追記は末尾に入るため）', () => {
    const html = docHtml(base, null, 'Asia/Tokyo');
    const last = html.lastIndexOf('<h2>');
    expect(html.slice(last)).toContain(`<h2>${LOG_HEADING}</h2>`);
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

describe('ymdHmInTz', () => {
  it('東京の日付と24時間表記の時刻で出す', () => {
    expect(ymdHmInTz('2026-09-25T09:30:00Z', 'Asia/Tokyo')).toBe('2026-09-25 18:30');
    expect(ymdHmInTz('2026-09-24T15:05:00Z', 'Asia/Tokyo')).toBe('2026-09-25 00:05');
  });
});

describe('logAuthor', () => {
  it('空なら AI', () => {
    expect(logAuthor(undefined)).toBe('AI');
    expect(logAuthor('  ')).toBe('AI');
  });

  it('書き手の名前はそのまま使う', () => {
    expect(logAuthor('私')).toBe('私');
    expect(logAuthor('AI（Built Japan 編集部）')).toBe('AI（Built Japan 編集部）');
  });
});

describe('logEntryText', () => {
  const at = '2026-09-25T09:30:00Z';

  it('[日時] 書き手: 本文 の1行にする', () => {
    expect(logEntryText({ author: 'AI', text: '構成案を3つ出した', at }, 'Asia/Tokyo'))
      .toBe('\n[2026-09-25 18:30] AI: 構成案を3つ出した\n');
  });

  it('複数行は2行目以降を字下げする', () => {
    expect(logEntryText({ author: '私', text: 'A案に決めた\r\n理由: 早い', at }, 'Asia/Tokyo'))
      .toBe('\n[2026-09-25 18:30] 私: A案に決めた\n    理由: 早い\n');
  });

  it('空の本文は書き足さない', () => {
    expect(logEntryText({ text: ' \n ', at }, 'Asia/Tokyo')).toBeNull();
  });

  it('長すぎる本文は切って … を付ける', () => {
    const t = logEntryText({ text: 'あ'.repeat(6000), at }, 'Asia/Tokyo')!;
    expect(t.endsWith('…\n')).toBe(true);
  });
});
