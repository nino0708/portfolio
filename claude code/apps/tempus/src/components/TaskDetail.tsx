import { useState } from 'react';
import { fmtTime } from '../lib/dates';
import { appendDriveLog } from '../lib/drive';
import type { ChecklistItem, Clip, Task } from '../types/domain';

const SOURCE_LABEL: Record<Task['source'], string> = {
  app: 'アプリ', line: 'LINE', shortcut: 'ショートカット',
  template: '定期作業', routine: 'ルーティン',
};

/**
 * タスク行を開いた時の中身。
 *
 * X投稿のように「実際に貼る文字列」がある作業は、タイトルだけ見ても何も進まない。
 * 本文をここに置いて、コピーして投稿するところまでを画面の中で終わらせる。
 */
export function TaskDetail({
  task, checklist, clips, tz, today, onToggleChecklist, onMarkPosted, onChangeWindow,
}: {
  task: Task;
  checklist: ChecklistItem[];
  clips: Clip[];
  tz: string;
  /** 今日の日付 'YYYY-MM-DD'。期限切れの赤表示に使う */
  today: string;
  onToggleChecklist: (item: ChecklistItem) => void;
  onMarkPosted: (clip: Clip, posted: boolean) => void;
  /** 着手可能日・期限日を変えた時に呼ぶ。空欄に戻すとその項目はnullになる */
  onChangeWindow: (task: Task, windowStart: string | null, dueDate: string | null) => void;
}) {
  const empty = !task.notes && checklist.length === 0 && clips.length === 0;
  const dueDate = task.dueAt ? task.dueAt.slice(0, 10) : null;
  const overdue = dueDate !== null && dueDate < today && task.status !== 'done';

  return (
    <div className="task-detail">
      <div className="detail-block">
        <div className="detail-label">期間</div>
        <div className="detail-window">
          <label>
            開始
            <input
              type="date"
              value={task.windowStart ?? ''}
              onChange={(e) => onChangeWindow(
                task,
                e.target.value || null,
                dueDate,
              )}
            />
          </label>
          <label className={overdue ? 'overdue' : ''}>
            期限{overdue && '（過ぎている）'}
            <input
              type="date"
              className={overdue ? 'overdue' : ''}
              value={dueDate ?? ''}
              onChange={(e) => onChangeWindow(task, task.windowStart, e.target.value || null)}
            />
          </label>
        </div>
      </div>

      {task.notes && (
        <div className="detail-block">
          <div className="detail-label">メモ</div>
          <div className="detail-text">{task.notes}</div>
        </div>
      )}

      {checklist.length > 0 && (
        <div className="detail-block">
          <div className="detail-label">手順（{checklist.filter((c) => c.done).length}/{checklist.length}）</div>
          {checklist.map((item) => (
            <label key={item.id} className="detail-check">
              <input type="checkbox" checked={item.done} onChange={() => onToggleChecklist(item)} />
              <span className={item.done ? 'done' : ''}>{item.label}</span>
            </label>
          ))}
        </div>
      )}

      {clips.map((clip) => (
        <ClipBlock key={clip.id} clip={clip} onMarkPosted={onMarkPosted} />
      ))}

      {empty && <div className="detail-empty">詳細は入っていない</div>}

      {/* 考えたことはタスクの外（Drive）に書き残す。タスクを消してもドキュメントは残る */}
      <div className="row" style={{ marginTop: 8 }}>
        {task.driveDocUrl ? (
          <a className="btn tonal" href={task.driveDocUrl} target="_blank" rel="noreferrer">思考ログを開く</a>
        ) : (
          <span className="detail-meta">思考ログのドキュメントを準備中</span>
        )}
      </div>
      <LogForm taskId={task.id} />

      <div className="detail-meta">
        起票: {SOURCE_LABEL[task.source]}
        {task.dueAt && ` ／ 期限 ${task.dueAt.slice(0, 10)} ${fmtTime(task.dueAt, tz)}`}
        {task.actualMin !== null && ` ／ 実績 ${task.actualMin}分`}
      </div>
    </div>
  );
}

/**
 * 思考ログの「進め方の記録（AIと私）」に、私の分を1行書き足す。
 * AI の分は Claude のセッションやルーティンが drive-sync を直接呼んで書き足す。
 */
function LogForm({ taskId }: { taskId: string }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setResult(null);
    try {
      const r = await appendDriveLog(taskId, text);
      if (r.ok) {
        setText('');
        setResult('思考ログに書き足した');
      } else {
        setResult(r.needsReconnect
          ? '書き足せなかった。ログインし直してDriveの許可を出して'
          : `書き足せなかった: ${r.error ?? '不明なエラー'}`);
      }
    } catch (e) {
      setResult(`書き足せなかった: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="detail-block">
      <div className="detail-label">進め方の記録</div>
      <div className="row">
        <input
          value={text}
          placeholder="やったこと・決めたことを書いて Enter"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) void send(); }}
          disabled={sending}
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={() => void send()} disabled={sending || !text.trim()}>
          {sending ? '送信中…' : '追記'}
        </button>
      </div>
      {result && <div className="detail-meta">{result}</div>}
    </div>
  );
}

export function ClipBlock({
  clip, onMarkPosted,
}: {
  clip: Clip;
  onMarkPosted: (clip: Clip, posted: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // クリップボードAPIは権限や非HTTPSで黙って失敗する。押したのにコピーされて
  // いない状態が一番困るので、失敗したことを画面に出して手で選べる形に倒す。
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clip.text);
      setCopyError(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className={`detail-block clip ${clip.postedAt ? 'posted' : ''}`}>
      <div className="detail-label">
        {clip.label}
        {clip.postedAt && <span className="badge">投稿済み</span>}
      </div>
      <div className="detail-text selectable">{clip.text}</div>
      {/* 投稿文の中にURLが入っているのが普通なので、同じものを2回出さない */}
      {clip.url && !clip.text.includes(clip.url) && (
        <a className="detail-url" href={clip.url} target="_blank" rel="noreferrer">{clip.url}</a>
      )}
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn tonal" onClick={() => void copy()}>
          {copied ? 'コピーした' : '本文をコピー'}
        </button>
        <button className="btn" onClick={() => onMarkPosted(clip, !clip.postedAt)}>
          {clip.postedAt ? '投稿済みを取り消す' : '投稿した'}
        </button>
      </div>
      {copyError && <div className="detail-meta warn">コピーできなかった。本文を長押しして選んで。</div>}
    </div>
  );
}
