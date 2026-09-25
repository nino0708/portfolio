import { useState } from 'react';
import type { Verification } from '../types/domain';

/**
 * 検証ログ。仮説→結果→次アクションを1件ずつ記録する。1日100件を目標にするため
 * 入力は仮説だけで即送信できるようにし、結果・次アクションは後から埋められる。
 * ストリークは出さない（連続日数のプレッシャーを避ける、設計時の合意）。
 */
export function Verifications({
  items, todayCount, onCreate, onUpdate,
}: {
  items: Verification[];
  todayCount: number;
  onCreate: (v: { hypothesis: string; category: string | null }) => void;
  onUpdate: (v: Verification, patch: { result?: string | null; nextAction?: string | null }) => void;
}) {
  const [hypothesis, setHypothesis] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState('');
  const [draftNextAction, setDraftNextAction] = useState('');

  const submit = () => {
    const h = hypothesis.trim();
    if (!h) return;
    onCreate({ hypothesis: h, category: category.trim() || null });
    setHypothesis('');
  };

  const startEdit = (v: Verification) => {
    setEditingId(v.id);
    setDraftResult(v.result ?? '');
    setDraftNextAction(v.nextAction ?? '');
  };

  const saveEdit = (v: Verification) => {
    onUpdate(v, { result: draftResult.trim() || null, nextAction: draftNextAction.trim() || null });
    setEditingId(null);
  };

  return (
    <div>
      <div className="row" style={{ marginBottom: 12, alignItems: 'baseline' }}>
        <span className="slot-meta">今日 {todayCount}/100</span>
      </div>

      <div className="rec-form">
        <input
          className="rec-title"
          value={hypothesis}
          placeholder="仮説・やること（例: 朝会をXより先にやると集中が続く）"
          onChange={(e) => setHypothesis(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
        <div className="row" style={{ marginTop: 10 }}>
          <input
            value={category}
            placeholder="カテゴリ（任意・例: 自分軸）"
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            style={{ flex: 1 }}
          />
          <button className="btn filled" onClick={submit} disabled={!hypothesis.trim()}>記録</button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="empty" style={{ marginTop: 12 }}>まだ検証は無い</div>
      )}

      {items.map((v) => (
        <div key={v.id} className="task-row" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
          <div className="row" style={{ width: '100%' }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="task-title">{v.hypothesis}</span>
              <div className="slot-meta">
                {v.category && `${v.category} ／ `}
                {new Date(v.createdAt).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </span>
            {editingId !== v.id && (
              <button className="badge" onClick={() => startEdit(v)}>
                {v.result || v.nextAction ? '編集' : '結果を書く'}
              </button>
            )}
          </div>

          {editingId === v.id ? (
            <div style={{ width: '100%', marginTop: 8 }}>
              <textarea
                value={draftResult}
                placeholder="結果・気づき"
                rows={2}
                onChange={(e) => setDraftResult(e.target.value)}
                style={{ width: '100%' }}
              />
              <textarea
                value={draftNextAction}
                placeholder="次のアクション（任意）"
                rows={2}
                onChange={(e) => setDraftNextAction(e.target.value)}
                style={{ width: '100%', marginTop: 6 }}
              />
              <div className="row" style={{ marginTop: 6 }}>
                <button className="btn filled" onClick={() => saveEdit(v)}>保存</button>
                <button className="btn" onClick={() => setEditingId(null)}>やめる</button>
              </div>
            </div>
          ) : (
            (v.result || v.nextAction) && (
              <div className="slot-meta" style={{ marginTop: 6 }}>
                {v.result && <div>結果: {v.result}</div>}
                {v.nextAction && <div>次: {v.nextAction}</div>}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
