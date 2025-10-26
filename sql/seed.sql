insert into teams (code, name, sort_order) values
('A','BDSUrlauber',1),('B','Evershots Sutherland',2),('C','Freibier und Recht',3),
('D','Oliver Weinmann',4),('E','NoCapGemini',5),('F','Pain & Company',6),
('G','Garching Consulting Group',7),('H','Beering Point',8)
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
