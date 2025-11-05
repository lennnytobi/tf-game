-- ============================================
-- Reset All Team Points and Quiz Submissions
-- ============================================

-- Delete all submissions (quiz answers)
-- This allows teams to answer all questions again from scratch
TRUNCATE submissions RESTART IDENTITY CASCADE;

-- Delete all points from the points_ledger
-- This resets all team scores to 0
TRUNCATE points_ledger RESTART IDENTITY;

-- All teams now have:
-- - 0 points (100% stress level)
-- - No answered questions (can answer all questions again)

