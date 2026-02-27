-- =====================================================
-- TradeCheck — Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Order matters: run top-to-bottom
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────
-- 1. PROFILES (base table, linked to Supabase Auth)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'company', 'admin')),
  anonymous_id TEXT UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 99999999)::TEXT, 8, '0'),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'sk' CHECK (language IN ('sk', 'en', 'de')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────
-- 2. WORKER PROFILES
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worker_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

  -- What trade
  trade TEXT NOT NULL CHECK (trade IN ('electrician', 'welder', 'mason', 'carpenter', 'plumber', 'painter', 'mechanic', 'other')),
  trade_specialization TEXT, -- e.g. "silnoprúd", "MIG/MAG", "základy"

  -- Experience
  years_experience INTEGER NOT NULL DEFAULT 0 CHECK (years_experience >= 0 AND years_experience <= 60),

  -- Certifications & qualifications (array of strings)
  certifications TEXT[] DEFAULT '{}',
  -- e.g. ["Elektrotechnická spôsobilosť §21", "Vodičský preukaz B", "Práca vo výškach"]

  -- Equipment & tools known
  tools_known TEXT[] DEFAULT '{}',
  -- e.g. ["Vŕtačka Bosch", "Zváračka MIG", "Dláto a kladivo"]

  -- Work preferences
  work_regions TEXT[] DEFAULT '{}',
  -- e.g. ["Bratislava", "Trnava", "Zahraničie"]
  work_types TEXT[] DEFAULT '{}' CHECK (
    work_types <@ ARRAY['full_time', 'part_time', 'contract', 'project_based']::TEXT[]
  ),
  availability_date DATE,
  expected_salary_min INTEGER, -- EUR/month
  expected_salary_max INTEGER,

  -- Profile visibility
  is_published BOOLEAN DEFAULT FALSE,  -- worker must opt-in to be visible
  profile_views INTEGER DEFAULT 0,

  -- CV completeness tracking
  cv_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER worker_profiles_updated_at
  BEFORE UPDATE ON worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────
-- 3. COMPANY PROFILES
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,           -- "stavebníctvo", "výroba", "údržba"
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '200+')),
  city TEXT,
  region TEXT,
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,  -- admin verifies companies
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER company_profiles_updated_at
  BEFORE UPDATE ON company_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────
-- 4. ASSESSMENT TESTS
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade TEXT NOT NULL CHECK (trade IN ('electrician', 'welder', 'mason', 'carpenter', 'plumber', 'painter', 'mechanic', 'general')),
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER NOT NULL DEFAULT 25,
  passing_score INTEGER NOT NULL DEFAULT 60, -- percentage
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 5. ASSESSMENT QUESTIONS
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES assessment_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single', 'multi', 'scenario')),
  category TEXT NOT NULL CHECK (category IN ('safety', 'theory', 'practical', 'regulation')),
  difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
  order_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT, -- shown after answering
  image_url TEXT,   -- optional diagram/photo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_test_id ON assessment_questions(test_id);

-- ─────────────────────────────────────────────────
-- 6. ASSESSMENT ANSWER OPTIONS
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_options_question_id ON assessment_options(question_id);

-- ─────────────────────────────────────────────────
-- 7. WORKER TEST RESULTS
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worker_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES assessment_tests(id),

  -- Scores
  score_percentage INTEGER NOT NULL CHECK (score_percentage BETWEEN 0 AND 100),
  passed BOOLEAN GENERATED ALWAYS AS (score_percentage >= 60) STORED,

  -- Category breakdown
  category_scores JSONB NOT NULL DEFAULT '{}',
  -- Example: {"safety": 85, "theory": 72, "practical": 91, "regulation": 78}

  -- Career fit (computed after test)
  career_fit JSONB DEFAULT '{}',
  -- Example: {
  --   "recommended_roles": ["Montáž silnoprúd", "Vedenie tímu elektrikárov"],
  --   "not_recommended": ["Projekčné práce", "Revízny technik"],
  --   "strengths": ["Bezpečnosť práce", "Praktické zručnosti"],
  --   "improve": ["Elektrotechnické normy STN"]
  -- }

  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  UNIQUE(worker_id, test_id) -- one result per test per worker
);

CREATE INDEX idx_test_results_worker ON worker_test_results(worker_id);

-- ─────────────────────────────────────────────────
-- 8. UNLOCKED WORKERS (Company pays to see contact)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS unlocked_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL,
  stripe_session_id TEXT,
  amount_paid INTEGER NOT NULL, -- cents (e.g., 2900 = €29)
  currency TEXT DEFAULT 'eur',
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(company_id, worker_id) -- company can only pay once per worker
);

CREATE INDEX idx_unlocked_company ON unlocked_workers(company_id);
CREATE INDEX idx_unlocked_worker ON unlocked_workers(worker_id);

-- ─────────────────────────────────────────────────
-- 9. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_workers ENABLE ROW LEVEL SECURITY;

-- Profiles: users see only their own, admins see all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Worker profiles: owner has full access; companies/admins can see published profiles (anonymized)
CREATE POLICY "Worker can manage own profile" ON worker_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Published workers visible to authenticated users" ON worker_profiles
  FOR SELECT USING (is_published = TRUE AND auth.role() = 'authenticated');

-- Company profiles: owner has full access
CREATE POLICY "Company can manage own profile" ON company_profiles
  FOR ALL USING (auth.uid() = id);

-- Tests: all authenticated users can read active tests
CREATE POLICY "Authenticated users can read tests" ON assessment_tests
  FOR SELECT USING (is_active = TRUE AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read questions" ON assessment_questions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read options" ON assessment_options
  FOR SELECT USING (auth.role() = 'authenticated');

-- Test results: workers see only their own; companies see results of unlocked workers
CREATE POLICY "Workers see own results" ON worker_test_results
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY "Companies see results of unlocked workers" ON worker_test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM unlocked_workers
      WHERE company_id = auth.uid() AND worker_id = worker_test_results.worker_id
    )
  );

-- Unlocked workers: companies see their own unlocks; workers see who unlocked them
CREATE POLICY "Company sees own unlocks" ON unlocked_workers
  FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Worker sees who unlocked them" ON unlocked_workers
  FOR SELECT USING (auth.uid() = worker_id);

-- ─────────────────────────────────────────────────
-- 10. TRIGGER: Auto-create profile on signup
-- ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'worker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
