-- ============================================
-- Fix Nickname Question Distribution & Reset Game
-- Ensures teams don't answer questions about their own members
-- Also clears all submissions and points to start fresh
-- ============================================

-- Step 1: Clear all submissions (to avoid foreign key constraint)
TRUNCATE submissions RESTART IDENTITY CASCADE;

-- Step 2: Clear all points
TRUNCATE points_ledger RESTART IDENTITY;

-- Step 3: Delete only the easy questions (nickname questions) to redistribute them
DELETE FROM quiz_questions WHERE difficulty = 'easy';

-- Re-insert easy questions with correct distribution
-- Important: Answer person is NOT on the teams assigned to answer!

-- Q1: Celonis - Teams A, B (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'A'),
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'B');

-- Q2: Tänzer (Benjamin Speigl is on Team F - Beering Point) - Teams C, D (NOT F!)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'C'),
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'D');

-- Q3: Doc (Simon Feiertag is on Team I - Goldman Stanley) - Teams E, G (NOT I, but I is org team anyway)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'E'),
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'G');

-- Q4: Deichsler (Maik Wagenblast is on Team G - BDSUrlauber) - Teams F, H (NOT G!)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'F'),
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'H');

-- ============================================
-- VERIFICATION:
-- Team C, D: Tänzer (Benjamin) - Benjamin is on Team F ✓
-- Team E, G: Doc (Simon) - Simon is on Team I ✓
-- Team F, H: Deichsler (Maik) - Maik is on Team G ✓
-- ============================================

-- All teams now have correct easy questions:
-- A: Celonis, B: Celonis, C: Tänzer, D: Tänzer
-- E: Doc, F: Deichsler, G: Doc, H: Deichsler

