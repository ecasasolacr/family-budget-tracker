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

create policy "Admins can delete categories"
on public.categories for delete
using (
  exists (
    select 1 from public.family_members 
    where family_members.family_id = categories.family_id 
    and family_members.user_id = auth.uid() 
    and family_members.role = 'admin'
  )
);
