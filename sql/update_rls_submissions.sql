-- Update RLS policies to allow reading submissions for the same team
-- This allows the quiz to show persistent correct answers

-- Drop the existing restrictive policy
drop policy if exists "no select submissions" on submissions;

-- Create new policy that allows reading submissions for the same team
create policy "read submissions for team"
on submissions for select
to anon using (true);

-- Alternative: More restrictive policy that only allows reading submissions for the same team
-- This would require passing team_id in the query, but since we're using mock questions,
-- we'll use the more permissive policy for now
-- create policy "read submissions for team"
-- on submissions for select
-- to anon using (team_id = (select id from teams where code = current_setting('app.current_team_code', true)));
