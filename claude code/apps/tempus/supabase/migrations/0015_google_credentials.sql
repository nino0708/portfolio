-- Googleの更新用トークンを保管する。
--
-- 経緯: これまでカレンダーの取得は session.provider_token に頼っていたが、
-- そのトークンはページを再読み込みすると消える。つまり「ログインした直後の一瞬」しか
-- カレンダーを取りに行けず、毎朝の見立ても予定を1件も知らないまま計算していた。
--
-- Googleは初回同意時に「更新用トークン(refresh token)」も渡してくる。これを保存しておけば
-- サーバー側でいつでもアクセストークンを取り直せる。再ログインが要らなくなる。
--
-- ⚠️ これは本人のGoogleアカウントに触れる鍵なので、**ブラウザからは一切読めなくする**。
--    書き込みも Edge Function（service_role）経由のみ。authenticated には何も与えない。

create table public.google_credentials (
  owner_id      uuid primary key references auth.users (id) on delete cascade,
  refresh_token text not null,
  scope         text,
  updated_at    timestamptz not null default now(),
  last_sync_at  timestamptz,
  last_error    text
);

alter table public.google_credentials enable row level security;

-- ポリシーを1つも作らない = service_role 以外は誰も読めない・書けない。
-- （RLS有効でポリシー無しは「全部拒否」。service_role は RLS をバイパスする）

revoke all on public.google_credentials from anon, authenticated;

comment on table public.google_credentials is
  'Googleの更新用トークン。ブラウザからは読めない。Edge Function が service_role で使う。';
