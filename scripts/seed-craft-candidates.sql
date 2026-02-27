-- Seed 20 craft/trade candidate profiles for testing (NO auth.users dependency)
-- Remeselnícke profesie bez linkovania na profiles tabuľku

DO $$
DECLARE
  v_slovakia_id uuid;
  v_czech_id uuid;
BEGIN
  -- Get country IDs
  SELECT id INTO v_slovakia_id FROM countries WHERE code = 'SK' LIMIT 1;
  SELECT id INTO v_czech_id FROM countries WHERE code = 'CZ' LIMIT 1;

  -- Insert directly into candidate_profiles without profiles table
  INSERT INTO candidate_profiles (
    residence_country_id,
    work_country_preferences,
    education_level,
    work_experience_years,
    salary_expectation,
    availability_date,
    languages,
    computer_skills,
    work_experience,
    cv_summary,
    auto_contact_enabled,
    created_at,
    updated_at
  )
  VALUES
    -- 1. Senior Elektrikár - silnoprúd
    (v_slovakia_id, ARRAY['SK', 'AT', 'DE'], 'stredoskolske', 12, 2500, CURRENT_DATE + INTERVAL '2 weeks',
     '{"en": {"level": "B1", "name": "English"}, "de": {"level": "A2", "name": "German"}}',
     '["MS Office základy", "AutoCAD elektrické schémy"]',
     '[{"position": "Elektrikár", "company": "Elektro Servis SK", "from": "2012", "to": "2024", "description": "Inštalácie, revízie, NN/VN"}]',
     '{"role": "Elektrikár – silnoprúd", "typ_prace": "Elektrotechnika", "summary": "Senior elektrikár s oprávnením"}',
     true, NOW(), NOW()),

    -- 2. Mid-level Murár/Obkladač
    (v_slovakia_id, ARRAY['SK', 'AT', 'DE'], 'stredoskolske', 6, 2000, CURRENT_DATE + INTERVAL '1 month',
     '{"de": {"level": "B1", "name": "German"}}',
     '[]',
     '[{"position": "Murár", "company": "Stavby XY", "from": "2018", "to": "2024", "description": "Hrubá stavba, obklady"}]',
     '{"role": "Murár / Obkladač", "typ_prace": "Stavebníctvo", "summary": "Murár so skúsenosťami v AT"}',
     true, NOW(), NOW()),

    -- 3. Senior Stolár
    (v_slovakia_id, ARRAY['SK', 'AT'], 'stredoskolske', 10, 2300, CURRENT_DATE,
     '{"de": {"level": "B2", "name": "German"}}',
     '["CNC programovanie"]',
     '[{"position": "Stolár", "company": "Nábytok Plus", "from": "2014", "to": "2024", "description": "Výroba nábytku na mieru"}]',
     '{"role": "Stolár", "typ_prace": "Nábytkárstvo", "summary": "Stolár CNC"}',
     true, NOW(), NOW()),

    -- 4. Junior Zvárač
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 2, 1400, CURRENT_DATE + INTERVAL '2 months',
     '{"en": {"level": "A2", "name": "English"}}',
     '[]',
     '[{"position": "Zvárač", "company": "Kovo MT", "from": "2022", "to": "2024", "description": "MIG/MAG zváranie"}]',
     '{"role": "Zvárač", "typ_prace": "Kovovýroba", "summary": "Junior zvárač MIG/MAG"}',
     true, NOW(), NOW()),

    -- 5. Mid-level Inštalatér/Kúrenár
    (v_slovakia_id, ARRAY['SK', 'AT'], 'stredoskolske', 5, 2100, CURRENT_DATE,
     '{"de": {"level": "A2", "name": "German"}}',
     '[]',
     '[{"position": "Inštalatér", "company": "Aqua Term", "from": "2019", "to": "2024", "description": "Voda, kúrenie, plyn"}]',
     '{"role": "Inštalatér / Kúrenár", "typ_prace": "Inštalácie", "summary": "Inštalatér voda+kúrenie"}',
     true, NOW(), NOW()),

    -- 6. Senior Zámočník/Mechanik
    (v_slovakia_id, ARRAY['SK', 'AT', 'DE'], 'stredoskolske', 11, 2400, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "B1", "name": "English"}, "de": {"level": "B1", "name": "German"}}',
     '["Základy PLC", "Hydraulické schémy"]',
     '[{"position": "Zámočník", "company": "Industry Mach", "from": "2013", "to": "2024", "description": "Montáže strojov, údržba"}]',
     '{"role": "Zámočník / Mechanik", "typ_prace": "Strojárstvo", "summary": "Zámočník montáže+údržba"}',
     true, NOW(), NOW()),

    -- 7. Mid-level Maliar
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 4, 1800, CURRENT_DATE,
     '{}',
     '[]',
     '[{"position": "Maliar", "company": "Color SK", "from": "2020", "to": "2024", "description": "Maľovanie interiérov a fasád"}]',
     '{"role": "Maliar / Natierač", "typ_prace": "Stavebníctvo", "summary": "Maliar interiéry+fasády"}',
     true, NOW(), NOW()),

    -- 8. Senior Klampiar/Pokrývač
    (v_slovakia_id, ARRAY['SK', 'AT', 'DE'], 'stredoskolske', 13, 2600, CURRENT_DATE + INTERVAL '1 month',
     '{"de": {"level": "B2", "name": "German"}}',
     '[]',
     '[{"position": "Klampiar", "company": "Roof Masters", "from": "2011", "to": "2024", "description": "Plechové strechy, krytiny"}]',
     '{"role": "Klampiar / Pokrývač", "typ_prace": "Stavebníctvo", "summary": "Klampiar s AT skúsenosťami"}',
     true, NOW(), NOW()),

    -- 9. Junior Tesár
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 1, 1300, CURRENT_DATE,
     '{}',
     '[]',
     '[{"position": "Tesár", "company": "Wood Build", "from": "2023", "to": "2024", "description": "Debnenie, krovy"}]',
     '{"role": "Tesár", "typ_prace": "Stavebníctvo", "summary": "Junior tesár"}',
     true, NOW(), NOW()),

    -- 10. Mid-level Mechanik údržby
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 5, 1950, CURRENT_DATE + INTERVAL '2 months',
     '{"en": {"level": "B1", "name": "English"}}',
     '["Základy PLC", "MS Office"]',
     '[{"position": "Mechanik údržby", "company": "Production Plant", "from": "2019", "to": "2024", "description": "Údržba výrobných liniek"}]',
     '{"role": "Mechanik údržby", "typ_prace": "Údržba", "summary": "Mechanik údržby výroby"}',
     true, NOW(), NOW()),

    -- 11. Senior Elektrikár - slaboprúd
    (v_slovakia_id, ARRAY['SK', 'AT'], 'stredoskolske', 9, 2400, CURRENT_DATE,
     '{"de": {"level": "B1", "name": "German"}}',
     '["KNX programovanie", "IP kamery"]',
     '[{"position": "Elektrikár slaboprúd", "company": "Security Tech", "from": "2015", "to": "2024", "description": "EZS, CCTV, prístup"}]',
     '{"role": "Elektrikár – slaboprúd", "typ_prace": "Elektrotechnika", "summary": "Elektrikár EZS/CCTV"}',
     true, NOW(), NOW()),

    -- 12. Junior Pomocný pracovník
    (v_slovakia_id, ARRAY['SK'], 'zakladne', 1, 1050, CURRENT_DATE,
     '{}',
     '[]',
     '[{"position": "Pomocník", "company": "Stavby AB", "from": "2023", "to": "2024", "description": "Nosič, pomocník"}]',
     '{"role": "Pomocný stavebný pracovník", "typ_prace": "Stavebníctvo", "summary": "Pomocník na stavbe"}',
     true, NOW(), NOW()),

    -- 13. Mid-level Montér technológií
    (v_slovakia_id, ARRAY['SK', 'AT'], 'stredoskolske', 6, 2100, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "B1", "name": "English"}, "de": {"level": "A2", "name": "German"}}',
     '["Mechanika", "Elektro základy"]',
     '[{"position": "Montér", "company": "Tech Install", "from": "2018", "to": "2024", "description": "Montáže strojov a liniek"}]',
     '{"role": "Montér technológií", "typ_prace": "Montáže", "summary": "Montér strojov"}',
     true, NOW(), NOW()),

    -- 14. Senior Zvárač - TIG/MAG
    (v_slovakia_id, ARRAY['SK', 'AT', 'DE'], 'stredoskolske', 14, 2800, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "B1", "name": "English"}, "de": {"level": "B2", "name": "German"}}',
     '[]',
     '[{"position": "Zvárač", "company": "Welding Pro", "from": "2010", "to": "2024", "description": "TIG, MAG certifikáty"}]',
     '{"role": "Zvárač", "typ_prace": "Kovovýroba", "summary": "Senior zvárač TIG/MAG"}',
     true, NOW(), NOW()),

    -- 15. Mid-level Podlahár
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 5, 2100, CURRENT_DATE,
     '{}',
     '[]',
     '[{"position": "Podlahár", "company": "Floor Systems", "from": "2019", "to": "2024", "description": "Epoxid, PU stierky"}]',
     '{"role": "Podlahár (epoxid/PU)", "typ_prace": "Stavebníctvo", "summary": "Podlahár epoxid/PU"}',
     true, NOW(), NOW()),

    -- 16. Junior Murár
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 1, 1200, CURRENT_DATE + INTERVAL '2 months',
     '{}',
     '[]',
     '[{"position": "Murár", "company": "Build Fast", "from": "2023", "to": "2024", "description": "Murovanie"}]',
     '{"role": "Murár", "typ_prace": "Stavebníctvo", "summary": "Junior murár"}',
     true, NOW(), NOW()),

    -- 17. Senior Stavbyvedúci
    (v_slovakia_id, ARRAY['SK', 'AT'], 'vysokoskolske', 15, 3200, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}, "de": {"level": "B2", "name": "German"}}',
     '["MS Project", "AutoCAD", "BuildPower", "Kros"]',
     '[{"position": "Stavbyvedúci", "company": "Construction Manager", "from": "2009", "to": "2024", "description": "Vedenie stavieb"}]',
     '{"role": "Stavbyvedúci", "typ_prace": "Stavebníctvo", "summary": "Stavbyvedúci senior"}',
     true, NOW(), NOW()),

    -- 18. Mid-level Klampiar
    (v_slovakia_id, ARRAY['SK', 'AT'], 'stredoskolske', 4, 1950, CURRENT_DATE,
     '{"de": {"level": "A2", "name": "German"}}',
     '[]',
     '[{"position": "Klampiar", "company": "Metal Roof", "from": "2020", "to": "2024", "description": "Oplechovanie, strechy"}]',
     '{"role": "Klampiar / Pokrývač", "typ_prace": "Stavebníctvo", "summary": "Klampiar"}',
     true, NOW(), NOW()),

    -- 19. Junior Inštalatér
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 2, 1350, CURRENT_DATE + INTERVAL '2 months',
     '{}',
     '[]',
     '[{"position": "Inštalatér", "company": "Pipe Works", "from": "2022", "to": "2024", "description": "Rozvody vody"}]',
     '{"role": "Inštalatér / Kúrenár", "typ_prace": "Inštalácie", "summary": "Junior inštalatér"}',
     true, NOW(), NOW()),

    -- 20. Mid-level Kvalitár/Kontrolór
    (v_czech_id, ARRAY['CZ', 'SK'], 'stredoskolske', 7, 2200, CURRENT_DATE + INTERVAL '3 weeks',
     '{"en": {"level": "B2", "name": "English"}}',
     '["MS Office", "Meracie prístroje"]',
     '[{"position": "Kontrolór kvality", "company": "Quality Control CZ", "from": "2017", "to": "2024", "description": "Kontrola výroby"}]',
     '{"role": "Kontrolór kvality", "typ_prace": "Kontrola kvality", "summary": "Kvalitár výroba"}',
     true, NOW(), NOW());

  RAISE NOTICE '✓ Created 20 craft/trade test candidate profiles';
END $$;
