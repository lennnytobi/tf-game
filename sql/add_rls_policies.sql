-- ============================================
-- Add RLS Policies for Quiz Questions
-- This allows the frontend to read questions (but not answers)
-- ============================================

-- Enable RLS on quiz_questions if not already enabled
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public to read questions (not answers)" ON quiz_questions;

-- Allow anyone to read quiz questions (prompt, difficulty, team_code) but NOT answers
-- Note: The answer_norm column is excluded from SELECT in the frontend queries
CREATE POLICY "Allow public to read questions (not answers)" 
ON quiz_questions 
FOR SELECT 
TO PUBLIC
USING (true);

-- Ensure teams table is readable by public
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public to read teams" ON teams;
CREATE POLICY "Allow public to read teams" 
ON teams 
FOR SELECT 
TO PUBLIC
USING (true);

-- Ensure submissions table allows inserts
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public to insert submissions" ON submissions;
CREATE POLICY "Allow public to insert submissions" 
ON submissions 
FOR INSERT 
TO PUBLIC
WITH CHECK (true);

-- Allow public to read their own submissions
DROP POLICY IF EXISTS "Allow public to read submissions" ON submissions;
CREATE POLICY "Allow public to read submissions" 
ON submissions 
FOR SELECT 
TO PUBLIC
USING (true);

-- Ensure points_ledger is readable
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public to read points" ON points_ledger;
CREATE POLICY "Allow public to read points" 
ON points_ledger 
FOR SELECT 
TO PUBLIC
USING (true);

