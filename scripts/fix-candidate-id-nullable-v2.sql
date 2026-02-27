-- Remove NOT NULL constraint from candidate_id column
-- This allows assigning tests to emails without existing candidate accounts

ALTER TABLE company_test_assignments 
ALTER COLUMN candidate_id DROP NOT NULL;

-- Verify the check constraint exists (from previous migration)
-- If not, add it now
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_candidate_identifier'
  ) THEN
    ALTER TABLE company_test_assignments
    ADD CONSTRAINT check_candidate_identifier 
    CHECK (candidate_id IS NOT NULL OR candidate_email IS NOT NULL);
  END IF;
END $$;
