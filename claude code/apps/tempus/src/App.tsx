import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase, signIn, signOut } from './lib/supabase';
import {
  todayInTz, minutesBetween, zonedTimeToUtc, minutesOfDayInTz,
} from './lib/dates';
import {
  GRID_START_MIN, GRID_END_MIN, MIN_BLOCK_MIN, yToSnappedMinutes, minutesToHHMM,
} from './lib/timelineGrid';
import { syncGoogleDay, loadCachedEvents, toBusyBlocks } from './lib/google';
import {
  listOpenTasks, listDayTasks, createTask, updateTask,
  startTask, finishTask, groupByTaskId,
} from './lib/tasks';
import { listClips, setClipPosted } from './lib/clips';
import { listChecklistItems, setChecklistDone } from './lib/checklist';
import { priorityScore } from './lib/plan';
import * as offline from './lib/offline';
import { fetchPlanReview, loadCachedReview, CLAUDE_REVIEW_ENABLED, type ReviewNote } from './lib/review';
import { buildInsights } from '../supabase/functions/_shared/insight';
import {
  materializeForDay, listRecurrences, createRecurrence,
  setRecurrenceActive, deleteRecurrence,
} from './lib/recurrenceStore';
import { CaptureBar } from './components/CaptureBar';
import { Timeline } from './components/Timeline';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { Recurrences } from './components/Recurrences';
import { Review } from './components/Review';
import { LooseClips } from './components/LooseClips';
import type { CalendarEvent, ChecklistItem, Clip, Profile, Task } from './types/domain';
import type { Recurrence } from './lib/recurrence';

