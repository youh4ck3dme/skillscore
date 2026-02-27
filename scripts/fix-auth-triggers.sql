-- 1. Odstránenie všetkých starých triggerov, ktoré by mohli robiť problémy
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_candidate ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_company ON auth.users;

-- 2. Odstránenie starých funkcií
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_candidate();

-- 3. Vytvorenie novej, bezpečnej funkcie s ON CONFLICT ignorovaním
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'worker')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ak by zlyhal insert profilu, nezablať prihlásenie používateľa
  -- Vypíše to chybu do logu Supabase Postgresu, ale účet sa vytvorí
  RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Priradenie funkcie len na jeden trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
