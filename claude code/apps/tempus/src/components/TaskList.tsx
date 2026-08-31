import { useState } from 'react';
import { leadTime, leadTimeLabel, urgencyRank } from '../lib/leadtime';
import { findSlotCandidates } from '../lib/slotCandidates';
import { fmtTime } from '../lib/dates';
import { TaskDetail } from './TaskDetail';
import type { BusyBlock, ChecklistItem, Clip, Task } from '../types/domain';

/**
 * 期限だけ見ていると「まだ3日ある」と思ったまま詰む。
 * 見積もりと期限から着手期限を逆算して、手遅れになる前に前へ出す。
 *
 * 行は開ける。メモ・手順・投稿文案（ルーティンが送ってきた本文）は詳細の中に置き、
 * 一覧そのものは1行1タスクのまま保つ。
 */
export function TaskList({
  tasks,
  now,
  timezone,
  today,
  busy,
  checklistByTask,
  clipsByTask,
  onFinishNow,
  onEstimate,
  onToggleChecklist,
  onMarkPosted,
  onDragHandleDown,
  onScheduleIso,
  onChangeWindow,
}: {
  tasks: Task[];
  now: string;
  timezone: string;
  /** 今日の日付 'YYYY-MM-DD'。候補ボタンの表示条件と候補算出に使う */
  today: string;
  /** 今日のカレンダー予定＋確定済みの時間ブロック。候補算出のbusyとして使う */
  busy: BusyBlock[];
  checklistByTask: Map<string, ChecklistItem[]>;
  clipsByTask: Map<string, Clip[]>;
  onFinishNow: (t: Task) => void;
  onEstimate: (t: Task, min: number) => void;
  onToggleChecklist: (item: ChecklistItem) => void;
  onMarkPosted: (clip: Clip, posted: boolean) => void;
  /** ハンドルを掴んだ瞬間に発火。今日の時間割へドラッグして配置できるようにする */
  onDragHandleDown: (t: Task, e: React.PointerEvent) => void;
  /** 候補パネルで時間を選んだ時に発火。ドラッグ&ドロップ配置と同じ結果になる */
  onScheduleIso: (t: Task, startIso: string, endIso: string) => void;
  onChangeWindow: (t: Task, windowStart: string | null, dueDate: string | null) => void;
}) {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setOpened((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const togglePicker = (id: string) => setPickerOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  if (tasks.length === 0) return <div className="empty">タスクは空。気持ちいい</div>;

  return (
    <div>
      {tasks.map((t) => {
        const lead = leadTime({
          estimateMin: t.estimateMin, dueAt: t.dueAt, now, timezone,
        });
        const note = leadTimeLabel(lead);
        const hard = urgencyRank(lead.urgency) >= urgencyRank('impossible');
        const checklist = checklistByTask.get(t.id) ?? [];
        const clips = clipsByTask.get(t.id) ?? [];
        const hasDetail = Boolean(t.notes) || checklist.length > 0 || clips.length > 0;
        const isOpen = opened.has(t.id);
        // 期間未設定なら常に対象。設定済みなら今日がその範囲に入っている時だけ候補を出す
        const inWindow = !t.windowStart
          || (t.windowStart <= today && (!t.dueAt || today <= t.dueAt.slice(0, 10)));
        const isPickerOpen = pickerOpen.has(t.id);

        return (
          <div key={t.id} className="task-item">
            <div className="task-row">
              <span
                className="task-drag-handle"
                title="ドラッグして今日の時間割に置く"
                aria-label={`${t.title} を時間割に置く`}
                onPointerDown={(e) => onDragHandleDown(t, e)}
              >
                ⠿
              </span>
              {inWindow && (
                <button
                  className="badge"
                  title="今日の空き時間の候補を出す"
                  aria-expanded={isPickerOpen}
                  aria-label={`${t.title} を置く候補を出す`}
                  onClick={() => togglePicker(t.id)}
                >
                  候補
                </button>
              )}
              <input
                type="checkbox"
                checked={t.status === 'done'}
                onChange={() => onFinishNow(t)}
                aria-label={`${t.title} を完了`}
              />
              <button
                className="task-open"
                aria-expanded={isOpen}
                onClick={() => toggle(t.id)}
              >
                <span className={`task-title ${t.status === 'done' ? 'done' : ''}`}>{t.title}</span>
                {note && <div className={`lead-note ${hard ? 'hard' : ''}`}>{note}</div>}
              </button>
              {note && <span className={`badge lead ${hard ? 'hard' : ''}`}>
                {lead.urgency === 'overdue' ? '期限切れ'
                  : lead.urgency === 'impossible' ? '間に合わない'
                  : lead.urgency === 'today' ? '今日着手'
                  : `あと${lead.daysUntilStart}日`}
              </span>}
              {t.importance === 'high' && <span className="badge high">高</span>}
              {t.source === 'line' && <span className="badge line">LINE</span>}
              {t.source === 'template' && <span className="badge">定期</span>}
              {t.source === 'routine' && <span className="badge">部署</span>}
              <button
                className={`badge ${t.estimateIsInferred ? 'inferred' : ''}`}
                title={t.estimateIsInferred ? '推定値。押すと直せる' : '見積もり'}
                onClick={() => {
                  const v = window.prompt('見積もり（分）', String(t.estimateMin));
                  const n = Number(v);
                  if (Number.isFinite(n) && n > 0) onEstimate(t, Math.round(n));
                }}
              >
                {t.estimateMin}分{t.estimateIsInferred ? '?' : ''}
              </button>
              {/* タイトル側でも開けるが、印が無いと開けることに気づけない。
                  幅が最優先なので文字は入れず、中身がある行だけ色を付ける */}
              <button
                className={`badge disclose ${hasDetail ? 'has' : ''}`}
                aria-expanded={isOpen}
                aria-label={`${t.title} の詳細`}
                title={hasDetail ? '詳細（メモ・手順・投稿文）' : '詳細'}
                onClick={() => toggle(t.id)}
              >
                {isOpen ? '▲' : '▼'}
              </button>
            </div>
            {isPickerOpen && (
              <SlotPickerPanel
                task={t}
                today={today}
                timezone={timezone}
                busy={busy}
                onPick={(startIso, endIso) => {
                  onScheduleIso(t, startIso, endIso);
                  togglePicker(t.id);
                }}
              />
            )}
            {isOpen && (
              <TaskDetail
                task={t}
                checklist={checklist}
                clips={clips}
                tz={timezone}
                onToggleChecklist={onToggleChecklist}
                onMarkPosted={onMarkPosted}
                today={today}
                onChangeWindow={onChangeWindow}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SlotPickerPanel({
  task, today, timezone, busy, onPick,
}: {
  task: Task;
  today: string;
  timezone: string;
  busy: BusyBlock[];
  onPick: (startIso: string, endIso: string) => void;
}) {
  const dayStartIso = new Date(`${today}T00:00:00`).toISOString();
  const dayEndIso = new Date(`${today}T23:59:59`).toISOString();
  const candidates = findSlotCandidates({
    dayStartIso, dayEndIso, busy, estimateMin: task.estimateMin,
  });

  return (
    <div className="task-slot-candidates">
      {candidates.length === 0 && <div className="detail-empty">今日は空きがない</div>}
      {candidates.map((c) => (
        <button
          key={c.startIso}
          className="btn tonal"
          onClick={() => onPick(c.startIso, c.endIso)}
        >
          {fmtTime(c.startIso, timezone)}〜{fmtTime(c.endIso, timezone)}
        </button>
      ))}
    </div>
  );
}
