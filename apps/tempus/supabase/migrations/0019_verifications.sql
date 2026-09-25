-- 検証ログ: 「仮説→結果→次アクション」を1日大小問わず100件記録する独立機能。
-- 既存の tasks/clips とは外部キー関係を持たない完全独立テーブル。
-- 設計: docs/superpowers/specs/2026-09-04-tempus-verification-log-design.md

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  hypothesis text not null,
  result text,
  next_action text,
  category text,
  created_at timestamptz not null default now()
);

comment on table public.verifications is '検証ログ。仮説・結果・次アクションを記録し、週次ルーティンが「自分取扱説明書」の材料にする。';

create index verifications_owner_created_idx
  on public.verifications (owner_id, created_at desc);

alter table public.verifications enable row level security;

create policy verifications_select_own
  on public.verifications for select
  using (owner_id = auth.uid());

create policy verifications_insert_own
  on public.verifications for insert
  with check (owner_id = auth.uid());

create policy verifications_update_own
  on public.verifications for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy verifications_delete_own
  on public.verifications for delete
  using (owner_id = auth.uid());

-- 0006_grants.sql と同じ理由: 自動公開OFFのため新規テーブルは明示付与しないと触れない。
grant select, insert, update, delete on public.verifications to authenticated;
