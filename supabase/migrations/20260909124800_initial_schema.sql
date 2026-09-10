-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tables

create table public.families (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.family_members (
    user_id uuid references public.users(id) on delete cascade,
    family_id uuid references public.families(id) on delete cascade,
    role text not null check (role in ('admin', 'member')),
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, family_id)
);

create table public.categories (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    name text not null,
    icon text,
    color text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.budgets (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    month integer not null check (month >= 1 and month <= 12),
    year integer not null,
    amount_limit integer not null, -- Store in cents
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(family_id, category_id, month, year)
);

create table public.expenses (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    amount integer not null, -- Store in cents
    date date not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Row Level Security (RLS)

alter table public.families enable row level security;
alter table public.users enable row level security;
alter table public.family_members enable row level security;
alter table public.categories enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;

-- families
create policy "Users can view families they belong to" 
on public.families for select 
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = families.id 
    and family_members.user_id = auth.uid()
  )
);

-- users
create policy "Users can view their own profile"
on public.users for select
using (id = auth.uid());

create policy "Users can view profiles of their family members"
on public.users for select
using (
  exists (
    select 1 from public.family_members fm1
    join public.family_members fm2 on fm1.family_id = fm2.family_id
    where fm1.user_id = users.id and fm2.user_id = auth.uid()
  )
);

-- family_members
create policy "Users can view members of their families"
on public.family_members for select
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = family_members.family_id 
    and fm.user_id = auth.uid()
  )
);

-- categories
create policy "Users can view categories of their families"
on public.categories for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = categories.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Admins can insert categories"
on public.categories for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = categories.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

create policy "Admins can update categories"
on public.categories for update
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = categories.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

-- budgets
create policy "Users can view budgets of their families"
on public.budgets for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = budgets.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Admins can insert budgets"
on public.budgets for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = budgets.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

create policy "Admins can update budgets"
on public.budgets for update
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = budgets.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

-- expenses
create policy "Users can view expenses of their families"
on public.expenses for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = expenses.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can insert expenses in their families"
on public.expenses for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = expenses.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can update their own expenses or admins can update any"
on public.expenses for update
using (
  user_id = auth.uid() or 
  exists (
    select 1 from public.family_members 
    where family_members.family_id = expenses.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

create policy "Users can delete their own expenses or admins can delete any"
on public.expenses for delete
using (
  user_id = auth.uid() or 
  exists (
    select 1 from public.family_members 
    where family_members.family_id = expenses.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);
