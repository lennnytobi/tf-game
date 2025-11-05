-- Add difficulty and team assignment to quiz_questions
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS team_code text REFERENCES teams(code);

-- Clear existing questions
TRUNCATE quiz_questions RESTART IDENTITY CASCADE;

-- Insert questions with difficulty and team assignment
-- Easy questions (4 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('In welchem Jahr wurde Celonis gegründet?', '2011', 'easy', 'A'),
('Welcher ACler ist unter dem Namen "Tänzer" bekannt?', 'benjamin speigl', 'easy', 'B'),
('Welcher ACler ist unter dem Namen "Doc" bekannt?', 'simon feiertag', 'easy', 'C'),
('Welcher ACler ist unter dem Namen "Deichsler" bekannt?', 'maik wagenblast', 'easy', 'D');

-- Medium questions (3 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Was ist der Hex Code des "AC-Rot"?', '#993333', 'medium', 'E'),
('Wer war der erste offizielle Vorstand von TPM?', 'bastian burger', 'medium', 'F'),
('Welcher Döner ist laut dem AC-Dönertasting der beste Döner Münchens?', 'verdi döner', 'medium', 'G');

-- Hard questions (2 teams)
INSERT INTO quiz_questions (prompt, answer_norm, difficulty, team_code) VALUES
('Wie viele Mitglieder wurden jemals bei Academy Consult aufgenommen?', '822', 'hard', 'H'),
('Wie viele ACler waren im August 2015 auf der AC Insel dabei?', '32', 'hard', 'I');

