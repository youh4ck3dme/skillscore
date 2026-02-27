# Template pre vygenerovanie pricing_items dát

## Požiadavka pre AI:

Vygeneruj SQL INSERT statements pre tabuľku `pricing_items` s nasledujúcou štruktúrou:

### Schéma tabuľky:
```sql
CREATE TABLE pricing_items (
  id UUID PRIMARY KEY,
  country TEXT NOT NULL,           -- Krajina
  role TEXT NOT NULL,              -- Pozícia/Povolanie
  work_type TEXT NOT NULL,         -- Typ práce (Remote/Office/Hybrid)
  price_junior NUMERIC,            -- Cena pre Junior (0-2 roky)
  price_standard NUMERIC,          -- Cena pre Standard (2-5 rokov)
  price_senior NUMERIC,            -- Cena pre Senior (5+ rokov)
  source_url TEXT
);
```

### Krajiny (17):
Belgicko, Cesko, Dansko, Finsko, Francuzsko, Holandsko, Luxemburg, Madarsko, Nemecko, Polsko, Portugalsko, Rakusko, Slovensko, Spanielsko, Svajciarsko, Svedsko, Taliansko

### Pozície/Povolania (role) - príklady:
- IT Developer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- DevOps Engineer
- Data Analyst
- UX/UI Designer
- Product Manager
- Project Manager
- QA Tester
- System Administrator
- Network Engineer
- Security Specialist
- Business Analyst
- Scrum Master

### Typ práce (work_type):
- Remote (práca na diaľku)
- Office (kancelária)
- Hybrid (kombinované)

### Cenová logika:
- Vyššia cena pre: Švajciarsko, Nemecko, Luxemburg, Holandsko, Švédsko, Dánsko
- Stredná cena pre: Rakúsko, Belgicko, Fínsko, Francúzsko
- Nižšia cena pre: Česko, Slovensko, Poľsko, Maďarsko, Portugalsko, Španielsko, Taliansko
- Remote typicky o 10-20% lacnejšie ako Office
- Hybrid medzi Remote a Office

### Príklad záznamu:
```sql
INSERT INTO pricing_items (id, country, role, work_type, price_junior, price_standard, price_senior, source_url)
VALUES 
  (gen_random_uuid(), 'Slovensko', 'IT Developer', 'Remote', 1800, 2800, 4200, NULL),
  (gen_random_uuid(), 'Slovensko', 'IT Developer', 'Office', 2000, 3000, 4500, NULL),
  (gen_random_uuid(), 'Slovensko', 'IT Developer', 'Hybrid', 1900, 2900, 4300, NULL);
```

### Požiadavka:
Vygeneruj kompletný SQL INSERT pre VŠETKY kombinácie:
- 17 krajín × 15 pozícií × 3 typy práce = 765 záznamov
- Každý záznam musí mať realistické ceny podľa krajiny a typu práce
- Ceny by mali byť mesačné v eurách
