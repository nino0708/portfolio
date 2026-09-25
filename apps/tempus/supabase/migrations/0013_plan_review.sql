-- Claude による1日の時間割の「講評」。
--
-- 置く場所は決定的アルゴリズム（src/lib/plan.ts）が決める。Claude は口を出さない。
-- Claude にやらせるのは「詰め込みすぎ」「この2つはまとめた方がいい」といった言葉の判断だけ。
-- 直接組ませると予定と衝突する案が出るし、同じ入力でも毎回変わって当てにならなくなる。

create table public.plan_reviews (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users (id) on delete cascade default auth.uid(),
  for_date   date not null,
  notes      jsonb not null default '[]'::jsonb,
  model      text,
  created_at timestamptz not null default now(),
  unique (owner_id, for_date)
);

-- 費用が見えるように、呼び出しとトークン数を残す。
create table public.plan_review_usage (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade default auth.uid(),
  for_date      date not null,
  called_at     timestamptz not null default now(),
  model         text,
  input_tokens  integer,
  output_tokens integer,
  ok            boolean not null default true,
  note          text
);

create index plan_review_usage_owner_date_idx
  on public.plan_review_usage (owner_id, for_date);

-- ---- RLS ----
alter table public.plan_reviews      enable row level security;
alter table public.plan_review_usage enable row level security;

-- 読むのは本人だけ。書き込みは Edge Function が service_role で行うので
-- insert/update のポリシーは意図的に作らない（ブラウザから捏造できないようにする）。
create policy plan_reviews_read on public.plan_reviews
  for select using (owner_id = auth.uid());

create policy plan_review_usage_read on public.plan_review_usage
  for select using (owner_id = auth.uid());

-- ---- GRANT（0006 の流儀。anon には与えない）----
grant select on public.plan_reviews      to authenticated;
grant select on public.plan_review_usage to authenticated;
revoke all on public.plan_reviews      from anon;
revoke all on public.plan_review_usage from anon;
