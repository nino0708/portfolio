# タスクの着手期間とスロットピッカー Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** タスクに「着手可能日」を持たせ週次/月次ビューに表示し、タスク一覧から「候補」ボタン一発で今日の空き時間に配置できるようにする。

**Architecture:** `Task.windowStart`（date）を新規フィールドとして追加し、既存の `dueAt` と組み合わせて期間として扱う。表示は既存の `CalendarView`/`TaskDetail`/`TaskList` にitem/バッジ/ボタンを足す形で拡張し、配置ロジックは既存の `plan.ts` の busy計算と `App.tsx` の `scheduleTask` をそのまま再利用する。新規モーダル・新規テーブルは作らない。

**Tech Stack:** React + TypeScript（Vite）、Supabase（Postgres + JS client）、Vitest

**Spec:** `docs/superpowers/specs/2026-08-31-task-window-and-slot-picker-design.md`

## Global Constraints

- 必須項目はタイトルだけ、という既存方針を崩さない。`windowStart` は常に任意（null許容）。
- 新規モーダルコンポーネントは作らない。既存の `window.prompt()` の流儀（`TaskList.tsx` の見積もりバッジ）に合わせる。
- Supabase無料枠を意識し、不要なインデックス・カラムは足さない。
- タイムゾーンは常に `profile.timezone`（既定 `Asia/Tokyo`）を経由する。端末のTZに依存させない。

---

### Task 1: ドメイン型・マイグレーション・行変換

**Files:**
- Modify: `src/types/domain.ts:35-54`（`Task` interface）
- Create: `supabase/migrations/0017_task_window_start.sql`
- Modify: `src/lib/tasks.ts:6-27`（`rowToTask`）
- Modify: `src/demo.tsx:23-29`（デモ用 `task()` ファクトリ）
- Test: `src/lib/tasks.test.ts`（新規作成）

**Interfaces:**
- Produces: `Task.windowStart: string | null`（'YYYY-MM-DD'形式の日付文字列、以降のタスクはこのフィールド名で参照する）
- Produces: `rowToTask(r).windowStart` が `r.window_start` から埋まる

- [ ] **Step 1: `Task` 型に `windowStart` を追加**

`src/types/domain.ts` の `Task` interface（44行目 `scheduledEnd` の直後）に追記:

```ts
  scheduledStart: string | null;  // 承認された時間ブロック
  scheduledEnd: string | null;
  windowStart: string | null;     // 着手可能日 'YYYY-MM-DD'。null = 未設定
```

- [ ] **Step 2: マイグレーションを書く**

`supabase/migrations/0017_task_window_start.sql`:

```sql
-- Tempus: タスクに「着手可能日」を追加する。
--
-- これまで tasks には dueAt（終わらせる期限）しかなく、「いつから手を付けていいか」を
-- 表現できなかった。週次・月次で「この期間にやる」を俯瞰できるようにするため、
-- 着手可能日を追加する。dueAt 同様、必須ではない（タイトルだけで起票できる方針を崩さない）。

alter table public.tasks
  add column window_start date;

comment on column public.tasks.window_start is
  '着手可能日。null = 未設定。due_at と組み合わせて「いつからいつまでに終わらせるか」の期間を表す。';
```

- [ ] **Step 3: `rowToTask` に反映**

`src/lib/tasks.ts` の `rowToTask`（10-27行目）、`scheduledEnd` の行の直後に追記:

```ts
    scheduledEnd: (r.scheduled_end as string) ?? null,
    windowStart: (r.window_start as string) ?? null,
```

- [ ] **Step 4: `rowToTask` のユニットテストを書く（失敗させる）**

`src/lib/tasks.test.ts` を新規作成:

