-- Seed 20 IT/office candidate profiles for testing (NO auth.users dependency)
-- Creates test candidates directly in candidate_profiles without touching profiles table

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
    -- 1. Senior Full-Stack Developer
    (v_slovakia_id, ARRAY['SK', 'CZ', 'AT'], 'vysokoskolske', 8, 3500, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}, "de": {"level": "B1", "name": "German"}}',
     '["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"]',
     '[{"position": "Senior Developer", "company": "Tech Solutions", "from": "2019", "to": "2024", "description": "Full-stack development"}]',
     '{"role": "Full-Stack Developer", "typ_prace": "Vývoj softvéru", "summary": "Experienced full-stack developer"}',
     true, NOW(), NOW()),
    
    -- 2. Mid-level Frontend Developer
    (v_slovakia_id, ARRAY['SK', 'CZ'], 'vysokoskolske', 4, 2200, CURRENT_DATE + INTERVAL '2 weeks',
     '{"en": {"level": "B2", "name": "English"}}',
     '["Vue.js", "JavaScript", "HTML", "CSS", "Tailwind"]',
     '[{"position": "Frontend Developer", "company": "WebStudio", "from": "2020", "to": "2024"}]',
     '{"role": "Frontend Developer", "typ_prace": "Vývoj softvéru", "summary": "Frontend specialist"}',
     true, NOW(), NOW()),

    -- 3. Junior Backend Developer
    (v_slovakia_id, ARRAY['SK'], 'vysokoskolske', 1, 1500, CURRENT_DATE,
     '{"en": {"level": "B1", "name": "English"}}',
     '["Python", "Django", "PostgreSQL"]',
     '[{"position": "Junior Developer", "company": "StartupLab", "from": "2023", "to": "2024"}]',
     '{"role": "Backend Developer", "typ_prace": "Vývoj softvéru", "summary": "Junior backend dev"}',
     true, NOW(), NOW()),

    -- 4. Senior Project Manager
    (v_slovakia_id, ARRAY['SK', 'CZ', 'DE'], 'vysokoskolske', 10, 3800, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}, "de": {"level": "B2", "name": "German"}}',
     '["MS Project", "Jira", "Agile"]',
     '[{"position": "Project Manager", "company": "Enterprise Corp", "from": "2014", "to": "2024"}]',
     '{"role": "Projektový manažér", "typ_prace": "Riadenie projektov", "summary": "Senior PM"}',
     true, NOW(), NOW()),

    -- 5. Mid-level DevOps Engineer  
    (v_slovakia_id, ARRAY['SK', 'AT'], 'vysokoskolske', 5, 2800, CURRENT_DATE + INTERVAL '3 weeks',
     '{"en": {"level": "B2", "name": "English"}}',
     '["AWS", "Docker", "Kubernetes", "Terraform"]',
     '[{"position": "DevOps Engineer", "company": "Cloud Systems", "from": "2019", "to": "2024"}]',
     '{"role": "DevOps Engineer", "typ_prace": "IT infraštruktúra", "summary": "DevOps specialist"}',
     true, NOW(), NOW()),

    -- 6. Senior Data Analyst
    (v_czech_id, ARRAY['CZ', 'SK'], 'vysokoskolske', 7, 3200, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}}',
     '["Python", "SQL", "Tableau", "Power BI"]',
     '[{"position": "Senior Data Analyst", "company": "Analytics Pro", "from": "2017", "to": "2024"}]',
     '{"role": "Dátový analytik", "typ_prace": "Analýza dát", "summary": "Senior analyst"}',
     true, NOW(), NOW()),

    -- 7. Junior UX/UI Designer
    (v_slovakia_id, ARRAY['SK', 'CZ'], 'vysokoskolske', 2, 1600, CURRENT_DATE,
     '{"en": {"level": "B2", "name": "English"}}',
     '["Figma", "Adobe XD", "Sketch"]',
     '[{"position": "UX Designer", "company": "DesignHub", "from": "2022", "to": "2024"}]',
     '{"role": "UX/UI Designer", "typ_prace": "Dizajn", "summary": "UX designer"}',
     true, NOW(), NOW()),

    -- 8. Mid-level QA Engineer
    (v_slovakia_id, ARRAY['SK'], 'vysokoskolske', 4, 2000, CURRENT_DATE + INTERVAL '2 weeks',
     '{"en": {"level": "B2", "name": "English"}}',
     '["Selenium", "Cypress", "Jest"]',
     '[{"position": "QA Engineer", "company": "Quality Systems", "from": "2020", "to": "2024"}]',
     '{"role": "QA tester", "typ_prace": "Testovanie", "summary": "QA engineer"}',
     true, NOW(), NOW()),

    -- 9. Senior Mobile Developer
    (v_czech_id, ARRAY['CZ', 'SK', 'AT'], 'vysokoskolske', 9, 3600, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}}',
     '["React Native", "Swift", "Kotlin"]',
     '[{"position": "Mobile Developer", "company": "MobileApps", "from": "2015", "to": "2024"}]',
     '{"role": "Mobile Developer", "typ_prace": "Vývoj aplikácií", "summary": "Senior mobile dev"}',
     true, NOW(), NOW()),

    -- 10. Mid-level Marketing Manager
    (v_slovakia_id, ARRAY['SK', 'CZ'], 'vysokoskolske', 5, 2400, CURRENT_DATE + INTERVAL '3 weeks',
     '{"en": {"level": "C1", "name": "English"}}',
     '["Google Analytics", "SEO", "Facebook Ads"]',
     '[{"position": "Marketing Manager", "company": "Marketing Pro", "from": "2019", "to": "2024"}]',
     '{"role": "Marketing manažér", "typ_prace": "Marketing", "summary": "Marketing manager"}',
     true, NOW(), NOW()),

    -- 11. Junior Accountant
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 1, 1200, CURRENT_DATE,
     '{"en": {"level": "A2", "name": "English"}}',
     '["MS Excel", "SAP"]',
     '[{"position": "Accountant", "company": "Accounting Services", "from": "2023", "to": "2024"}]',
     '{"role": "Účtovník", "typ_prace": "Účtovníctvo", "summary": "Junior accountant"}',
     true, NOW(), NOW()),

    -- 12. Senior HR Manager
    (v_slovakia_id, ARRAY['SK', 'CZ'], 'vysokoskolske', 12, 2800, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "B2", "name": "English"}}',
     '["HR Management", "Recruitment"]',
     '[{"position": "HR Manager", "company": "HR Solutions", "from": "2012", "to": "2024"}]',
     '{"role": "HR manažér", "typ_prace": "HR", "summary": "Senior HR"}',
     true, NOW(), NOW()),

    -- 13. Mid-level Sales Representative
    (v_czech_id, ARRAY['CZ', 'SK'], 'stredoskolske', 6, 1800, CURRENT_DATE + INTERVAL '2 weeks',
     '{"en": {"level": "B1", "name": "English"}}',
     '["CRM", "Salesforce"]',
     '[{"position": "Sales Rep", "company": "Sales Corp", "from": "2018", "to": "2024"}]',
     '{"role": "Obchodný zástupca", "typ_prace": "Predaj", "summary": "Sales rep"}',
     true, NOW(), NOW()),

    -- 14. Junior Customer Support
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 1, 1000, CURRENT_DATE,
     '{"en": {"level": "B1", "name": "English"}}',
     '["Zendesk", "LiveChat"]',
     '[{"position": "Customer Support", "company": "Support Center", "from": "2023", "to": "2024"}]',
     '{"role": "Zákaznícka podpora", "typ_prace": "Podpora", "summary": "Support specialist"}',
     true, NOW(), NOW()),

    -- 15. Senior System Administrator
    (v_slovakia_id, ARRAY['SK', 'AT'], 'vysokoskolske', 11, 3200, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "B2", "name": "English"}}',
     '["Linux", "Windows Server", "VMware"]',
     '[{"position": "System Admin", "company": "IT Infrastructure", "from": "2013", "to": "2024"}]',
     '{"role": "Systémový administrátor", "typ_prace": "IT infraštruktúra", "summary": "Senior sysadmin"}',
     true, NOW(), NOW()),

    -- 16. Mid-level Content Writer
    (v_czech_id, ARRAY['CZ', 'SK'], 'vysokoskolske', 4, 1600, CURRENT_DATE + INTERVAL '3 weeks',
     '{"en": {"level": "C1", "name": "English"}}',
     '["WordPress", "SEO", "Copywriting"]',
     '[{"position": "Content Writer", "company": "Content Agency", "from": "2020", "to": "2024"}]',
     '{"role": "Copywriter", "typ_prace": "Copywriting", "summary": "Content writer"}',
     true, NOW(), NOW()),

    -- 17. Junior Graphic Designer
    (v_slovakia_id, ARRAY['SK'], 'stredoskolske', 2, 1300, CURRENT_DATE,
     '{"en": {"level": "B1", "name": "English"}}',
     '["Photoshop", "Illustrator"]',
     '[{"position": "Graphic Designer", "company": "Design Studio", "from": "2022", "to": "2024"}]',
     '{"role": "Grafický dizajnér", "typ_prace": "Dizajn", "summary": "Graphic designer"}',
     true, NOW(), NOW()),

    -- 18. Senior Business Analyst
    (v_slovakia_id, ARRAY['SK', 'CZ', 'AT'], 'vysokoskolske', 9, 3400, CURRENT_DATE + INTERVAL '1 month',
     '{"en": {"level": "C1", "name": "English"}, "de": {"level": "B1", "name": "German"}}',
     '["SQL", "Power BI", "Excel"]',
     '[{"position": "Business Analyst", "company": "Consulting Firm", "from": "2015", "to": "2024"}]',
     '{"role": "Business analytik", "typ_prace": "Analýza", "summary": "Senior analyst"}',
     true, NOW(), NOW()),

    -- 19. Mid-level Network Engineer
    (v_slovakia_id, ARRAY['SK'], 'vysokoskolske', 5, 2600, CURRENT_DATE + INTERVAL '2 weeks',
     '{"en": {"level": "B2", "name": "English"}}',
     '["Cisco", "Routing", "Switching"]',
     '[{"position": "Network Engineer", "company": "Network Solutions", "from": "2019", "to": "2024"}]',
     '{"role": "Sieťový technik", "typ_prace": "Sieťová správa", "summary": "Network engineer"}',
     true, NOW(), NOW()),

    -- 20. Junior Administrative Assistant
    (v_czech_id, ARRAY['CZ'], 'stredoskolske', 1, 1100, CURRENT_DATE,
     '{"en": {"level": "A2", "name": "English"}}',
     '["MS Office", "Google Workspace"]',
     '[{"position": "Admin Assistant", "company": "Office Corp", "from": "2023", "to": "2024"}]',
     '{"role": "Administratívny pracovník", "typ_prace": "Administratíva", "summary": "Admin assistant"}',
     true, NOW(), NOW());

  RAISE NOTICE '✓ Created 20 IT/office test candidate profiles';
END $$;
