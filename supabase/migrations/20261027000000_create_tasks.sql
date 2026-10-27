-- One table of tasks, each owned by an authenticated user.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks (user_id);

-- Only signed-in users may touch the table; anonymous visitors get nothing.
revoke all on table public.tasks from anon;
grant select, insert, update, delete on table public.tasks to authenticated;

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
  on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own tasks"
  on public.tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete to authenticated
  using ((select auth.uid()) = user_id);
