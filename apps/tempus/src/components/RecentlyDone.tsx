import { useState } from 'react';
import { fmtTime } from '../lib/dates';
import type { Task } from '../types/domain';

const fmtDay = (iso: string, tz: string) =>
  new Intl.DateTimeFormat('ja-JP', { timeZone: tz, month: 'numeric', day: 'numeric' }).format(new Date(iso));

/**
 * 最近完了したタスク。チェックを押し間違えると一覧から消えてしまうので、
 * ここから「未完了に戻す」で復活できるようにする。普段は畳んでおく。
 */
export function RecentlyDone({
  tasks, tz, onReopen,
}: {
  tasks: Task[];
  tz: string;
  onReopen: (task: Task) => void;
}) {
  const [open, setOpen] = useState(false);
  if (tasks.length === 0) return null;
  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>完了したタスク</h2>
        <span className="spacer" />
        <button className="btn" onClick={() => setOpen((v) => !v)}>
          {open ? '閉じる' : `最近の${tasks.length}件を見る`}
        </button>
      </div>
      {open && (
        <>
          <div className="detail-meta" style={{ margin: '8px 0' }}>
            押し間違えて完了にしたものは「未完了に戻す」で元に戻せる。
          </div>
          <ul className="done-list">
            {tasks.map((t) => (
              <li key={t.id} className="row" style={{ padding: '6px 0', borderTop: '1px solid var(--outline-variant)' }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  {t.title}
                  {t.completedAt && (
                    <span className="detail-meta" style={{ marginLeft: 8 }}>
                      {fmtDay(t.completedAt, tz)} {fmtTime(t.completedAt, tz)} 完了
                    </span>
                  )}
                </span>
                <button className="btn tonal" onClick={() => onReopen(t)}>未完了に戻す</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
