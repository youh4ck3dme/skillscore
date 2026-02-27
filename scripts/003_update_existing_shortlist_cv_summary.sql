-- Script to update existing saved_candidates records with cv_summary from candidate_profiles
-- This is needed for records created before the cv_summary column was added

UPDATE saved_candidates sc
SET cv_summary = cp.cv_summary
FROM candidate_profiles cp
WHERE sc.cv_summary IS NULL
  AND sc.candidate_id = cp.anonymous_id
  AND cp.cv_summary IS NOT NULL;

-- For UUID-based candidate_ids (old format), try matching by id
UPDATE saved_candidates sc
SET cv_summary = cp.cv_summary
FROM candidate_profiles cp
WHERE sc.cv_summary IS NULL
  AND sc.candidate_id::uuid = cp.id
  AND cp.cv_summary IS NOT NULL;
