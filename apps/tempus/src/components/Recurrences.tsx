import { useState } from 'react';
import { describeRule, isValidRule, type Recurrence } from '../lib/recurrence';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];

type Preset = 'daily' | 'weekdays' | 'weekly' | 'monthly';

/**
 * 「毎日やっている作業」の登録。X投稿のような定期作業を毎回手で書くのは
 * 起票コストそのものなので、ルールだけ登録して自動で起こす。
 */
export function Recurrences({
  items, onCreate, onToggle, onDelete, busy,
}: {
  items: Recurrence[];
  onCreate: (v: { title: string; rule: string; estimateMin: number; checklist: string[] }) => void;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [preset, setPreset] = useState<Preset>('daily');
  const [dows, setDows] = useState<number[]>([1]);
  const [dom, setDom] = useState(1);
  const [estimate, setEstimate] = useState(15);
  const [checklist, setChecklist] = useState('');

  const rule =
    preset === 'daily' ? 'daily'
    : preset === 'weekdays' ? 'weekdays'
    : preset === 'weekly' ? `weekly:${[...dows].sort().join(',')}`
    : `monthly:${dom}`;

  const canSubmit = title.trim().length > 0 && isValidRule(rule) && !busy;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({
      title: title.trim(),
      rule,
      estimateMin: estimate,
      checklist: checklist.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setTitle('');
    setChecklist('');
    setOpen(false);
  };

  return (
    <div>
      {items.length === 0 && !open && (
        <div className="empty">定期作業はまだ無い</div>
      )}

      {items.map((r) => (
        <div key={r.id} className="task-row">
          <input
            type="checkbox"
            checked={r.active}
            onChange={() => onToggle(r.id, !r.active)}
            aria-label={`${r.title} を有効/停止`}
            title={r.active ? '有効（毎日この作業が起票される）' : '停止中'}
          />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className={`task-title ${r.active ? '' : 'done'}`}>{r.title}</span>
            <div className="slot-meta">
              {describeRule(r.rule)} ／ {r.estimateMin}分
              {r.checklist.length > 0 && ` ／ 手順${r.checklist.length}件`}
            </div>
          </span>
          <button className="badge" onClick={() => onDelete(r.id)} title="削除">削除</button>
        </div>
      ))}

      {!open ? (
        <button className="btn tonal" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
          定期作業を追加
        </button>
      ) : (
        <div className="rec-form">
          <input
            className="rec-title"
            value={title}
            placeholder="作業の名前（例: X投稿 Built Japan 朝）"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          />

          <div className="seg" style={{ marginTop: 10 }}>
            {([['daily', '毎日'], ['weekdays', '平日'], ['weekly', '曜日'], ['monthly', '毎月']] as const)
              .map(([v, label]) => (
                <button key={v} className={preset === v ? 'on' : ''} onClick={() => setPreset(v)}>
                  {label}
                </button>
              ))}
          </div>

          {preset === 'weekly' && (
            <div className="row" style={{ marginTop: 10 }}>
              {DOW.map((n, i) => (
                <button
                  key={n}
                  className={`badge ${dows.includes(i) ? 'line' : ''}`}
                  onClick={() => setDows((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {preset === 'monthly' && (
            <div className="row" style={{ marginTop: 10 }}>
              <label className="slot-meta">毎月</label>
              <input
                type="number" min={1} max={31} value={dom}
                onChange={(e) => setDom(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                style={{ width: 64 }}
              />
              <span className="slot-meta">日（31日が無い月は月末に寄る）</span>
            </div>
          )}

          <div className="row" style={{ marginTop: 10 }}>
            <label className="slot-meta">見積もり</label>
            <input
              type="number" min={5} step={5} value={estimate}
              onChange={(e) => setEstimate(Math.max(1, Number(e.target.value) || 15))}
              style={{ width: 72 }}
            />
            <span className="slot-meta">分</span>
          </div>

          <textarea
            className="rec-checklist"
            value={checklist}
            placeholder="手順（1行1つ・任意）&#10;例:&#10;記事URLをコピー&#10;文案を確認&#10;Xに投稿"
            rows={4}
            onChange={(e) => setChecklist(e.target.value)}
          />

          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn filled" onClick={submit} disabled={!canSubmit}>
              追加（{describeRule(rule)}）
            </button>
            <button className="btn" onClick={() => setOpen(false)}>やめる</button>
          </div>
        </div>
      )}
    </div>
  );
}
