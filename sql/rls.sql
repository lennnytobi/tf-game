alter table teams enable row level security;
alter table quiz_questions enable row level security;
alter table submissions enable row level security;
alter table points_ledger enable row level security;

-- Public: read leaderboard (points_ledger for realtime + team_totals view)
create policy "read points_ledger"
on points_ledger for select
to anon using (true);

-- Public: insert submissions (no select back)
create policy "insert submissions"
on submissions for insert
to anon with check (true);

create policy "no select submissions"
on submissions for select
to anon using (false);

-- Lock down quiz_questions (no public access; only RPC runs as definer)
create policy "no select quiz"
on quiz_questions for select
to anon using (false);

-- Teams are static; allow read for display if needed
create policy "read teams"
on teams for select
to anon using (true);
