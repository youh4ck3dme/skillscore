-- Vytvorenie základných tabuliek pre Test Engine

-- 1. Tabuľka pre Testy (Hlavička testu)
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- napr. 'Zvárač', 'Elektrikár'
    time_limit_minutes INTEGER DEFAULT 30,
    passing_score_percentage INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabuľka pre Otázky
CREATE TYPE question_type AS ENUM ('single_choice', 'multiple_choice');

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    q_type question_type DEFAULT 'single_choice',
    points INTEGER DEFAULT 1,
    order_num INTEGER NOT NULL DEFAULT 0, -- Poradie otázky v teste
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabuľka pre Možnosti odpovedí
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_num INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabuľka pre Pokusy o test (Test Attempts)
CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed', 'abandoned');

CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    score_earned NUMERIC(5,2), -- Získané body
    max_score NUMERIC(5,2),    -- Maximálne body z testu v danom čase
    percentage_score NUMERIC(5,2),
    status attempt_status DEFAULT 'in_progress',
    passed BOOLEAN, -- Ci dosiahol aspon passing_score_percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabuľka pre odpovede používateľa počas pokusu
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(attempt_id, question_id, option_id) -- Nemôže vybrať tú istú možnosť viackrát v jednom pokuse
);

-- --- INDEXY ---
CREATE INDEX idx_tests_category ON public.tests(category);
CREATE INDEX idx_questions_test_id ON public.questions(test_id);
CREATE INDEX idx_options_question_id ON public.options(question_id);
CREATE INDEX idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX idx_test_attempts_test_id ON public.test_attempts(test_id);

-- --- ROW LEVEL SECURITY (RLS) ---
-- Zapnutie RLS pre všetky tabuľky
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Politiky pre Tests: Všetci autentifikovaní môžu čítať aktívne testy. Iba admin môže upravovať.
CREATE POLICY "Users can view active tests" ON public.tests FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Politiky pre Questions a Options: Užívatelia môžu čítať otázky a možnosti iba pre test, do ktorého sa prihlásili (ale pre zjednodušenie teraz dovolíme všetkým čítať)
CREATE POLICY "Users can view questions" ON public.questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can view options" ON public.options FOR SELECT USING (auth.role() = 'authenticated');

-- Politiky pre Test_Attempts: Užívateľ môže vidieť, vytvárať a upravovať iba svoje vlastné pokusy
CREATE POLICY "Users can view their own attempts" ON public.test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attempts" ON public.test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attempts" ON public.test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Politiky pre User_Answers: Len majiteľ attempt_id môže pridávať/čítať odpovede
CREATE POLICY "Users can insert answers for own attempts" ON public.user_answers FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.test_attempts WHERE id = attempt_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view own answers" ON public.user_answers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.test_attempts WHERE id = attempt_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own answers" ON public.user_answers FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.test_attempts WHERE id = attempt_id AND user_id = auth.uid())
);

-- --- MOCK DÁTA PRE RÝCHLY TEST ---
-- Vložíme 1 test
INSERT INTO public.tests (id, title, description, category, time_limit_minutes, passing_score_percentage) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Základy bezpečnosti pri zváraní', 'Základný test na overenie bezpečnostných noriem pre zváračov.', 'Zvárač', 15, 75)
ON CONFLICT DO NOTHING;

-- Vložíme 2 otázky pre test
INSERT INTO public.questions (id, test_id, question_text, q_type, points, order_num) 
VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Aký hasiaci prístroj je VŽDY zakázané použiť na hasenie zariadení pod elektrickým prúdom?', 'single_choice', 10, 1),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Aké ochranné pomôcky sú povinné pri zváraní elektrickým oblúkom?', 'multiple_choice', 10, 2)
ON CONFLICT DO NOTHING;

-- Možnosti pre otázku 1
INSERT INTO public.options (question_id, option_text, is_correct, order_num) VALUES
('22222222-2222-2222-2222-222222222221', 'Snehový (CO2)', false, 1),
('22222222-2222-2222-2222-222222222221', 'Práškový', false, 2),
('22222222-2222-2222-2222-222222222221', 'Vodný', true, 3); -- Správne je Vodný

-- Možnosti pre otázku 2
INSERT INTO public.options (question_id, option_text, is_correct, order_num) VALUES
('22222222-2222-2222-2222-222222222222', 'Zváračská kukla s príslušným filtrom', true, 1),
('22222222-2222-2222-2222-222222222222', 'Bavlnené rukavice s voľnou štruktúrou', false, 2),
('22222222-2222-2222-2222-222222222222', 'Ochranný kožený odev / zástera', true, 3),
('22222222-2222-2222-2222-222222222222', 'Slnečné okuliare s UV Ochranným faktorom 400', false, 4);
