-- Create table to track unlocked candidate profiles
CREATE TABLE IF NOT EXISTS unlocked_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coins_paid INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, candidate_id)
);

-- Add RLS policies
ALTER TABLE unlocked_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own unlocked profiles"
  ON unlocked_profiles FOR SELECT
  USING (auth.uid() = company_id);

CREATE POLICY "Companies can insert their own unlocked profiles"
  ON unlocked_profiles FOR INSERT
  WITH CHECK (auth.uid() = company_id);

-- Add index for faster lookups
CREATE INDEX idx_unlocked_profiles_company ON unlocked_profiles(company_id);
CREATE INDEX idx_unlocked_profiles_candidate ON unlocked_profiles(candidate_id);
