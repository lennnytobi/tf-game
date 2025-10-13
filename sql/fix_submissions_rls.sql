-- Fix RLS policy to allow reading submissions
-- Run this in your Supabase SQL editor

-- Drop the existing restrictive policy
drop policy if exists "no select submissions" on submissions;

-- Create new policy that allows reading submissions
create policy "read submissions for team"
on submissions for select
to anon using (true);

-- Verify the policy was created
select schemaname, tablename, policyname, permissive, roles, cmd, qual 
from pg_policies 
where tablename = 'submissions';
