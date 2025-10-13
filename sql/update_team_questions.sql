-- Update quiz_questions table to support team-specific questions
alter table quiz_questions add column if not exists team_id uuid references teams(id) on delete cascade;

-- Create team-specific questions (3 questions per team = 24 total)
truncate quiz_questions restart identity cascade;

-- Team A questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'A'), 'Frage 1 für Team Alpha', 'paris'),
((select id from teams where code = 'A'), 'Frage 2 für Team Alpha', '42'),
((select id from teams where code = 'A'), 'Frage 3 für Team Alpha', 'blau');

-- Team B questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'B'), 'Frage 1 für Team Beta', 'paris'),
((select id from teams where code = 'B'), 'Frage 2 für Team Beta', '42'),
((select id from teams where code = 'B'), 'Frage 3 für Team Beta', 'blau');

-- Team C questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'C'), 'Frage 1 für Team Gamma', 'paris'),
((select id from teams where code = 'C'), 'Frage 2 für Team Gamma', '42'),
((select id from teams where code = 'C'), 'Frage 3 für Team Gamma', 'blau');

-- Team D questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'D'), 'Frage 1 für Team Delta', 'paris'),
((select id from teams where code = 'D'), 'Frage 2 für Team Delta', '42'),
((select id from teams where code = 'D'), 'Frage 3 für Team Delta', 'blau');

-- Team E questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'E'), 'Frage 1 für Team Epsilon', 'paris'),
((select id from teams where code = 'E'), 'Frage 2 für Team Epsilon', '42'),
((select id from teams where code = 'E'), 'Frage 3 für Team Epsilon', 'blau');

-- Team F questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'F'), 'Frage 1 für Team Zeta', 'paris'),
((select id from teams where code = 'F'), 'Frage 2 für Team Zeta', '42'),
((select id from teams where code = 'F'), 'Frage 3 für Team Zeta', 'blau');

-- Team G questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'G'), 'Frage 1 für Team Eta', 'paris'),
((select id from teams where code = 'G'), 'Frage 2 für Team Eta', '42'),
((select id from teams where code = 'G'), 'Frage 3 für Team Eta', 'blau');

-- Team H questions
insert into quiz_questions (team_id, prompt, answer_norm) values
((select id from teams where code = 'H'), 'Frage 1 für Team Theta', 'paris'),
((select id from teams where code = 'H'), 'Frage 2 für Team Theta', '42'),
((select id from teams where code = 'H'), 'Frage 3 für Team Theta', 'blau');

-- Update the RPC function to work with team-specific questions
create or replace function submit_quiz_answer(player_uid text, q_id int, raw_answer text)
returns jsonb
language plpgsql
security definer
as $$
declare
  t_code text := split_part(player_uid, '-', 1); -- "A" from "A-1"
  team_rec teams%rowtype;
  correct boolean := false;
  sub_id uuid := gen_random_uuid();
  scored boolean := false;
  new_total int := 0;
begin
  select * into team_rec from teams where code = t_code;
  if team_rec.id is null then
    raise exception 'Unknown team code';
  end if;

  -- Check if the question belongs to this team
  select norm_text(raw_answer) = answer_norm into correct
  from quiz_questions 
  where id = q_id and team_id = team_rec.id;

  if correct is null then
    raise exception 'Question not found for this team';
  end if;

  insert into submissions(id, team_id, player_uid, question_id, answer, is_correct)
  values (sub_id, team_rec.id, player_uid, q_id, raw_answer, coalesce(correct,false));

  if correct then
    begin
      insert into points_ledger(team_id, points, source, ref)
      values (team_rec.id, 1, 'quiz', 'submission:'||sub_id);
      scored := true;
    exception when unique_violation then
      scored := false;
    end;
  end if;

  select coalesce(sum(points),0)::int into new_total from points_ledger where team_id = team_rec.id;

  return jsonb_build_object(
    'team', team_rec.name,
    'is_correct', correct,
    'scored', scored,
    'team_total', coalesce(new_total,0)
  );
end;
$$;
