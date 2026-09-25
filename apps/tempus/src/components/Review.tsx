import { KIND_LABEL, reviewSourceLabel, type ReviewNote } from '../lib/review';

/**
 * 今日の見立て。
 *
 * 既定は計算だけで出す（費用ゼロ）。詰め込みすぎ・期限・順番は確定的に導けるので、
 * Claude が要るのは「似た作業をまとめろ」的な意味の判断だけ。
 * Claude を有効にしている場合だけ、そこを上乗せする。
 */
export function Review({
  notes, savedNotes, savedModel, savedFromCache, loading, error, claudeAvailable, onAsk,
}: {
  notes: ReviewNote[];
  savedNotes: ReviewNote[];    // 毎朝7時のcronが保存した分（Claude有効時はClaudeの講評）
  savedModel: string | null;
  savedFromCache: boolean;
  loading: boolean;
  error: string | null;
  claudeAvailable: boolean;
  onAsk: () => void;
}) {
  const useSaved = savedNotes.length > 0;
  const list = useSaved ? savedNotes : notes;

  return (
    <div>
      {list.length === 0 ? (
        <div className="empty">見立てるものがまだ無い</div>
      ) : (
        <div className="review-list">
          {list.map((n, i) => (
            <div key={i} className={`review-item ${n.kind}`}>
              <span className="badge">{KIND_LABEL[n.kind]}</span>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="row" style={{ marginTop: 10 }}>
        <span className="slot-meta">
          {useSaved ? reviewSourceLabel(savedModel, savedFromCache) : '計算による見立て（無料）'}
        </span>
        <span className="spacer" />
        {claudeAvailable && (
          <button className="btn" onClick={onAsk} disabled={loading}>
            {loading ? '聞いている…' : 'Claude にも聞く'}
          </button>
        )}
      </div>
      {error && <div className="lead-note hard" style={{ marginTop: 6 }}>{error}</div>}
    </div>
  );
}
