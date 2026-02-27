-- Fix saved_candidates table to use anonymous_id (TEXT) instead of UUID

-- Drop existing foreign key constraint if it exists
ALTER TABLE saved_candidates 
DROP CONSTRAINT IF EXISTS saved_candidates_candidate_id_fkey;

-- Change candidate_id column type from UUID to TEXT
ALTER TABLE saved_candidates 
ALTER COLUMN candidate_id TYPE TEXT USING candidate_id::TEXT;

-- Add index for performance on anonymous_id lookups
CREATE INDEX IF NOT EXISTS idx_saved_candidates_candidate_id 
ON saved_candidates(candidate_id);

-- Add comment to clarify the column stores anonymous_id
COMMENT ON COLUMN saved_candidates.candidate_id IS 'Stores candidate anonymous_id (e.g., 64141329) instead of UUID';
