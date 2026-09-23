// タスクごとの「思考ログ」ドキュメント（Googleドキュメント）の名前と中身を組み立てる純関数。
//
// Edge Function（Deno）とテスト（vitest）の両方から読むので、外部依存は持たない。
// Drive に置いたドキュメントはタスクを消しても残す前提なので、
// 後から単体で読んでも何のタスクだったか分かるように、作成時点の情報を本文に書き込んでおく。

export const ROOT_FOLDER_NAME = 'Tempus';
export const INBOX_FOLDER_NAME = '受信箱';

const TITLE_MAX = 120;

export interface DocTask {
  title: string;
  notes: string | null;
  status: string;
  dueAt: string | null;
  windowStart: string | null;
  actualMin: number | null;
  completedAt: string | null;
  createdAt: string;
}

/** ISO8601 をタイムゾーン上の 'YYYY-MM-DD' にする */
export function ymdInTz(iso: string, tz: string): string {
  // en-CA は YYYY-MM-DD で出る
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}

/**
 * ドキュメント名。起票日を先頭に付けて、フォルダ内で古い順に並ぶようにする。
 * タイトルを後から直したら、次の同期でこの名前に付け直す。
 */
export function docTitle(task: Pick<DocTask, 'title' | 'createdAt'>, tz: string): string {
  const name = task.title.replace(/\s+/g, ' ').trim() || '(無題)';
  const cut = name.length > TITLE_MAX ? `${name.slice(0, TITLE_MAX)}…` : name;
  return `${ymdInTz(task.createdAt, tz)}_${cut}`;
}

/** プロジェクトのフォルダ名。空の名前は Drive 上で見分けが付かないので埋める */
export function folderName(projectName: string | null): string {
  const n = (projectName ?? '').trim();
  return n || INBOX_FOLDER_NAME;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const nl2br = (s: string): string => escapeHtml(s).replace(/\r?\n/g, '<br>');

/**
 * 作成時の本文（HTML）。Drive にアップロードすると Googleドキュメントに変換される。
 * 見出しは「考えたことを書き残す」ための枠だけ用意し、中身は人が書く。
 */
export function docHtml(task: DocTask, projectName: string | null, tz: string): string {
  const info: string[] = [
    `プロジェクト: ${escapeHtml(folderName(projectName))}`,
    `起票日: ${ymdInTz(task.createdAt, tz)}`,
  ];
  if (task.windowStart) info.push(`着手可能日: ${escapeHtml(task.windowStart)}`);
  if (task.dueAt) info.push(`期限: ${ymdInTz(task.dueAt, tz)}`);

  const parts = [
    '<html><head><meta charset="utf-8"></head><body>',
    `<h1>${escapeHtml(task.title)}</h1>`,
    `<p>${info.join('<br>')}</p>`,
  ];
  if (task.notes) parts.push('<h2>タスクのメモ（起票時点）</h2>', `<p>${nl2br(task.notes)}</p>`);
  parts.push(
    '<h2>背景・目的</h2>', '<p>なぜこのタスクをやるのか。何ができたら終わりか。</p>',
    '<h2>考えたこと（日付ごとに追記）</h2>', `<p>${ymdInTz(task.createdAt, tz)}: </p>`,
    '<h2>検討した選択肢と判断</h2>', '<p>何と何を比べて、なぜそれを選んだか。</p>',
    '<h2>結果・振り返り</h2>', '<p>やってみてどうだったか。次に同じことをやるなら何を変えるか。</p>',
  );
  // 作成時点で既に終わっているタスク（既存タスクの取り込み）は、完了の記録もここで書いてしまう
  if (task.status === 'done') parts.push(`<p>${escapeHtml(completionText(task, tz).trim())}</p>`);
  parts.push('</body></html>');
  return parts.join('\n');
}

/** 完了した時にドキュメント末尾へ追記する一文 */
export function completionText(task: Pick<DocTask, 'completedAt' | 'actualMin'>, tz: string): string {
  const when = task.completedAt ? ymdInTz(task.completedAt, tz) : '日付不明';
  const actual = task.actualMin !== null ? `（実績 ${task.actualMin}分）` : '';
  return `\n■ ${when} に完了${actual}\n`;
}
