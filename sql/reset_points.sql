-- ============================================
-- Reset All Team Points to Zero
-- ============================================

-- Delete all points from the points_ledger
TRUNCATE points_ledger RESTART IDENTITY;

-- This will set all team scores back to 0
-- The team_totals view will automatically show 0 for all teams

