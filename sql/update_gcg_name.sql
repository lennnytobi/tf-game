-- Update Garching Consulting Club to Garching Consulting Group
UPDATE teams 
SET name = 'Garching Consulting Group' 
WHERE code = 'H' AND name LIKE '%Club%';

