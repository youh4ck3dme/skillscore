-- SQL script to cleanup and normalize invalid profile names
-- This will fix existing profiles with inappropriate or test names

-- Update profiles with offensive or invalid first names
UPDATE profiles
SET 
  first_name = CASE
    WHEN user_type = 'candidate' THEN 'Kandidát'
    WHEN user_type = 'recruiter' THEN 'Rekrúter'
    WHEN user_type = 'company' THEN company_name
    ELSE 'Používateľ'
  END,
  updated_at = NOW()
WHERE 
  first_name IS NULL 
  OR first_name = '' 
  OR LOWER(first_name) LIKE '%kokotko%'
  OR LOWER(first_name) LIKE '%kokot%'
  OR LOWER(first_name) LIKE '%test%'
  OR LOWER(first_name) LIKE '%asdf%'
  OR LOWER(first_name) = 'xxx'
  OR first_name ~ '\d' -- contains numbers
  OR LENGTH(first_name) < 2;

-- Update profiles with invalid last names for candidates/recruiters
UPDATE profiles
SET 
  last_name = 'Nové Meno',
  updated_at = NOW()
WHERE 
  (user_type = 'candidate' OR user_type = 'recruiter')
  AND (
    last_name IS NULL 
    OR last_name = '' 
    OR LOWER(last_name) LIKE '%kokotko%'
    OR LOWER(last_name) LIKE '%test%'
    OR last_name ~ '\d'
    OR LENGTH(last_name) < 2
  );

-- Log affected profiles
SELECT 
  id,
  email,
  user_type,
  first_name,
  last_name,
  updated_at
FROM profiles
WHERE updated_at > NOW() - INTERVAL '1 minute'
ORDER BY updated_at DESC;
