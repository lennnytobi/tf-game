-- Update Oliver Weinmann to Oliver Weinman (one 'n')
UPDATE teams 
SET name = 'Oliver Weinman' 
WHERE code = 'D' AND name = 'Oliver Weinmann';

-- Update Garching Consulting Club to Garching Consulting Group
UPDATE teams 
SET name = 'Garching Consulting Group' 
WHERE code = 'H' AND (name LIKE '%Club%' OR name = 'Garching Consulting Club');

