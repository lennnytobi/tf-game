-- Add difficulty and team assignment to quiz_questions
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
-- Important: Nickname questions are NOT assigned to teams where the answer person is a member!
-- Q1: Celonis - Teams A, B (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'A'),
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'B');

-- Q2: Tänzer (Benjamin Speigl is on Team F) - Teams C, D (2 teams, NOT F)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'C'),
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'D');

-- Q3: Doc (Simon Feiertag is on Team I - org team) - Teams E, G (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'E'),
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'G');

-- Q4: Deichsler (Maik Wagenblast is on Team G) - Teams F, H (2 teams, NOT G)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'F'),
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

