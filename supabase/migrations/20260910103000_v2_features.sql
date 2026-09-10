-- 1. Tables

-- Tags for expenses
create table public.tags (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    name text not null,
    color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.expense_tags (
    expense_id uuid references public.expenses(id) on delete cascade,
    tag_id uuid references public.tags(id) on delete cascade,
    primary key (expense_id, tag_id)
);

-- Subscriptions (Gastos fijos)
create table public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete restrict,
    name text not null,
    amount integer not null, -- Store in cents
    frequency text not null check (frequency in ('weekly', 'monthly', 'yearly')),
    next_billing_date date,
    active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Savings goals
create table public.savings_goals (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    name text not null,
    target_amount integer not null, -- Store in cents
    current_amount integer default 0 not null,
    deadline date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Family badges (Gamification)
create table public.family_badges (
    id uuid primary key default uuid_generate_v4(),
    family_id uuid not null references public.families(id) on delete cascade,
    badge_type text not null,
    unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(family_id, badge_type)
);

-- 2. Row Level Security (RLS)

alter table public.tags enable row level security;
alter table public.expense_tags enable row level security;
alter table public.subscriptions enable row level security;
alter table public.savings_goals enable row level security;
alter table public.family_badges enable row level security;

-- tags
create policy "Users can view tags of their families"
on public.tags for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = tags.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can insert tags in their families"
on public.tags for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = tags.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Admins can update tags"
on public.tags for update
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = tags.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

-- expense_tags
create policy "Users can view expense_tags of their families"
on public.expense_tags for select
using (
  exists (
    select 1 from public.expenses
    join public.family_members on family_members.family_id = expenses.family_id
    where expenses.id = expense_tags.expense_id
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can insert expense_tags for their expenses"
on public.expense_tags for insert
with check (
  exists (
    select 1 from public.expenses
    join public.family_members on family_members.family_id = expenses.family_id
    where expenses.id = expense_tags.expense_id
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can delete expense_tags for their expenses"
on public.expense_tags for delete
using (
  exists (
    select 1 from public.expenses
    join public.family_members on family_members.family_id = expenses.family_id
    where expenses.id = expense_tags.expense_id
    and family_members.user_id = auth.uid()
  )
);

-- subscriptions
create policy "Users can view subscriptions of their families"
on public.subscriptions for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = subscriptions.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can insert subscriptions in their families"
on public.subscriptions for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = subscriptions.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Admins can update subscriptions"
on public.subscriptions for update
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = subscriptions.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

create policy "Admins can delete subscriptions"
on public.subscriptions for delete
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = subscriptions.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

-- savings_goals
create policy "Users can view savings_goals of their families"
on public.savings_goals for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = savings_goals.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can insert savings_goals in their families"
on public.savings_goals for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = savings_goals.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "Users can update savings_goals in their families"
on public.savings_goals for update
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = savings_goals.family_id 
    and family_members.user_id = auth.uid() 
  )
);

create policy "Admins can delete savings_goals"
on public.savings_goals for delete
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = savings_goals.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);

-- family_badges
create policy "Users can view family_badges of their families"
on public.family_badges for select
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = family_badges.family_id 
    and family_members.user_id = auth.uid()
  )
);

create policy "System or admins can insert family_badges"
on public.family_badges for insert
with check (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = family_badges.family_id 
    and family_members.user_id = auth.uid()
    and family_members.role = 'admin'
  )
);
