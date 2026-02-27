-- Add cv_summary column to saved_candidates table to store candidate CV data
-- This allows companies to view CV without accessing candidate_profiles table

ALTER TABLE saved_candidates 
ADD COLUMN IF NOT EXISTS cv_summary JSONB;

-- Add comment explaining the column
COMMENT ON COLUMN saved_candidates.cv_summary IS 'Stores candidate CV summary data when added to shortlist. Allows companies to view CV without accessing candidate_profiles table (which has RLS restrictions).';
