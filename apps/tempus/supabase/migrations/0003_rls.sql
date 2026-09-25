-- Tempus: Row Level Security
-- 設計思想: 共有はプロジェクト単位。project_id が NULL のタスク（受信箱）は所有者本人だけ。
--
-- 罠: project_members のポリシーが project_members 自体を SELECT する条件式を書くと、
-- ポリシー評価 -> ポリシー評価 -> ... と無限再帰して "infinite recursion detected in policy"
-- エラーになる。回避のため、判定ロジックは SECURITY DEFINER の helper function に切り出す。
-- SECURITY DEFINER 関数はテーブル所有者（マイグレーション実行ロール）の権限で生データに
-- アクセスするため RLS を経由せず、再帰の入口にならない。

-- ============================================================
-- helper functions（SECURITY DEFINER で RLS を経由せず判定する）
-- ============================================================

-- プロジェクトのオーナーか
create function public.is_project_owner(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = p_user_id
  );
$$;

-- プロジェクトのメンバー（オーナー含む）として閲覧権があるか
create function public.is_project_member(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    public.is_project_owner(p_project_id, p_user_id)
    or exists (
      select 1 from public.project_members
      where project_id = p_project_id and user_id = p_user_id
    );
$$;

-- プロジェクトへの書き込み権があるか（owner ロール or editor ロール、またはプロジェクトオーナー本人）
create function public.can_edit_project(p_project_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    public.is_project_owner(p_project_id, p_user_id)
    or exists (
      select 1 from public.project_members
      where project_id = p_project_id
        and user_id = p_user_id
        and role in ('owner', 'editor')
    );
$$;

-- ============================================================
-- RLS 有効化
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_checklist_items enable row level security;
alter table public.time_entries enable row level security;
alter table public.calendar_events_cache enable row level security;

-- ============================================================
-- profiles: 本人のみ。display_name の同僚公開は下の関数経由で行う
-- （RLS は行単位の制御しかできず列単位では絞れないため、
-- 　「同じプロジェクトのメンバーは display_name だけ見える」は
-- 　このテーブルのポリシーを緩めるのではなく別関数で実現する）
-- ============================================================
create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = id);

create policy profiles_insert_own
  on public.profiles for insert
  with check (auth.uid() = id);

create policy profiles_update_own
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 将来の担当表示用: 同じプロジェクトのメンバーの id / display_name だけを返す
create function public.get_project_member_names(p_project_id uuid)
returns table (id uuid, display_name text)
language sql
security definer
stable
set search_path = public
as $$
  select p.id, p.display_name
  from public.profiles p
  where public.is_project_member(p_project_id, auth.uid())
    and (
      p.id in (select user_id from public.project_members where project_id = p_project_id)
      or p.id = (select owner_id from public.projects where id = p_project_id)
    );
$$;

-- ============================================================
-- projects
-- ============================================================
create policy projects_select
  on public.projects for select
  using (owner_id = auth.uid() or public.is_project_member(id, auth.uid()));

create policy projects_insert
  on public.projects for insert
  with check (owner_id = auth.uid());

create policy projects_update
  on public.projects for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy projects_delete
  on public.projects for delete
  using (owner_id = auth.uid());

-- ============================================================
-- project_members
-- 追加/削除/ロール変更はプロジェクトオーナーのみ（メンバーは自分の脱退のみ可）
-- ============================================================
create policy project_members_select
  on public.project_members for select
  using (
    user_id = auth.uid()
    or public.is_project_owner(project_id, auth.uid())
    or public.is_project_member(project_id, auth.uid())
  );

create policy project_members_insert
  on public.project_members for insert
  with check (public.is_project_owner(project_id, auth.uid()));

create policy project_members_update
  on public.project_members for update
  using (public.is_project_owner(project_id, auth.uid()))
  with check (public.is_project_owner(project_id, auth.uid()));

create policy project_members_delete
  on public.project_members for delete
  using (public.is_project_owner(project_id, auth.uid()) or user_id = auth.uid());

-- ============================================================
-- tasks
-- ============================================================
create policy tasks_select
  on public.tasks for select
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.is_project_member(project_id, auth.uid()))
  );

create policy tasks_insert
  on public.tasks for insert
  with check (
    owner_id = auth.uid()
    and (project_id is null or public.can_edit_project(project_id, auth.uid()))
  );

create policy tasks_update
  on public.tasks for update
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  )
  with check (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  );

create policy tasks_delete
  on public.tasks for delete
  using (
    owner_id = auth.uid()
    or (project_id is not null and public.can_edit_project(project_id, auth.uid()))
  );

-- ============================================================
-- task_checklist_items: 親タスクの可視性/編集権をそのまま継承
-- ============================================================
create policy task_checklist_items_select
  on public.task_checklist_items for select
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.is_project_member(t.project_id, auth.uid()))
        )
    )
  );

-- insert/update/delete を個別に定義（for all にすると select ポリシーと重複評価されるため）
create policy task_checklist_items_insert
  on public.task_checklist_items for insert
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

create policy task_checklist_items_update
  on public.task_checklist_items for update
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  )
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

create policy task_checklist_items_delete
  on public.task_checklist_items for delete
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_checklist_items.task_id
        and (
          t.owner_id = auth.uid()
          or (t.project_id is not null and public.can_edit_project(t.project_id, auth.uid()))
        )
    )
  );

-- ============================================================
-- time_entries: 実績時間は本人のみ（読み書きとも）
-- ============================================================
create policy time_entries_all
  on public.time_entries for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ============================================================
-- calendar_events_cache: Google カレンダーの個人キャッシュ。本人のみ
-- ============================================================
create policy calendar_events_cache_all
  on public.calendar_events_cache for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
