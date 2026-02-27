-- Add candidate_email column to company_test_assignments table
-- This allows assigning tests to email addresses that don't have accounts yet

ALTER TABLE company_test_assignments 
ADD COLUMN IF NOT EXISTS candidate_email TEXT;

-- Add index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_company_test_assignments_candidate_email 
ON company_test_assignments(candidate_email);

-- Add check constraint: either candidate_id OR candidate_email must be present
ALTER TABLE company_test_assignments
ADD CONSTRAINT check_candidate_identifier 
CHECK (candidate_id IS NOT NULL OR candidate_email IS NOT NULL);