```ts
import { describe, it, expect } from 'vitest';
import { rowToTask } from './tasks';

describe('rowToTask', () => {
  it('window_start をそのまま windowStart に写す', () => {
    const row = {
      id: 't1', project_id: null, owner_id: 'u1', title: 'テスト', notes: null,
      status: 'todo', importance: 'mid', due_at: null,
      scheduled_start: null, scheduled_end: null, window_start: '2026-08-25',
      estimate_min: 30, estimate_is_inferred: true, actual_min: null,
      started_at: null, completed_at: null, source: 'app',
      created_at: '2026-08-20T00:00:00Z', updated_at: '2026-08-20T00:00:00Z',
    };
    expect(rowToTask(row).windowStart).toBe('2026-08-25');
  });

  it('window_start が無ければ null になる', () => {
    const row = {
      id: 't1', project_id: null, owner_id: 'u1', title: 'テスト', notes: null,
      status: 'todo', importance: 'mid', due_at: null,
      scheduled_start: null, scheduled_end: null,
      estimate_min: 30, estimate_is_inferred: true, actual_min: null,
      started_at: null, completed_at: null, source: 'app',
      created_at: '2026-08-20T00:00:00Z', updated_at: '2026-08-20T00:00:00Z',
    };
    expect(rowToTask(row).windowStart).toBeNull();
  });
});
```

Run: `npx vitest run src/lib/tasks.test.ts`
Expected: FAIL（`rowToTask` がまだ `window_start` を読んでいない場合は最初のケースが落ちる。Step 3を先に実施済みならここは両方PASSしてよい — その場合はStep 3実施前に一度このテストだけ書いて赤を確認してからStep 3を適用する運用でも可）

- [ ] **Step 5: テストを通す**

Step 3の変更が入っていることを確認し、再実行:

Run: `npx vitest run src/lib/tasks.test.ts`
Expected: PASS（2 tests）

- [ ] **Step 6: `demo.tsx` のファクトリを直す（型エラー解消）**

`src/demo.tsx:25` を修正:

```ts
  status: 'todo', importance: 'mid', dueAt: null, windowStart: null,
```

- [ ] **Step 7: 型チェック**

Run: `npx tsc --noEmit`
Expected: エラーなし

- [ ] **Step 8: Commit**

```bash
git add src/types/domain.ts src/lib/tasks.ts src/lib/tasks.test.ts src/demo.tsx supabase/migrations/0017_task_window_start.sql
git commit -m "feat: タスクに着手可能日(windowStart)を追加"
```

---

### Task 2: `plan.ts` の busy計算をエクスポートし、候補スロット抽出関数を追加

**Files:**
- Modify: `src/lib/plan.ts:156-186`（`mergeBusy`/`subtractBusy` をexport）
- Create: `src/lib/slotCandidates.ts`
- Test: `src/lib/slotCandidates.test.ts`

**Interfaces:**
- Consumes: `plan.ts` の `mergeBusy(blocks: BusyBlock[]): MsRange[]`、`subtractBusy(windowStart: number, windowEnd: number, merged: MsRange[]): MsRange[]`（`MsRange = { start: number; end: number }`、既存の型をexportする）
- Produces: `findSlotCandidates(input: SlotCandidateInput): SlotCandidate[]`
  - `SlotCandidateInput = { dayStartIso: string; dayEndIso: string; busy: BusyBlock[]; estimateMin: number; maxCandidates?: number }`
  - `SlotCandidate = { startIso: string; endIso: string }`

- [ ] **Step 1: `plan.ts` の内部関数と型をexportする**

`src/lib/plan.ts` の156行目・174行目・151行目を修正:

```ts
export interface MsRange {
  start: number;
  end: number;
}

export function mergeBusy(blocks: BusyBlock[]): MsRange[] {
```

```ts
export function subtractBusy(windowStart: number, windowEnd: number, merged: MsRange[]): MsRange[] {
```

（中身は変更しない。`export` を足すだけ）

- [ ] **Step 2: 候補抽出のテストを書く（失敗させる）**

`src/lib/slotCandidates.test.ts` を新規作成:

