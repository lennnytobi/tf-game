insert into teams (code, name, sort_order) values
('A','Evershots Sutherland',1),('B','No-Cap-Gemini',2),('C','Pain & Company',3),
('D','Oliver Weinmann',4),('E','Freibier & Recht',5),('F','Beering Point',6),
('G','BDSUrlauber',7),('H','Garching Consulting Club',8)
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