const DEFAULT_PROFILE: Omit<Profile, 'id' | 'createdAt'> = {
  displayName: null, lineUserId: null, timezone: 'Asia/Tokyo',
  workdayStart: '09:00', workdayEnd: '22:00',
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [openTasks, setOpenTasks] = useState<Task[]>([]);
  const [dayTasks, setDayTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calState, setCalState] = useState<'synced' | 'no_token' | 'failed' | 'loading'>('loading');
  const [busy, setBusy] = useState(false);
  const [pendingCount, setPendingCount] = useState(offline.pending().length);
  const [notice, setNotice] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [recurrences, setRecurrences] = useState<Recurrence[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  // 毎朝7時のcronが plan_reviews に保存した見立て。Claude を有効にしていなければ
  // 中身は計算で出したもの（model='deterministic'）で、表示もそう名乗らせる。
  const [review, setReview] = useState<ReviewNote[]>([]);
  const [reviewModel, setReviewModel] = useState<string | null>(null);
  const [reviewFromCache, setReviewFromCache] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // 「やること」からのドラッグと、時間割ブロックの下端リサイズ。
  // どちらもポインタイベントで自前実装（HTML5 DnDはスマホのタッチだと使えないため）。
  const gridRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ task: Task; x: number; y: number; overGrid: boolean } | null>(null);
  const [resizing, setResizing] = useState<{ taskId: string; previewEndMin: number } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const tz = profile?.timezone ?? 'Asia/Tokyo';
  const day = useMemo(() => todayInTz(tz), [tz]);

  const reload = useCallback(async () => {
    if (!session) return;
    const [open, dayT, recs, cl] = await Promise.all([
      listOpenTasks(), listDayTasks(day, tz), listRecurrences().catch(() => [] as Recurrence[]),
      listClips().catch(() => [] as Clip[]),
    ]);
    setOpenTasks(open);
    setDayTasks(dayT);
    setRecurrences(recs);
    setClips(cl);
    // 手順は表示中のタスクの分だけ。行を開くたびに引くとタスクの数だけ往復する
    const ids = [...new Set([...open, ...dayT].map((t) => t.id))];
    setChecklist(await listChecklistItems(ids).catch(() => [] as ChecklistItem[]));
  }, [session, day, tz]);

  // プロフィール（作業時間帯・タイムゾーン）。行が無ければ既定値で動かす
  useEffect(() => {
    if (!session) return;
    void (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      setProfile({
        id: session.user.id,
        createdAt: data?.created_at ?? new Date().toISOString(),
        displayName: data?.display_name ?? session.user.email ?? null,
        lineUserId: data?.line_user_id ?? null,
        timezone: data?.timezone ?? DEFAULT_PROFILE.timezone,
        workdayStart: data?.workday_start ?? DEFAULT_PROFILE.workdayStart,
        workdayEnd: data?.workday_end ?? DEFAULT_PROFILE.workdayEnd,
      });
    })();
  }, [session]);

  useEffect(() => { void reload(); }, [reload]);

  // グリッド上のどこにドロップしたかを判定する。scrollTopを足すのは、
  // グリッド自体が縦スクロールする（6:00〜24:00を全部表示すると長すぎる）ため。
  const dropMinutes = useCallback((clientY: number): number | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const offsetY = clientY - rect.top + el.scrollTop;
    return yToSnappedMinutes(offsetY);
  }, []);

  // 失敗を握りつぶさない。ここで投げると void で捨てられてUIに何も出ないまま
  // 「動かない」ように見える一番タチの悪い状態になる（他の保存処理と同じ方針で必ずバナーに出す）。
  const scheduleTask = useCallback(async (task: Task, startMin: number) => {
    try {
      const endMin = Math.min(GRID_END_MIN, startMin + task.estimateMin);
      const startIso = zonedTimeToUtc(day, minutesToHHMM(startMin), tz).toISOString();
      const endIso = zonedTimeToUtc(day, minutesToHHMM(endMin), tz).toISOString();
      await updateTask(task.id, { scheduled_start: startIso, scheduled_end: endIso });
      await reload();
    } catch (e) {
      setNotice(`時間割への配置に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [day, tz, reload]);

  // 候補ボタンからの配置。分単位のscheduleTaskと違い、findSlotCandidatesが返すISO文字列をそのまま使う。
  const scheduleTaskIso = useCallback(async (task: Task, startIso: string, endIso: string) => {
    try {
      await updateTask(task.id, { scheduled_start: startIso, scheduled_end: endIso });
      await reload();
    } catch (e) {
      setNotice(`時間割への配置に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [reload]);

  // 期間（着手可能日〜期限）の変更。値はTaskDetailの<input type="date">からそのまま渡ってくる。
  const changeWindow = useCallback(async (task: Task, windowStart: string | null, dueDate: string | null) => {
    try {
      await updateTask(task.id, {
        window_start: windowStart,
        due_at: dueDate ? zonedTimeToUtc(dueDate, '23:59', tz).toISOString() : null,
      });
      await reload();
    } catch (e) {
      setNotice(`期間の更新に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [reload, tz]);

  const unscheduleTask = useCallback(async (task: Task) => {
    try {
      await updateTask(task.id, { scheduled_start: null, scheduled_end: null });
      await reload();
    } catch (e) {
      setNotice(`時間割から外すのに失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [reload]);

  // 「やること」のドラッグハンドルを掴んだ瞬間に呼ばれる。以降はwindow全体でポインタを追う。
  const beginDrag = (task: Task, e: React.PointerEvent) => {
    e.preventDefault();
    setDrag({ task, x: e.clientX, y: e.clientY, overGrid: false });
  };

  useEffect(() => {
    if (!drag) return;
    // 「今日の時間割」と「やること」はページ上でかなり離れている。掴んだままでは
    // 時間割が画面外のことがほとんどなので、端に寄せている間はページを自動でスクロールする。
    const EDGE_PX = 72;
    const MAX_SPEED = 18;
    let autoScrollY = 0;
    let raf = 0;
    const tick = () => {
      if (autoScrollY !== 0) window.scrollBy(0, autoScrollY);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const move = (e: PointerEvent) => {
      const el = gridRef.current;
      const rect = el?.getBoundingClientRect();
      const overGrid = !!rect
        && e.clientX >= rect.left && e.clientX <= rect.right
        && e.clientY >= rect.top && e.clientY <= rect.bottom;
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY, overGrid } : d));

      if (e.clientY < EDGE_PX) {
        autoScrollY = -MAX_SPEED * (1 - e.clientY / EDGE_PX);
      } else if (e.clientY > window.innerHeight - EDGE_PX) {
        autoScrollY = MAX_SPEED * (1 - (window.innerHeight - e.clientY) / EDGE_PX);
      } else {
        autoScrollY = 0;
      }
    };
    // setState の更新関数は純粋に保つ（副作用はここに書かない）。
    // ドロップ確定は state を読み終えたあとに別途行う。
    const up = (e: PointerEvent) => {
      const min = dropMinutes(e.clientY);
      const rect = gridRef.current?.getBoundingClientRect();
      const inBounds = !!rect
        && e.clientX >= rect.left && e.clientX <= rect.right
        && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const task = drag?.task;
      setDrag(null);
      if (task && inBounds && min !== null) void scheduleTask(task, min);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.cancelAnimationFrame(raf);
    };
    // drag.x/y は動かすたびに変わるので依存に入れない（そのたびに登録し直すと
    // オートスクロールのrAFが1フレームも進めなくなる）。掴んだタスクが変わった時だけ張り直す。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.task.id, dropMinutes, scheduleTask]);

  // 時間割ブロックの下端ハンドルを掴んでの伸縮。ドラッグ中はDBに書かず、離した時だけ確定する。
  const beginResize = (task: Task, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentEndMin = dropMinutes(e.clientY) ?? GRID_END_MIN;
    setResizing({ taskId: task.id, previewEndMin: currentEndMin });
  };

  useEffect(() => {
    if (!resizing) return;
    const task = dayTasks.find((t) => t.id === resizing.taskId);
    const startMinOfDay = task?.scheduledStart ? minutesOfDayInTz(task.scheduledStart, tz) : GRID_START_MIN;

    const clampEnd = (min: number) => Math.max(startMinOfDay + MIN_BLOCK_MIN, min);

    const move = (e: PointerEvent) => {
      const min = dropMinutes(e.clientY);
      if (min === null) return;
      setResizing((r) => (r ? { ...r, previewEndMin: clampEnd(min) } : r));
    };
    const up = async (e: PointerEvent) => {
      const min = dropMinutes(e.clientY);
      setResizing(null);
      if (min === null || !task) return;
      try {
        const endIso = zonedTimeToUtc(day, minutesToHHMM(clampEnd(min)), tz).toISOString();
        await updateTask(task.id, { scheduled_end: endIso });
        await reload();
      } catch (e2) {
        setNotice(`長さの変更に失敗した: ${e2 instanceof Error ? e2.message : String(e2)}`);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    // タスクの再取得(dayTasks更新)はリサイズ完了後の1回だけで十分。
    // 依存に dayTasks 全体を入れるとドラッグ中に再バインドされてしまうため taskId だけを見る。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizing?.taskId, dropMinutes, day, tz]);

  // 起動時は保存済みの講評を読むだけ。API は叩かない（開くたびに課金しない）
  useEffect(() => {
    if (!session || !profile) return;
    void loadCachedReview(day).then((r) => {
      setReview(r.notes);
      setReviewModel(r.model);
      setReviewFromCache(true);
    }).catch(() => {});
  }, [session, profile, day]);

  // 「毎日やっている作業」をその日の分だけ自動でタスクにする。
  // 二重起票は recurrence_runs の unique 制約が防ぐので、開くたびに呼んでよい。
  useEffect(() => {
    if (!session || !profile) return;
    void (async () => {
      const made = await materializeForDay(day).catch(() => [] as never[]);
      if (made.length > 0) {
        setNotice(`定期作業 ${made.length} 件を今日のタスクにした`);
        await reload();
      }
    })();
  }, [session, profile, day, reload]);

  // カレンダーは取れた時にDBへ寄せ、画面は常にキャッシュを読む（再読み込み後・圏外でも見える）
  useEffect(() => {
    if (!session || !profile) return;
    void (async () => {
      const state = await syncGoogleDay(day, tz).catch(() => 'failed' as const);
      setCalState(state);
      setEvents(await loadCachedEvents(day, tz));
    })();
  }, [session, profile, day, tz]);

  // 圏外で貯めた起票をオンライン復帰時に送る
  useEffect(() => {
    const run = async () => {
      const res = await offline.flush();
      setPendingCount(offline.pending().length);
      if (res.sent > 0) { setNotice(`未送信だった ${res.sent} 件を送った`); void reload(); }
      if (res.failed > 0 && res.lastError && navigator.onLine) {
        setCaptureError(`${res.failed} 件が保存できない: ${res.lastError}`);
      }
    };
    void run();
    return offline.onReconnect(() => void run());
  }, [reload]);

  const handleCapture = async (title: string) => {
    if (!navigator.onLine) {
      offline.enqueue(title);
      setPendingCount(offline.pending().length);
      return;
    }
    try {
      await createTask(title, 'app');
      setCaptureError(null);
      await reload();
    } catch (e) {
      if (offline.isOfflineError(e)) {
        offline.enqueue(title);
        setPendingCount(offline.pending().length);
      } else {
        // サーバーが拒否した＝オフラインではない。黙ってキューに逃がすと不具合が隠れる
        setCaptureError(e instanceof Error ? e.message : String(e));
        throw e;
      }
    }
  };

  const handleFinish = async (t: Task) => {
    const res = await finishTask(t);
    if (res.needsConfirm) {
      // 止め忘れの疑い。裏でタイマーを回していないので、寝落ちすると巨大な実績になる
      const input = window.prompt(
        `開始から ${res.minutes} 分（約${Math.round(res.minutes / 60)}時間）経っている。\n` +
        `止め忘れなら実際にかかった分数に直して。`,
        String(Math.min(t.estimateMin, res.minutes)),
      );
      if (input === null) return;
      const n = Number(input);
      if (!Number.isFinite(n) || n <= 0) return;
      await finishTask(t, { minutesOverride: Math.round(n) });
    }
    await reload();
  };

  const doneToday = dayTasks.filter((t) => t.status === 'done').length;
  const plannedMin = dayTasks
    .filter((t) => t.scheduledStart && t.scheduledEnd && t.status !== 'done')
    .reduce((a, t) => a + minutesBetween(t.scheduledStart!, t.scheduledEnd!), 0);

  const sortedOpen = useMemo(() => {
    const now = new Date().toISOString();
    return [...openTasks].sort((a, b) => priorityScore(
      { id: b.id, title: b.title, estimateMin: b.estimateMin, importance: b.importance, dueAt: b.dueAt, status: b.status }, now,
    ) - priorityScore(
      { id: a.id, title: a.title, estimateMin: a.estimateMin, importance: a.importance, dueAt: a.dueAt, status: a.status }, now,
    ));
  }, [openTasks]);

  const checklistByTask = useMemo(() => groupByTaskId(checklist), [checklist]);
  const clipsByTask = useMemo(() => groupByTaskId(clips), [clips]);
  // 紐付いていない未投稿分。投稿済みまで残すと画面が過去の文案で埋まる
  const looseClips = useMemo(
    () => clips.filter((c) => c.taskId === null && !c.postedAt),
    [clips],
  );

  // 保存してから画面を書き換える。失敗した時にチェックだけ付いて実際は保存されていない、
  // という一番タチの悪い状態にしないため（失敗は握りつぶさず出す）。
  const toggleChecklist = async (item: ChecklistItem) => {
    try {
      await setChecklistDone(item.id, !item.done);
      setChecklist((prev) => prev.map((c) => (c.id === item.id ? { ...c, done: !item.done } : c)));
    } catch (e) {
      setNotice(`手順の保存に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const markPosted = async (clip: Clip, posted: boolean) => {
    try {
      await setClipPosted(clip.id, posted);
      const postedAt = posted ? new Date().toISOString() : null;
      setClips((prev) => prev.map((c) => (c.id === clip.id ? { ...c, postedAt } : c)));
    } catch (e) {
      setNotice(`投稿状態の保存に失敗した: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  // 計算だけで出す見立て。API を叩かないので何度描き直してもタダ。
  const insights = useMemo(() => {
    if (!profile) return [];
    return buildInsights({
      now: new Date().toISOString(), day, timezone: tz,
      workdayStart: profile.workdayStart, workdayEnd: profile.workdayEnd,
      busy: toBusyBlocks(events),
      tasks: [...openTasks, ...dayTasks].map((t) => ({
        id: t.id, title: t.title, estimateMin: t.estimateMin,
        importance: t.importance, dueAt: t.dueAt, status: t.status,
        scheduledStart: t.scheduledStart, scheduledEnd: t.scheduledEnd,
      })),
    }) as ReviewNote[];
  }, [profile, day, tz, events, openTasks, dayTasks]);

  if (!ready) return <div className="signin"><p>読み込み中</p></div>;

  if (!session) {
    return (
      <div className="signin">
        <div className="bg-decor" aria-hidden="true" />
        <div>
          <h1>Tempus</h1>
          <p>予定の隙間に、やることを置く。</p>
          <button className="btn filled" onClick={() => void signIn()}>Google でログイン</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-decor" aria-hidden="true" />
      <div className="app">
      <div className="hero">
        <h1>{day}</h1>
        <p>{profile?.displayName ?? ''}</p>
        <div className="hero-stats">
          <div className="hero-stat"><b>{sortedOpen.length}</b><span>未完了</span></div>
          <div className="hero-stat"><b>{doneToday}</b><span>今日完了</span></div>
          <div className="hero-stat"><b>{Math.round(plannedMin / 6) / 10}h</b><span>予定済み</span></div>
        </div>
      </div>

      {notice && <div className="banner info">{notice}</div>}
      {captureError && (
        <div className="banner warn">
          {captureError}
          <button className="btn" style={{ marginLeft: 8 }}
            onClick={() => { offline.discardAll(); setPendingCount(0); setCaptureError(null); }}>
            未送信を捨てる
          </button>
        </div>
      )}
      {calState === 'no_token' && (
        <div className="banner warn">
          カレンダーの接続が切れている（再読み込みでGoogleのトークンが消えるため）。
          <button className="btn" style={{ marginLeft: 8 }} onClick={() => void signIn()}>つなぎ直す</button>
        </div>
      )}
      {calState === 'failed' && <div className="banner warn">カレンダーを読めなかった。表示は前回のキャッシュ。</div>}

      <div className="card">
        <h2>今日の時間割</h2>
        <Timeline
          events={events}
          tasks={dayTasks}
          tz={tz}
          gridRef={gridRef}
          resizing={resizing}
          onStart={async (t) => { await startTask(t.id); await reload(); }}
          onFinish={handleFinish}
          onUnschedule={(t) => void unscheduleTask(t)}
          onResizeStart={beginResize}
        />
        {/* .card の backdrop-filter が position:fixed の基準点を書き換えてしまうため、
            document.body 直下へポータルして常に画面座標で浮かせる */}
        {drag && createPortal(
          <div
            className={`drag-ghost ${drag.overGrid ? 'over' : ''}`}
            style={{ left: drag.x, top: drag.y }}
          >
            {drag.task.title}
          </div>,
          document.body,
        )}
      </div>

      <div className="card">
        <h2>カレンダー</h2>
        <CalendarView events={events} tasks={[...dayTasks, ...openTasks]} today={day} tz={tz} />
      </div>

      <div className="card">
        <h2>今日の見立て</h2>
        <Review
          notes={insights}
          savedNotes={review}
          savedModel={reviewModel}
          savedFromCache={reviewFromCache}
          claudeAvailable={CLAUDE_REVIEW_ENABLED}
          loading={reviewLoading}
          error={reviewError}
          onAsk={async () => {
            setReviewLoading(true);
            setReviewError(null);
            try {
              const r = await fetchPlanReview(day, { force: review.length > 0 });
              setReview(r.notes);
              setReviewModel(r.model);
              setReviewFromCache(r.cached);
              setReviewError(r.error);
            } finally { setReviewLoading(false); }
          }}
        />
      </div>

      <div className="card">
        <h2>やること（優先順）</h2>
        <TaskList
          tasks={sortedOpen}
          now={new Date().toISOString()}
          timezone={tz}
          today={day}
          busy={[
            ...toBusyBlocks(events),
            ...dayTasks
              .filter((t) => t.scheduledStart && t.scheduledEnd)
              .map((t) => ({ start: t.scheduledStart!, end: t.scheduledEnd! })),
          ]}
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
          onChangeWindow={(t, windowStart, dueDate) => void changeWindow(t, windowStart, dueDate)}
        />
      </div>

      <LooseClips clips={looseClips} onMarkPosted={(clip, posted) => void markPosted(clip, posted)} />

      <div className="card">
        <h2>毎日やる作業</h2>
        <Recurrences
          items={recurrences}
          busy={busy}
          onCreate={async (v) => {
            setBusy(true);
            try {
              await createRecurrence(v);
              // 今日が該当日ならその場でタスクにする（明日まで待たせない）
              const made = await materializeForDay(day).catch(() => [] as Task[]);
              if (made.length > 0) setNotice(`定期作業 ${made.length} 件を今日のタスクにした`);
              await reload();
            } finally { setBusy(false); }
          }}
          onToggle={async (id, active) => { await setRecurrenceActive(id, active); await reload(); }}
          onDelete={async (id) => {
            if (!window.confirm('この定期作業を削除する？（作成済みのタスクは残る）')) return;
            await deleteRecurrence(id);
            await reload();
          }}
        />
      </div>

      <div className="row" style={{ marginTop: 24 }}>
        <span className="spacer" />
        <button className="btn" onClick={() => void signOut()}>ログアウト</button>
      </div>

      <CaptureBar onSubmit={handleCapture} offlineCount={pendingCount} />
      </div>
    </>
  );
}