```ts
import { describe, it, expect } from 'vitest';
import { findSlotCandidates } from './slotCandidates';

describe('findSlotCandidates', () => {
  const day = (h: number, m = 0) => `2026-08-31T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+09:00`;

  it('busyが無ければ日の始まりを1件目の候補にする', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9), dayEndIso: day(22), busy: [], estimateMin: 30,
    });
    expect(result[0]).toEqual({ startIso: day(9), endIso: day(9, 30) });
  });

  it('estimateMinに満たない隙間は候補にしない', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(12),
      busy: [
        { start: day(9), end: day(11, 50) }, // 残り10分しかない
      ],
      estimateMin: 30,
    });
    expect(result).toEqual([]);
  });

  it('maxCandidates件で打ち切る', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(22),
      busy: [
        { start: day(10), end: day(10, 30) },
        { start: day(12), end: day(12, 30) },
        { start: day(14), end: day(14, 30) },
        { start: day(16), end: day(16, 30) },
      ],
      estimateMin: 15,
      maxCandidates: 2,
    });
    expect(result).toHaveLength(2);
  });

  it('隙間0件なら空配列', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(10),
      busy: [{ start: day(9), end: day(10) }],
      estimateMin: 15,
    });
    expect(result).toEqual([]);
  });
});
```

Run: `npx vitest run src/lib/slotCandidates.test.ts`
Expected: FAIL（`slotCandidates.ts` が存在しない）

- [ ] **Step 3: 最小実装**

`src/lib/slotCandidates.ts` を新規作成:

```ts
import { mergeBusy, subtractBusy } from './plan';
import type { BusyBlock } from '../types/domain';

export interface SlotCandidateInput {
  dayStartIso: string;
  dayEndIso: string;
  busy: BusyBlock[];
  estimateMin: number;
  maxCandidates?: number;
}

export interface SlotCandidate {
  startIso: string;
  endIso: string;
}

const DEFAULT_MAX_CANDIDATES = 4;

/**
 * 今日の空きギャップから、estimateMin に収まる候補を先頭からmaxCandidates件返す。
 * 1つの大きなギャップを複数候補に割らない（YAGNI。まずは「置ける場所」を示すだけで十分）。
 */
export function findSlotCandidates(input: SlotCandidateInput): SlotCandidate[] {
  const windowStart = Date.parse(input.dayStartIso);
  const windowEnd = Date.parse(input.dayEndIso);
  const merged = mergeBusy(input.busy);
  const gaps = subtractBusy(windowStart, windowEnd, merged);
  const estimateMs = input.estimateMin * 60 * 1000;
  const max = input.maxCandidates ?? DEFAULT_MAX_CANDIDATES;

  const candidates: SlotCandidate[] = [];
  for (const gap of gaps) {
    if (gap.end - gap.start < estimateMs) continue;
    candidates.push({
      startIso: new Date(gap.start).toISOString(),
      endIso: new Date(gap.start + estimateMs).toISOString(),
    });
    if (candidates.length >= max) break;
  }
  return candidates;
}
```

- [ ] **Step 4: テストを通す**

Run: `npx vitest run src/lib/slotCandidates.test.ts`
Expected: PASS（4 tests）

- [ ] **Step 5: 既存のplanテストが壊れていないか確認**

Run: `npx vitest run src/lib/plan.test.ts`
Expected: PASS（既存件数のまま）

- [ ] **Step 6: Commit**

```bash
git add src/lib/plan.ts src/lib/slotCandidates.ts src/lib/slotCandidates.test.ts
git commit -m "feat: 空き時間から候補スロットを抽出するfindSlotCandidatesを追加"
```

---

### Task 3: 期間バッジ（`TaskDetail`）と候補ボタン+パネル（`TaskList`）のUI実装

**Files:**
- Modify: `src/components/TaskDetail.tsx:16-62`
- Modify: `src/components/TaskList.tsx`
- Modify: `src/App.tsx`（`scheduleTask` の呼び出し経路を`TaskList`に渡す、`onEditWindow` を追加）
- Modify: `src/styles.css`（`.task-slot-candidates` 用のスタイル追記）

