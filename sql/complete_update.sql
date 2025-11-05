-- ============================================
-- COMPLETE UPDATE SCRIPT FOR SUPABASE
-- Run this entire script in your Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: Fix Team Names
-- ============================================

-- Update Oliver Weinmann to Oliver Weinman (one 'n')
UPDATE teams 
SET name = 'Oliver Weinman' 
WHERE code = 'D' AND name = 'Oliver Weinmann';

-- Update Garching Consulting Club to Garching Consulting Group
UPDATE teams 
SET name = 'Garching Consulting Group' 
WHERE code = 'H' AND (name LIKE '%Club%' OR name = 'Garching Consulting Club');

-- ============================================
-- PART 2: Update Quiz Scoring (1 point -> 2 points)
-- ============================================

-- Recreate the submit_quiz_answer function with 2 points per correct answer
CREATE OR REPLACE FUNCTION submit_quiz_answer(player_uid text, q_id int, raw_answer text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  t_code text := split_part(player_uid, '-', 1); -- "A" from "A-2"
  team_rec teams%rowtype;
  correct boolean := false;
  sub_id uuid := gen_random_uuid();
  scored boolean := false;
  new_total int := 0;
BEGIN
  SELECT * INTO team_rec FROM teams WHERE code = t_code;
  IF team_rec.id IS NULL THEN
    RAISE EXCEPTION 'Unknown team code';
  END IF;

  SELECT norm_text(raw_answer) = answer_norm INTO correct
  FROM quiz_questions WHERE id = q_id;

  INSERT INTO submissions(id, team_id, player_uid, question_id, answer, is_correct)
  VALUES (sub_id, team_rec.id, player_uid, q_id, raw_answer, COALESCE(correct,false));

  IF correct THEN
    BEGIN
      INSERT INTO points_ledger(team_id, points, source, ref)
      VALUES (team_rec.id, 2, 'quiz', 'submission:'||sub_id);
      scored := true;
    EXCEPTION WHEN unique_violation THEN
      scored := false;
    END;
  END IF;

  SELECT COALESCE(SUM(points),0) INTO new_total
  FROM points_ledger WHERE team_id = team_rec.id;

  RETURN jsonb_build_object(
    'is_correct', COALESCE(correct, false),
    'scored', scored,
    'team', team_rec.name,
    'team_total', new_total
  );
END;
$$;

-- ============================================
-- PART 3: Add Quiz Questions with Difficulty & Team Assignment
-- ============================================

-- Add difficulty and team assignment columns to quiz_questions
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS team_code text REFERENCES teams(code);

-- Clear existing questions
TRUNCATE quiz_questions RESTART IDENTITY CASCADE;

-- Insert questions with difficulty and team assignment
-- Each team (A-H) gets 3 questions: 1 easy, 1 medium, 1 hard
-- Team I (Goldman Stanley) is the organization team and gets NO questions
-- Questions are reused across teams and evenly distributed

-- EASY QUESTIONS (4 unique questions distributed across 8 teams)
-- Q1: Celonis - Teams A, B (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'A'),
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'B');

-- Q2: Tänzer - Teams C, D (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'C'),
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'D');

-- Q3: Doc - Teams E, F (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'E'),
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'F');

-- Q4: Deichsler - Teams G, H (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'G'),
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'H');

-- MEDIUM QUESTIONS (3 unique questions distributed across 8 teams)
-- Q1: AC-Rot Hex - Teams A, B, C (3 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Was ist der Hex Code des "AC-Rot"?', '#993333', 'medium', 'A'),
('Was ist der Hex Code des "AC-Rot"?', '#993333', 'medium', 'B'),
('Was ist der Hex Code des "AC-Rot"?', '#993333', 'medium', 'C');

-- Q2: TPM Vorstand - Teams D, E, F (3 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wer war der erste offizielle Vorstand von TPM?', 'bastian burger', 'medium', 'D'),
('Wer war der erste offizielle Vorstand von TPM?', 'bastian burger', 'medium', 'E'),
('Wer war der erste offizielle Vorstand von TPM?', 'bastian burger', 'medium', 'F');

-- Q3: Verdi Döner - Teams G, H (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'G'),
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'H');

-- HARD QUESTIONS (2 unique questions distributed across 8 teams)
-- Q1: 822 Mitglieder - Teams A, B, C, D (4 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'A'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'B'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'C'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'D');

-- Q2: 32 ACler - Teams E, F, G, H (4 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'E'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'F'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'G'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'H');

-- ============================================
-- DONE! Your database is now fully updated.
-- ============================================

