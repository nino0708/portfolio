/**
 * 表示確認用のハーネス。Supabase に繋がずに UI 部品だけを描く。
 * 本番のバンドルには入らない（demo.html は build の入力にしていない）。
 */
import type { RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import { Timeline } from './components/Timeline';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { Recurrences } from './components/Recurrences';
import { Review } from './components/Review';
import { CaptureBar } from './components/CaptureBar';
import { LooseClips } from './components/LooseClips';
import { groupByTaskId } from './lib/tasks';
import type { CalendarEvent, ChecklistItem, Clip, Task } from './types/domain';
import './styles.css';

const TZ = 'Asia/Tokyo';
const iso = (h: number, m = 0) => new Date(Date.UTC(2026, 7, 26, h - 9, m)).toISOString();

const task = (id: string, title: string, o: Partial<Task> = {}): Task => ({
  id, projectId: null, ownerId: 'me', title, notes: null,
  status: 'todo', importance: 'mid', dueAt: null,
  scheduledStart: null, scheduledEnd: null, windowStart: null,
  estimateMin: 30, estimateIsInferred: true, actualMin: null,
  startedAt: null, completedAt: null, source: 'app',
  createdAt: iso(8), updatedAt: iso(8), ...o,
});

const events: CalendarEvent[] = [
  { id: 'e1', ownerId: 'me', googleEventId: 'g1', calendarId: 'primary',
    title: '定例ミーティング', startAt: iso(10), endAt: iso(11), isAllDay: false, syncedAt: iso(8) },
  { id: 'e2', ownerId: 'me', googleEventId: 'g2', calendarId: 'primary',
    title: '健康診断', startAt: iso(0), endAt: iso(24), isAllDay: true, syncedAt: iso(8) },
];

const dayTasks: Task[] = [
  task('t1', 'CloudFormation の差分レビュー', {
    scheduledStart: iso(9), scheduledEnd: iso(9, 45), estimateMin: 45, estimateIsInferred: false }),
  task('t2', '監視設定の見直し（案件1）', {
    scheduledStart: iso(11, 10), scheduledEnd: iso(12), estimateMin: 50, startedAt: iso(11, 10) }),
];

const openTasks: Task[] = [
  task('t3', 'RDSバックアップのRTO/RPOを整理', { importance: 'high', estimateMin: 60, dueAt: iso(18) }),
  task('t4', '英語のマイルストーンを決める', { estimateMin: 30, source: 'line' }),
  task('t5', 'ゴミ袋を買う', { importance: 'low', estimateMin: 10, estimateIsInferred: false }),
  task('t6', 'CCNAの学習環境を選ぶ', { estimateMin: 90, source: 'line' }),
  task('t7', '月刊AWS 9月号を書く', { estimateMin: 600, dueAt: iso(18 + 24 * 3), importance: 'high' }),
  task('t8', 'RDS移行の設計書', { estimateMin: 900, dueAt: iso(18 + 24 * 2) }),
  task('t9', 'X投稿（Built Japan 朝）', { estimateMin: 10, source: 'template', estimateIsInferred: false }),
  task('t10', 'Friday商事 X投稿', {
    estimateMin: 10, source: 'routine', estimateIsInferred: false,
    notes: '仕入れリサーチ部の朝レポートから、反応が取れそうな1本を選んで投稿する。',
  }),
];

const checklistItems: ChecklistItem[] = [
  { id: 'c1', taskId: 't9', label: '記事URLをコピー', done: true, position: 0 },
  { id: 'c2', taskId: 't9', label: '文案を確認', done: false, position: 1 },
  { id: 'c3', taskId: 't9', label: 'Xに投稿', done: false, position: 2 },
];

const clips: Clip[] = [
  {
    id: 'k1', ownerId: 'me', taskId: 't10', label: 'Friday商事 朝の投稿', kind: 'x_post',
    text: 'せどりで一番効くのは「安く買う」より「売れる棚を持つ」こと。\n'
      + '在庫が寝ている間はキャッシュも寝ている。\n\n'
      + '今週の回転率トップ3を貼っておきます。\n#せどり #物販',
    url: 'https://example.com/friday/weekly', postedAt: null, createdAt: iso(7),
  },
  {
    id: 'k2', ownerId: 'me', taskId: null, label: 'Built Japan 夕方の投稿', kind: 'x_post',
    text: '虎ノ門ヒルズ ステーションタワー、地下から屋上まで「歩ける塔」として作られている話。\n'
      + 'https://builtjapan.com/buildings/toranomon-hills-station-tower/',
    url: 'https://builtjapan.com/buildings/toranomon-hills-station-tower/',
    postedAt: null, createdAt: iso(7),
  },
];

// トップレベルの静的ハーネスなので useRef は使えない。Timeline は .current を読み書きするだけなので、
// 実際のDOMには繋がらないダミーの ref オブジェクトで足りる。
const demoGridRef: RefObject<HTMLDivElement> = { current: null };

createRoot(document.getElementById('root')!).render(
  <>
    <div className="bg-decor" aria-hidden="true" />
    <div className="app">
    <div className="hero">
      <h1>2026-08-25</h1>
      <p>二瀬樹</p>
      <div className="hero-stats">
        <div className="hero-stat"><b>4</b><span>未完了</span></div>
        <div className="hero-stat"><b>1</b><span>今日完了</span></div>
        <div className="hero-stat"><b>1.6h</b><span>予定済み</span></div>
      </div>
    </div>
    <div className="banner warn">
      カレンダーの接続が切れている（再読み込みでGoogleのトークンが消えるため）。
      <button className="btn" style={{ marginLeft: 8 }}>つなぎ直す</button>
    </div>
    <div className="card">
      <h2>今日の時間割</h2>
      <Timeline
        events={events} tasks={dayTasks} tz={TZ}
        gridRef={demoGridRef} resizing={null}
        onStart={() => {}} onFinish={() => {}}
        onUnschedule={() => {}} onResizeStart={() => {}}
      />
    </div>
    <div className="card">
      <h2>カレンダー</h2>
      <CalendarView events={events} tasks={[...dayTasks, ...openTasks]} today="2026-08-26" tz={TZ} />
    </div>

    <div className="card">
      <h2>今日の見立て</h2>
      <Review
        notes={[
          { kind: 'overload', text: '今日は合計6時間。予定を引くと2時間しか空きが無い' },
          { kind: 'deadline', text: 'RDS移行の設計書は着手期限を過ぎている。今日やるなら最優先' },
          { kind: 'grouping', text: 'CloudFormationと監視設定は似た作業。続けて置くと切り替えが減る' },
        ]}
        savedNotes={[]} savedModel={null} savedFromCache={false} claudeAvailable={false}
        loading={false} error={null} onAsk={() => {}}
      />
    </div>

    <div className="card">
      <h2>やること（優先順）</h2>
      <TaskList tasks={openTasks} now={iso(13)} timezone={TZ} today="2026-08-25"
        busy={[{ start: iso(10), end: iso(11) }, { start: iso(19), end: iso(20) }]}
        checklistByTask={groupByTaskId(checklistItems)}
        clipsByTask={groupByTaskId(clips)}
        onToggleChecklist={() => {}} onMarkPosted={() => {}}
        onFinishNow={() => {}} onEstimate={() => {}} onDragHandleDown={() => {}}
        onScheduleIso={() => {}} onChangeWindow={() => {}} />
    </div>

    <LooseClips clips={clips.filter((c) => c.taskId === null)} onMarkPosted={() => {}} />

    <div className="card">
      <h2>毎日やる作業</h2>
      <Recurrences
        items={[
          { id: 'r1', title: 'X投稿（Built Japan 朝）', rule: 'daily', estimateMin: 10, active: true,
            checklist: ['記事URLをコピー', '文案を確認', 'Xに投稿'], timeOfDay: '08:00' },
          { id: 'r2', title: '週次レビュー', rule: 'weekly:0', estimateMin: 45, active: true,
            checklist: [], timeOfDay: null },
          { id: 'r3', title: '小口現金の締め', rule: 'monthly:31', estimateMin: 30, active: false,
            checklist: [], timeOfDay: null },
        ]}
        busy={false}
        onCreate={() => {}} onToggle={() => {}} onDelete={() => {}}
      />
    </div>

    <CaptureBar onSubmit={async () => {}} offlineCount={2} />
    </div>
  </>,
);
