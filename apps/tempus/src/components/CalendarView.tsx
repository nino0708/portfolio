import { useMemo, useState } from 'react';
import {
  weekOf, monthOf, addDays, addMonths, monthLabel, weekLabel, onDay, localDay,
} from '../lib/calendar';
import { fmtTime } from '../lib/dates';
import type { CalendarEvent, Task } from '../types/domain';

type Mode = 'week' | 'month';

/**
 * 予定とタスクを俯瞰する。時間割（今日）だけでは「いつ何があるか」が見えないため。
 * Googleカレンダーと見た目が重複する部分はあるが、こちらは締切と予定ブロックが同じ面に出る。
 */
export function CalendarView({
  events, tasks, today, tz,
}: {
  events: CalendarEvent[];
  tasks: Task[];
  today: string;
  tz: string;
}) {
  const [mode, setMode] = useState<Mode>('week');
  const [anchor, setAnchor] = useState(today);

  const cells = useMemo(
    () => (mode === 'week' ? weekOf(anchor, today) : monthOf(anchor, today)),
    [mode, anchor, today],
  );

  const evItems = useMemo(
    () => events.map((e) => ({ start: e.startAt, end: e.endAt, title: e.title, kind: 'event' as const, allDay: e.isAllDay })),
    [events],
  );
  const blockItems = useMemo(
    () => tasks.filter((t) => t.scheduledStart && t.scheduledEnd)
      .map((t) => ({ start: t.scheduledStart!, end: t.scheduledEnd!, title: t.title, kind: 'task' as const, allDay: false })),
    [tasks],
  );
  // 期限は点なので、開始＝終了として同じ仕組みで日に割り当てる
  const dueItems = useMemo(
    () => tasks.filter((t) => t.dueAt && t.status !== 'done')
      .map((t) => ({ start: t.dueAt!, end: t.dueAt!, title: t.title, kind: 'due' as const, allDay: true })),
    [tasks],
  );
  // 着手可能日〜期限の期間中は、範囲に含まれる日すべてにチップを出す。
  // 「今日どのタスクを進めるか」を週次/月次で判断するための材料なので、範囲全体に出す。
  const windowItems = useMemo(
    () => tasks
      .filter((t) => t.windowStart && t.status !== 'done')
      .map((t) => ({
        start: `${t.windowStart}T00:00:00`,
        end: `${t.dueAt ? t.dueAt.slice(0, 10) : t.windowStart}T23:59:59`,
        title: t.title,
        kind: 'window' as const,
        allDay: true,
      })),
    [tasks],
  );

  const step = (dir: number) =>
    setAnchor(mode === 'week' ? addDays(anchor, 7 * dir) : addMonths(anchor, dir));

  return (
    <div>
      <div className="cal-head">
        <button className="btn" onClick={() => step(-1)} aria-label="前へ">‹</button>
        <strong className="cal-label">
          {mode === 'week' ? weekLabel(cells) : monthLabel(anchor)}
        </strong>
        <button className="btn" onClick={() => step(1)} aria-label="次へ">›</button>
        <span className="spacer" />
        <button className="btn" onClick={() => setAnchor(today)}>今日</button>
        <div className="seg">
          <button className={mode === 'week' ? 'on' : ''} onClick={() => setMode('week')}>週</button>
          <button className={mode === 'month' ? 'on' : ''} onClick={() => setMode('month')}>月</button>
        </div>
      </div>

      <div className={`cal-grid ${mode}`}>
        {['日', '月', '火', '水', '木', '金', '土'].map((n, i) => (
          <div key={n} className={`cal-dow ${i === 0 ? 'sun' : ''} ${i === 6 ? 'sat' : ''}`}>{n}</div>
        ))}

        {cells.map((c) => {
          const evs = onDay(evItems, c.day, tz);
          const blocks = onDay(blockItems, c.day, tz);
          const dues = dueItems.filter((d) => localDay(d.start, tz) === c.day);
          const windows = onDay(windowItems, c.day, tz);
          const items = [...evs, ...blocks, ...windows];

          return (
            <div
              key={c.day}
              className={`cal-cell ${c.inMonth ? '' : 'out'} ${c.isToday ? 'today' : ''}`}
            >
              <div className={`cal-date ${c.dow === 0 ? 'sun' : ''} ${c.dow === 6 ? 'sat' : ''}`}>
                {Number(c.day.split('-')[2])}
                {/* 狭い画面の週表示では1列に積むので、曜日の見出し行が使えない。
                    その時だけこちらを出す。 */}
                <span className="cal-dow-inline">（{'日月火水木金土'[c.dow]}）</span>
              </div>
              {dues.map((d, i) => (
                <div key={`d${i}`} className="cal-item due" title={`期限: ${d.title}`}>
                  期限 {d.title}
                </div>
              ))}
              {items.slice(0, mode === 'week' ? 6 : 3).map((it, i) => (
                <div key={i} className={`cal-item ${it.kind}`} title={it.title}>
                  {!it.allDay && <span className="cal-time">{fmtTime(it.start, tz)}</span>}
                  {it.title}
                </div>
              ))}
              {items.length > (mode === 'week' ? 6 : 3) && (
                <div className="cal-more">＋{items.length - (mode === 'week' ? 6 : 3)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
