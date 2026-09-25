import type { RefObject } from 'react';
import { fmtTime, minutesOfDayInTz } from '../lib/dates';
import {
  GRID_END_MIN, GRID_HEIGHT_PX, GRID_START_MIN, minutesToY,
} from '../lib/timelineGrid';
import type { CalendarEvent, Task } from '../types/domain';

const HOURS = Array.from(
  { length: GRID_END_MIN / 60 - GRID_START_MIN / 60 + 1 },
  (_, i) => GRID_START_MIN / 60 + i,
);

/**
 * 「今日の時間割」。6:00〜24:00・15分刻みのグリッドを常に描く（予定が無くても）。
 * ドラッグ&ドロップの受け皿・リサイズ・外すボタンはApp側の状態と座標計算に依存するため、
 * このコンポーネントは「見せる」役に徹し、操作のハンドラは props で受け取るだけにする。
 */
export function Timeline({
  events,
  tasks,
  tz,
  gridRef,
  resizing,
  onStart,
  onFinish,
  onUnschedule,
  onResizeStart,
}: {
  events: CalendarEvent[];
  tasks: Task[];
  tz: string;
  gridRef: RefObject<HTMLDivElement>;
  resizing: { taskId: string; previewEndMin: number } | null;
  onStart: (t: Task) => void;
  onFinish: (t: Task) => void;
  onUnschedule: (t: Task) => void;
  onResizeStart: (t: Task, e: React.PointerEvent) => void;
}) {
  const allDay = events.filter((e) => e.isAllDay);
  const timedEvents = events.filter((e) => !e.isAllDay);
  const scheduled = tasks.filter((t) => t.scheduledStart && t.scheduledEnd);
  const minutesOfDay = (iso: string): number => minutesOfDayInTz(iso, tz);

  return (
    <div>
      {allDay.map((e) => (
        <div key={e.id} className="slot event" style={{ marginBottom: 6 }}>
          <span className="slot-time">終日</span>
          <span className="slot-title">{e.title}</span>
          <span />
        </div>
      ))}

      <div className="timeline-scroll" ref={gridRef}>
        <div className="timeline-grid" style={{ height: GRID_HEIGHT_PX }}>
          {HOURS.map((h) => (
            <div key={h} className="timeline-hour" style={{ top: minutesToY(h * 60) }}>
              <span className="timeline-hour-label">{String(h).padStart(2, '0')}:00</span>
              <span className="timeline-hour-line" />
            </div>
          ))}

          {timedEvents.map((e) => {
            const start = Math.max(GRID_START_MIN, minutesOfDay(e.startAt));
            const end = Math.min(GRID_END_MIN, minutesOfDay(e.endAt));
            if (end <= start) return null;
            return (
              <div
                key={e.id}
                className="timeline-block event"
                style={{ top: minutesToY(start), height: minutesToY(end) - minutesToY(start) }}
              >
                <span className="slot-title">{e.title}</span>
                <span className="slot-time">{fmtTime(e.startAt, tz)}〜{fmtTime(e.endAt, tz)}</span>
              </div>
            );
          })}

          {scheduled.map((t) => {
            const start = Math.max(GRID_START_MIN, minutesOfDay(t.scheduledStart!));
            const isResizing = resizing?.taskId === t.id;
            const endMin = isResizing ? resizing.previewEndMin : minutesOfDay(t.scheduledEnd!);
            const end = Math.min(GRID_END_MIN, endMin);
            if (end <= start) return null;
            return (
              <div
                key={t.id}
                className={`timeline-block task ${t.status === 'done' ? 'done' : ''}`}
                style={{ top: minutesToY(start), height: minutesToY(end) - minutesToY(start) }}
              >
                <div className="timeline-block-head">
                  <span className="slot-title">{t.title}</span>
                  <button
                    className="timeline-remove"
                    title="時間割から外す"
                    onClick={() => onUnschedule(t)}
                  >
                    ×
                  </button>
                </div>
                <span className="slot-time">
                  {minutesToHHMMLocal(start)}〜{minutesToHHMMLocal(end)}
                  {t.startedAt && ' ・計測中'}
                </span>
                {t.status === 'done' ? (
                  <span className="badge">完了</span>
                ) : t.startedAt ? (
                  <button className="btn tonal" onClick={() => onFinish(t)}>終了</button>
                ) : (
                  <button className="btn" onClick={() => onStart(t)}>開始</button>
                )}
                <div
                  className="timeline-resize-handle"
                  onPointerDown={(e) => onResizeStart(t, e)}
                  title="ドラッグで長さを調整"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function minutesToHHMMLocal(min: number): string {
  const hh = String(Math.floor(min / 60)).padStart(2, '0');
  const mm = String(min % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}
