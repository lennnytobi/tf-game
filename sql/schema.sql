-- Teams A..H
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(code)=1),
  name text not null,
  sort_order int not null
);

-- Quiz questions (answers are kept server-side only)
create table if not exists quiz_questions (
  id serial primary key,
  prompt text not null,
  answer_norm text not null
);

-- User submissions (public can insert; they cannot read correct answers)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  player_uid text not null,
  question_id int not null references quiz_questions(id),
  answer text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

-- Append-only points ledger (single source of truth)
-- Create enum type if it doesn't exist
do $$ begin
    create type points_source as enum ('quiz','game','bonus','penalty','manual');
exception
    when duplicate_object then null;
end $$;

create table if not exists points_ledger (
  id bigserial primary key,
  team_id uuid not null references teams(id) on delete cascade,
  points int not null,
  source points_source not null,
  ref text,
  created_by text, -- organizer identifier (free text)
  created_at timestamptz not null default now()
);

-- Derived totals view
create or replace view team_totals as
select team_id, coalesce(sum(points),0)::int as score
from points_ledger
group by team_id;

-- One score per team per question (enforced through unique partial index)
create unique index if not exists submissions_unique_team_question_correct
  on submissions(team_id, question_id)
  where is_correct = true;

-- Helpers + RPC
create or replace function norm_text(t text) returns text
language sql immutable as $$
  select regexp_replace(lower(trim(t)), '\s+', ' ', 'g')
$$;

create or replace function submit_quiz_answer(player_uid text, q_id int, raw_answer text)
returns jsonb
language plpgsql
security definer
as $$
declare
  t_code text := split_part(player_uid, '-', 1); -- "A" from "A-2"
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

  select norm_text(raw_answer) = answer_norm into correct
  from quiz_questions where id = q_id;

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
