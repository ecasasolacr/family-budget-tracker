-- 1. Create a security definer function to get the current user's family IDs
create or replace function public.get_user_family_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select family_id from public.family_members where user_id = auth.uid();
$$;

-- 2. Drop the old recursive policies
drop policy if exists "Users can view families they belong to" on public.families;
drop policy if exists "Users can view profiles of their family members" on public.users;
drop policy if exists "Users can view members of their families" on public.family_members;
drop policy if exists "Users can view categories of their families" on public.categories;
drop policy if exists "Admins can insert categories" on public.categories;
drop policy if exists "Admins can update categories" on public.categories;
drop policy if exists "Users can view budgets of their families" on public.budgets;
drop policy if exists "Admins can insert budgets" on public.budgets;
drop policy if exists "Admins can update budgets" on public.budgets;
drop policy if exists "Users can view expenses of their families" on public.expenses;
drop policy if exists "Users can insert expenses in their families" on public.expenses;
drop policy if exists "Users can update their own expenses or admins can update any" on public.expenses;
drop policy if exists "Users can delete their own expenses or admins can delete any" on public.expenses;

-- 3. Recreate policies using the function
-- families
create policy "Users can view families they belong to" 
on public.families for select 
using ( id in (select public.get_user_family_ids()) );

create policy "Users can create families" 
on public.families for insert 
with check (true);

-- users
create policy "Users can view profiles of their family members"
on public.users for select
using (
  id in (
    select user_id from public.family_members 
    where family_id in (select public.get_user_family_ids())
  )
);

-- family_members
create policy "Users can view members of their families"
on public.family_members for select
using ( family_id in (select public.get_user_family_ids()) );

create policy "Users can join families"
on public.family_members for insert
with check ( user_id = auth.uid() );

-- categories
create policy "Users can view categories of their families"
on public.categories for select
using ( family_id in (select public.get_user_family_ids()) );

-- budgets
create policy "Users can view budgets of their families"
on public.budgets for select
using ( family_id in (select public.get_user_family_ids()) );

-- expenses
create policy "Users can view expenses of their families"
on public.expenses for select
using ( family_id in (select public.get_user_family_ids()) );

create policy "Users can insert expenses in their families"
on public.expenses for insert
with check ( family_id in (select public.get_user_family_ids()) and user_id = auth.uid() );

-- 4. Create an atomic function for creating a family
create or replace function public.create_family(family_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
begin
  insert into public.families (name) values (family_name) returning id into new_family_id;
  insert into public.family_members (user_id, family_id, role) values (auth.uid(), new_family_id, 'admin');
  return new_family_id;
end;
$$;
