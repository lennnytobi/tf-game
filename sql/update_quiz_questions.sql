-- Add difficulty and team assignment to quiz_questions
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS team_code text REFERENCES teams(code);

-- Clear existing questions
TRUNCATE quiz_questions RESTART IDENTITY CASCADE;

-- Insert questions with difficulty and team assignment
-- Each team gets 3 questions: 1 easy, 1 medium, 1 hard
-- Questions are reused across teams and evenly distributed

-- EASY QUESTIONS (4 unique questions distributed across 9 teams)
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

-- Q4: Deichsler - Teams G, H, I (3 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'G'),
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'H'),
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'I');

-- MEDIUM QUESTIONS (3 unique questions distributed across 9 teams)
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

-- Q3: Verdi Döner - Teams G, H, I (3 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'G'),
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'H'),
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'I');

-- HARD QUESTIONS (2 unique questions distributed across 9 teams)
-- Q1: 822 Mitglieder - Teams A, B, C, D, E (5 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'A'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'B'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'C'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'D'),
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'E');

-- Q2: 32 ACler - Teams F, G, H, I (4 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'F'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'G'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'H'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'I');

