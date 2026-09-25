import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// 思考ログ（タスクごとの Googleドキュメント）用。このアプリが作ったファイルにしか触れない
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

export async function signIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: `${CALENDAR_SCOPE} ${DRIVE_SCOPE}`,
      // カレンダー・Drive を使うための更新用トークンが要る。offline+consent で確実に発行させる
      queryParams: { access_type: 'offline', prompt: 'consent' },
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}
