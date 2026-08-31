// Tempus 共有コントラクト — DB / アルゴリズム / Edge Function / UI が全部これに従う。
// ここを変える時は必ず全体に波及させること。

export type TaskStatus = 'todo' | 'doing' | 'done' | 'behind';
export type Importance = 'low' | 'mid' | 'high';
export type TaskSource = 'app' | 'line' | 'shortcut' | 'template' | 'routine';
export type MemberRole = 'owner' | 'editor' | 'viewer';

export interface Profile {
  id: string;                 // = auth.users.id
  displayName: string | null;
  lineUserId: string | null;  // LINE起票の突合キー
  timezone: string;           // 既定 'Asia/Tokyo'
  workdayStart: string;       // 'HH:MM' 既定 '09:00'
  workdayEnd: string;         // 'HH:MM' 既定 '22:00'
  createdAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  color: string;              // hex
  archivedAt: string | null;
  createdAt: string;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: MemberRole;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string | null;   // null = 受信箱（未仕分け）
  ownerId: string;
  title: string;              // 唯一の必須項目
  notes: string | null;
  status: TaskStatus;
  importance: Importance;     // 既定 'mid'
  dueAt: string | null;       // 期限
  scheduledStart: string | null;  // 承認された時間ブロック
  scheduledEnd: string | null;
  windowStart: string | null;     // 着手可能日 'YYYY-MM-DD'。null = 未設定
  estimateMin: number;            // 既定 30
  estimateIsInferred: boolean;    // true = 推定値（UIでバッジ表示）
  actualMin: number | null;
  startedAt: string | null;       // 実績計測の開始時刻。裏でタイマーは回さない
  completedAt: string | null;
  source: TaskSource;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  label: string;
  done: boolean;
  position: number;
}

/**
 * 外部エージェント（クラウドルーティン）が送ってくる「貼るだけ」テキスト。
 * taskId が付いていれば、そのタスクの詳細を開いた時に本文が出る。
 */
export interface Clip {
  id: string;
  ownerId: string;
  taskId: string | null;   // null = どのタスクにも紐付いていない
  label: string;
  text: string;
  url: string | null;
  kind: string;            // 既定 'x_post'
  postedAt: string | null; // 人が「投稿した」を押した時刻
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  ownerId: string;
  startedAt: string;
  endedAt: string;
  minutes: number;
  wasConfirmed: boolean;   // 止め忘れ疑いで人が確認・修正したか
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  ownerId: string;
  googleEventId: string;
  calendarId: string;
  title: string;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  syncedAt: string;
}

// ---- スケジュール自動提案（純関数）のコントラクト ----

export interface BusyBlock {
  start: string;  // ISO8601
  end: string;
}

export interface SchedulableTask {
  id: string;
  title: string;
  estimateMin: number;
  importance: Importance;
  dueAt: string | null;
  status: TaskStatus;
}

export interface PlanInput {
  now: string;                 // ISO8601。これより前には置かない
  day: string;                 // 'YYYY-MM-DD'（対象日）
  timezone: string;            // 'Asia/Tokyo'
  workdayStart: string;        // 'HH:MM'
  workdayEnd: string;          // 'HH:MM'
  busy: BusyBlock[];           // Googleカレンダーの予定＋承認済みブロック
  tasks: SchedulableTask[];
  minSlotMin?: number;         // 既定 15。これ未満の隙間は使わない
  breakMin?: number;           // 既定 5。ブロック間に空ける
}

export interface PlannedSlot {
  taskId: string;
  start: string;
  end: string;
  score: number;               // 採用時の優先スコア
}

export type UnplacedReason = 'no_room' | 'too_large' | 'done' | 'past_due_window';

export interface PlanResult {
  slots: PlannedSlot[];
  unplaced: { taskId: string; reason: UnplacedReason }[];
}
