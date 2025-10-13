insert into teams (code, name, sort_order) values
('A','Team Alpha',1),('B','Team Beta',2),('C','Team Gamma',3),
('D','Team Delta',4),('E','Team Epsilon',5),('F','Team Zeta',6),
('G','Team Eta',7),('H','Team Theta',8)
on conflict do nothing;

-- If you prefer strict A..H codes, replace the above with A..H and your German names.
-- Clear existing quiz questions and submissions (CASCADE handles foreign key constraints)
truncate quiz_questions restart identity cascade;
insert into quiz_questions (prompt, answer_norm) values
('Frage 1', 'paris'),
('Frage 2', '42'),
('Frage 3', 'blau'),
('Frage 4', 'einstein'),
('Frage 5', '2007');
