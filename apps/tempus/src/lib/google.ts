import { supabase } from './supabase';
import { dayBoundsUtc } from './dates';
import type { CalendarEvent, BusyBlock } from '../types/domain';

/**
 * カレンダーの取り込みをサーバー側に依頼する。
 *
 * 以前はここでブラウザから直接Googleを叩いていたが、provider_token は再読み込みで
 * 消えるため「ログイン直後の一瞬」しか取り込めず、実質ずっと空だった。
 * いまは初回に受け取った更新用トークンをサーバーへ預け、サーバーが取り直す。
 */
export async function syncGoogleDay(_day?: string, _tz?: string): Promise<'synced' | 'no_token' | 'failed'> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return 'no_token';

  // ログイン直後だけ更新用トークンが載っている。載っていれば預ける（以後は不要）。
  const refreshToken = data.session.provider_refresh_token ?? undefined;

  const { data: res, error } = await supabase.functions.invoke('calendar-sync', {
    body: refreshToken ? { refreshToken } : {},
  });
  if (error) return 'failed';
  if (res?.ok === true) return 'synced';
  // needsReconnect = 一度もトークンを預けていない or 失効した。ログインし直しが要る
  return res?.needsReconnect ? 'no_token' : 'failed';
}

export async function loadCachedEvents(day: string, tz: string): Promise<CalendarEvent[]> {
  const { start, end } = dayBoundsUtc(day, tz);
  const { data, error } = await supabase
    .from('calendar_events_cache')
    .select('*')
    .lt('start_at', end.toISOString())
    .gt('end_at', start.toISOString())
    .order('start_at');
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    ownerId: r.owner_id as string,
    googleEventId: r.google_event_id as string,
    calendarId: r.calendar_id as string,
    title: r.title as string,
    startAt: r.start_at as string,
    endAt: r.end_at as string,
    isAllDay: r.is_all_day as boolean,
    syncedAt: r.synced_at as string,
  }));
}

/** 終日予定は時間を塞がない（塞ぐと一日中どこにも置けなくなる） */
export function toBusyBlocks(events: CalendarEvent[]): BusyBlock[] {
  return events
    .filter((e) => !e.isAllDay)
    .map((e) => ({ start: e.startAt, end: e.endAt }));
}
