-- Add candidate_uuid column to saved_candidates for test assignment
-- This stores the real UUID of the candidate for API calls that need it

ALTER TABLE saved_candidates 
ADD COLUMN IF NOT EXISTS candidate_uuid uuid;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_candidates_candidate_uuid 
ON saved_candidates(candidate_uuid);

-- Update existing records by looking up UUID from candidate_profiles
UPDATE saved_candidates sc
SET candidate_uuid = cp.id
FROM candidate_profiles cp
WHERE sc.candidate_id = cp.anonymous_id
AND sc.candidate_uuid IS NULL;
