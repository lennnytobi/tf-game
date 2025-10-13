-- Update RLS policies to allow admin functionality
-- Run this in your Supabase SQL editor

-- Allow public to insert into points_ledger (for admin functionality)
-- Note: This is less secure than server-side validation, but necessary for static export
drop policy if exists "read points_ledger" on points_ledger;
create policy "read points_ledger"
on points_ledger for select
to anon using (true);

-- Allow public to insert into points_ledger (admin functionality)
create policy "insert points_ledger"
on points_ledger for insert
to anon with check (true);

-- Verify the policies were created
select schemaname, tablename, policyname, permissive, roles, cmd, qual 
from pg_policies 
where tablename = 'points_ledger';