**Interfaces:**
- Consumes: `findSlotCandidates`（Task 2で作成）、`App.tsx` の既存 `scheduleTask(task: Task, startMin: number)`（`src/App.tsx` 128行目）は分単位を取るため、`TaskList` からは新しい `onScheduleIso: (task: Task, startIso: string, endIso: string) => void` を親から渡してもらう形にする（`App.tsx` 側に `scheduleTaskIso` を追加）
- Produces: `TaskDetail` props に `onEditWindow: (task: Task) => void` を追加
- Produces: `TaskList` props に `today: string`、`busy: BusyBlock[]`、`onScheduleIso: (task: Task, startIso: string, endIso: string) => void` を追加

- [ ] **Step 1: `App.tsx` に `scheduleTaskIso` と `editWindow` を追加**

`src/App.tsx` の `scheduleTask`（128-137行目）の直後に追記:

```ts
  const scheduleTaskIso = useCallback(async (task: Task, startIso: string, endIso: string) => {
    try {
      await updateTask(task.id, { scheduled_start: startIso, scheduled_end: endIso });
      await reload();
    } catch (e) {
      setNotice(`時間割への配置に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [reload]);

  // 期間（着手可能日〜期限）の編集。既存の見積もり編集(window.prompt)と同じ軽量UI。
  const editWindow = useCallback(async (task: Task) => {
    const startInput = window.prompt(
      '着手可能日（YYYY-MM-DD、空欄で解除）',
      task.windowStart ?? '',
    );
    if (startInput === null) return; // キャンセル
    const dueInput = window.prompt(
      '期限日（YYYY-MM-DD、空欄で解除）',
      task.dueAt ? task.dueAt.slice(0, 10) : '',
    );
    if (dueInput === null) return;

    const isValidDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
    const windowStart = startInput.trim();
    const dueDate = dueInput.trim();

    if (windowStart && !isValidDate(windowStart)) {
      setNotice('着手可能日はYYYY-MM-DD形式で入れて');
      return;
    }
    if (dueDate && !isValidDate(dueDate)) {
      setNotice('期限日はYYYY-MM-DD形式で入れて');
      return;
    }

    try {
      await updateTask(task.id, {
        window_start: windowStart || null,
        due_at: dueDate ? zonedTimeToUtc(dueDate, '23:59', tz).toISOString() : null,
      });
      await reload();
    } catch (e) {
      setNotice(`期間の更新に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [reload, tz]);
```

- [ ] **Step 2: `TaskList` に渡すpropsを追加**

`src/App.tsx` の `<TaskList ... />`（548-562行目）に追記:

```tsx
        <TaskList
          tasks={sortedOpen}
          now={new Date().toISOString()}
          timezone={tz}
          today={day}
          busy={[...toBusyBlocks(events), ...dayTasks.filter((t) => t.scheduledStart && t.scheduledEnd)
            .map((t) => ({ start: t.scheduledStart!, end: t.scheduledEnd! }))]}
          checklistByTask={checklistByTask}
          clipsByTask={clipsByTask}
          onToggleChecklist={(item) => void toggleChecklist(item)}
          onMarkPosted={(clip, posted) => void markPosted(clip, posted)}
          onFinishNow={handleFinish}
          onEstimate={async (t, min) => {
            await updateTask(t.id, { estimate_min: min, estimate_is_inferred: false });
            await reload();
          }}
          onDragHandleDown={beginDrag}
          onScheduleIso={(t, startIso, endIso) => void scheduleTaskIso(t, startIso, endIso)}
          onEditWindow={(t) => void editWindow(t)}
        />
```

（`toBusyBlocks` は既にApp.tsxで `./lib/google` からimport済み。追加importは不要）

- [ ] **Step 3: `TaskDetail` に期間バッジを追加**

`src/components/TaskDetail.tsx` を変更。propsに `onEditWindow` を追加し、`detail-meta` の直前に期間バッジを追加:

```tsx
export function TaskDetail({
  task, checklist, clips, tz, onToggleChecklist, onMarkPosted, onEditWindow,
}: {
  task: Task;
  checklist: ChecklistItem[];
  clips: Clip[];
  tz: string;
  onToggleChecklist: (item: ChecklistItem) => void;
  onMarkPosted: (clip: Clip, posted: boolean) => void;
  onEditWindow: (task: Task) => void;
}) {
```

`detail-meta` の直前（54行目、`{empty && ...}` の直後）に追加:

```tsx
      <button className="btn tonal" onClick={() => onEditWindow(task)}>
        {task.windowStart || task.dueAt
          ? `期間 ${task.windowStart ? task.windowStart.slice(5).replace('-', '/') : '〜'}〜${task.dueAt ? task.dueAt.slice(5, 10).replace('-', '/') : ''}`
          : '期間未設定'}
      </button>
```

- [ ] **Step 4: `TaskList` にpropsを追加し `TaskDetail` に橋渡し**

`src/components/TaskList.tsx` の props型（13-36行目）に追記:

```ts
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
  onEditWindow,
}: {
  tasks: Task[];
  now: string;
  timezone: string;
  today: string;
  busy: BusyBlock[];
  checklistByTask: Map<string, ChecklistItem[]>;
  clipsByTask: Map<string, Clip[]>;
  onFinishNow: (t: Task) => void;
  onEstimate: (t: Task, min: number) => void;
  onToggleChecklist: (item: ChecklistItem) => void;
  onMarkPosted: (clip: Clip, posted: boolean) => void;
  /** ハンドルを掴んだ瞬間に発火。今日の時間割へドラッグして配置できるようにする */
  onDragHandleDown: (t: Task, e: React.PointerEvent) => void;
  onScheduleIso: (t: Task, startIso: string, endIso: string) => void;
  onEditWindow: (t: Task) => void;
}) {
```

`import type { ChecklistItem, Clip, Task } from '../types/domain';`（4行目）を修正:

```ts
import type { BusyBlock, ChecklistItem, Clip, Task } from '../types/domain';
```

`<TaskDetail ... />` の呼び出し（119-128行目）に `onEditWindow={onEditWindow}` を追加。

- [ ] **Step 5: 候補ボタン+パネルを行に追加**

`src/components/TaskList.tsx` に import を追加:

```ts
import { findSlotCandidates } from '../lib/slotCandidates';
import { fmtTime } from '../lib/dates';
```

コンポーネント内、`opened` state（37行目）の直後に候補パネルの開閉stateを追加:

```ts
  const [pickerOpen, setPickerOpen] = useState<Set<string>>(new Set());
  const togglePicker = (id: string) => setPickerOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
```

タスクをmapするループ内（50行目以降）、`isOpen` の直後に期間内判定を追加:

```ts
        const isOpen = opened.has(t.id);
        const inWindow = !t.windowStart
          || (t.windowStart <= today && (!t.dueAt || today <= t.dueAt.slice(0, 10)));
        const isPickerOpen = pickerOpen.has(t.id);
```

`task-row` の中、ドラッグハンドルの直後（71行目、`⠿` の `</span>` の後）に候補ボタンを追加:

```tsx
              {inWindow && (
                <button
                  className="badge"
                  title="今日の空き時間の候補を出す"
                  aria-expanded={isPickerOpen}
                  onClick={() => togglePicker(t.id)}
                >
                  候補
                </button>
              )}
```

`{isOpen && <TaskDetail .../>}`（119-128行目）の直後、`</div>`（129行目、`.task-item`の閉じタグ）の前に候補パネルを追加:

```tsx
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
```

ファイル末尾に候補パネルのサブコンポーネントを追加:

```tsx
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
```

- [ ] **Step 6: CSSを追加**

`src/styles.css` の `.task-open {` ブロック（369行目付近）の直前に追加:

```css
.task-slot-candidates {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 8px 12px 12px;
}
```

- [ ] **Step 7: 型チェック**

Run: `npx tsc --noEmit`
Expected: エラーなし

- [ ] **Step 8: 既存テストが壊れていないか確認**

Run: `npx vitest run`
Expected: PASS（全件）

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/components/TaskDetail.tsx src/components/TaskList.tsx src/styles.css
git commit -m "feat: タスク一覧に候補スロットボタンと期間編集バッジを追加"
```

---

### Task 4: 週次・月次ビューに期間チップを表示

**Files:**
- Modify: `src/components/CalendarView.tsx`
- Modify: `src/styles.css:304-310`

**Interfaces:**
- Consumes: `Task.windowStart`（Task 1）、既存の `onDay`/`localDay`（`src/lib/calendar.ts`）

- [ ] **Step 1: `windowItems` を追加**

`src/components/CalendarView.tsx` の `dueItems`（40-44行目）の直後に追記:

```tsx
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
```

- [ ] **Step 2: `items` に合流させる**

`items` の組み立て（74行目 `const items = [...evs, ...blocks];`）を変更:

```tsx
          const windows = onDay(windowItems, c.day, tz);
          const items = [...evs, ...blocks, ...windows];
```

- [ ] **Step 3: CSSでwindowを区別する**

`src/styles.css` の `.cal-item.due { ... }`（310行目）の直後に追加:

```css
.cal-item.window {
  background: transparent;
  border: 1px dashed color-mix(in srgb, var(--primary) 55%, transparent);
  color: var(--primary);
}
```

- [ ] **Step 4: `onDay` が動くことのテストを書く（既存の`calendar.test.ts`があれば追加、無ければ新規作成して失敗させる）**

`ls src/lib/calendar.test.ts` を確認し、無ければ新規作成、あれば追記する形で以下を追加:

```ts
import { onDay } from './calendar';

describe('onDay（期間アイテム）', () => {
  it('windowStart〜dueAtの範囲に含まれる日はすべて拾う', () => {
    const items = [{ start: '2026-08-25T00:00:00', end: '2026-08-27T23:59:59', title: 'w' }];
    expect(onDay(items, '2026-08-24', 'Asia/Tokyo')).toHaveLength(0);
    expect(onDay(items, '2026-08-25', 'Asia/Tokyo')).toHaveLength(1);
    expect(onDay(items, '2026-08-26', 'Asia/Tokyo')).toHaveLength(1);
    expect(onDay(items, '2026-08-27', 'Asia/Tokyo')).toHaveLength(1);
    expect(onDay(items, '2026-08-28', 'Asia/Tokyo')).toHaveLength(0);
  });
});
```

Run: `npx vitest run src/lib/calendar.test.ts`
Expected: PASS（`onDay` は既存実装のままで満たせるはずのテスト。既存関数のふるまい保証として追加する）

- [ ] **Step 5: 型チェックとビルド確認**

Run: `npx tsc --noEmit && npx vitest run`
Expected: エラーなし・全テストPASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CalendarView.tsx src/styles.css src/lib/calendar.test.ts
git commit -m "feat: 週次/月次ビューに着手期間のチップを表示"
```

---

### Task 5: 実機確認（ヘッドレスChromeスクリーンショット）

**Files:**
- なし（確認のみ、コードは変更しない）

- [ ] **Step 1: ローカルサーバーを起動**

Run: `npm run dev`（別ターミナル、バックグラウンド）

- [ ] **Step 2: タスク一覧の候補ボタンを確認**

`npm test` 用のダミーデータではなく実データで確認する場合はログイン後のトップ画面で、期間内タスクの行に「候補」バッジが出ていること、押すと候補パネルが開くことを確認する。

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=430,932 \
  --virtual-time-budget=4500 --screenshot=/tmp/tempus_tasklist.png "http://localhost:5173/"
```

Read で `/tmp/tempus_tasklist.png` を確認し、候補バッジ・期間バッジが崩れていないか目視する。

- [ ] **Step 3: 週次/月次ビューを確認**

週表示に切り替えたスクリーンショットを撮り、`.cal-item.window`（破線）が期限（赤）・予定・確定タスクと視覚的に区別できているか確認する。

- [ ] **Step 4: 手動での期間編集・候補配置の動作確認**

ブラウザで実際に操作: 期間バッジを押して着手可能日/期限を入力→週次ビューにチップが出るか。候補バッジを押して候補を選ぶ→今日の時間割にブロックが置かれるか（ドラッグ&ドロップで置いた時と同じ見た目になるか）。

- [ ] **Step 5: 問題なければ完了。問題があれば該当Taskに戻って修正しCommit**
