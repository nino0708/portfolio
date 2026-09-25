import { ClipBlock } from './TaskDetail';
import type { Clip } from '../types/domain';

/**
 * どのタスクにも紐付いていない投稿文案。
 *
 * ルーティンが taskDedupeKey を付けずに送ってきた分はここに落ちる。
 * 拾う場所を作っておかないと、届いているのに画面のどこにも出ない状態に戻る。
 */
export function LooseClips({
  clips, onMarkPosted,
}: {
  clips: Clip[];
  onMarkPosted: (clip: Clip, posted: boolean) => void;
}) {
  if (clips.length === 0) return null;

  return (
    <div className="card">
      <h2>貼るだけの文案</h2>
      <p className="slot-meta" style={{ marginBottom: 12 }}>
        タスクに紐付いていない分。投稿したら押しておくと消える。
      </p>
      {clips.map((clip) => (
        <ClipBlock key={clip.id} clip={clip} onMarkPosted={onMarkPosted} />
      ))}
    </div>
  );
}
