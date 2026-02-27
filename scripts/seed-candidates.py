"""
Seed script to create 40 test candidate profiles:
- 20 IT/Office workers
- 20 Craft workers

Run: python scripts/seed-candidates.py
"""

import os
from supabase import create_client, Client
from datetime import datetime, timedelta
import random
import uuid

# Initialize Supabase client
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

# Helper to get country UUIDs
def get_country_ids():
    response = supabase.table("countries").select("id, code").execute()
    return {country["code"]: country["id"] for country in response.data}

# Helper to get profession group UUIDs
def get_profession_groups():
    response = supabase.table("profession_groups").select("id, name_sk").execute()
    return {group["name_sk"]: group["id"] for group in response.data}

print("🔄 Loading reference data...")
countries = get_country_ids()
profession_groups = get_profession_groups()

# Ensure we have Slovakia
sk_id = countries.get("SK")
if not sk_id:
    print("❌ Slovakia not found in countries table")
    exit(1)

print(f"✅ Loaded {len(countries)} countries and {len(profession_groups)} profession groups")

# IT/Office candidates data
it_candidates = [
    {
        "first_name": "Martin", "last_name": "Novák", "email": "martin.novak.test@example.sk",
        "phone": "+421901234501", "job_group": "IT a telekomunikácie", "job_subgroup": "Programovanie a vývoj",
        "role": "Full-Stack Developer", "typ_prace": "TPP", "experience_years": 8, "salary": 3200,
        "languages": {"sk": "native", "en": "C1", "de": "B1"}, "city": "Bratislava"
    },
    {
        "first_name": "Jana", "last_name": "Kováčová", "email": "jana.kovacova.test@example.sk",
        "phone": "+421901234502", "job_group": "IT a telekomunikácie", "job_subgroup": "Programovanie a vývoj",
        "role": "Frontend Developer", "typ_prace": "TPP", "experience_years": 5, "salary": 2400,
        "languages": {"sk": "native", "en": "B2"}, "city": "Košice"
    },
    {
        "first_name": "Peter", "last_name": "Horváth", "email": "peter.horvath.test@example.sk",
        "phone": "+421901234503", "job_group": "IT a telekomunikácie", "job_subgroup": "Systémová administrácia",
        "role": "DevOps Engineer", "typ_prace": "TPP", "experience_years": 6, "salary": 2800,
        "languages": {"sk": "native", "en": "C1"}, "city": "Žilina"
    },
    {
        "first_name": "Lucia", "last_name": "Varga", "email": "lucia.varga.test@example.sk",
        "phone": "+421901234504", "job_group": "IT a telekomunikácie", "job_subgroup": "Testovanie",
        "role": "QA Engineer", "typ_prace": "TPP", "experience_years": 4, "salary": 2000,
        "languages": {"sk": "native", "en": "B2"}, "city": "Nitra"
    },
    {
        "first_name": "Tomáš", "last_name": "Balog", "email": "tomas.balog.test@example.sk",
        "phone": "+421901234505", "job_group": "IT a telekomunikácie", "job_subgroup": "Programovanie a vývoj",
        "role": "Backend Developer", "typ_prace": "TPP", "experience_years": 10, "salary": 3600,
        "languages": {"sk": "native", "en": "C2", "de": "B2"}, "city": "Bratislava"
    },
    {
        "first_name": "Simona", "last_name": "Takáč", "email": "simona.takac.test@example.sk",
        "phone": "+421901234506", "job_group": "Dizajn a kreativita", "job_subgroup": "UX/UI dizajn",
        "role": "UX/UI Designer", "typ_prace": "TPP", "experience_years": 5, "salary": 2200,
        "languages": {"sk": "native", "en": "B2"}, "city": "Bratislava"
    },
    {
        "first_name": "Michal", "last_name": "Lukáč", "email": "michal.lukac.test@example.sk",
        "phone": "+421901234507", "job_group": "IT a telekomunikácie", "job_subgroup": "Programovanie a vývoj",
        "role": "Mobile Developer", "typ_prace": "TPP", "experience_years": 4, "salary": 2600,
        "languages": {"sk": "native", "en": "C1"}, "city": "Trnava"
    },
    {
        "first_name": "Katarína", "last_name": "Pospíšil", "email": "katarina.pospisil.test@example.sk",
        "phone": "+421901234508", "job_group": "Manažment a administratíva", "job_subgroup": "Projektový manažment",
        "role": "Project Manager", "typ_prace": "TPP", "experience_years": 7, "salary": 2800,
        "languages": {"sk": "native", "en": "C1", "de": "A2"}, "city": "Bratislava"
    },
    {
        "first_name": "Ján", "last_name": "Beňo", "email": "jan.beno.test@example.sk",
        "phone": "+421901234509", "job_group": "IT a telekomunikácie", "job_subgroup": "Dátová analýza",
        "role": "Data Analyst", "typ_prace": "TPP", "experience_years": 3, "salary": 2200,
        "languages": {"sk": "native", "en": "B2"}, "city": "Košice"
    },
    {
        "first_name": "Eva", "last_name": "Molnár", "email": "eva.molnar.test@example.sk",
        "phone": "+421901234510", "job_group": "Ľudské zdroje a personalistika", "job_subgroup": "HR manažment",
        "role": "HR Specialist", "typ_prace": "TPP", "experience_years": 5, "salary": 1800,
        "languages": {"sk": "native", "en": "B2"}, "city": "Bratislava"
    },
    {
        "first_name": "Filip", "last_name": "Kratochvíl", "email": "filip.kratochvil.test@example.sk",
        "phone": "+421901234511", "job_group": "IT a telekomunikácie", "job_subgroup": "Programovanie a vývoj",
        "role": "Junior Frontend Developer", "typ_prace": "TPP", "experience_years": 1, "salary": 1200,
        "languages": {"sk": "native", "en": "B1"}, "city": "Žilina"
    },
    {
        "first_name": "Monika", "last_name": "Štefan", "email": "monika.stefan.test@example.sk",
        "phone": "+421901234512", "job_group": "Obchod a predaj", "job_subgroup": "Account management",
        "role": "Sales Representative", "typ_prace": "TPP", "experience_years": 4, "salary": 1600,
        "languages": {"sk": "native", "en": "B2", "de": "B1"}, "city": "Bratislava"
    },
    {
        "first_name": "Andrej", "last_name": "Urban", "email": "andrej.urban.test@example.sk",
        "phone": "+421901234513", "job_group": "Marketing a komunikácia", "job_subgroup": "Digitálny marketing",
        "role": "Digital Marketing Specialist", "typ_prace": "TPP", "experience_years": 3, "salary": 1800,
        "languages": {"sk": "native", "en": "C1"}, "city": "Košice"
    },
    {
        "first_name": "Zuzana", "last_name": "Dubček", "email": "zuzana.dubcek.test@example.sk",
        "phone": "+421901234514", "job_group": "Financie a účtovníctvo", "job_subgroup": "Účtovníctvo",
        "role": "Accountant", "typ_prace": "TPP", "experience_years": 6, "salary": 2000,
        "languages": {"sk": "native", "en": "B1"}, "city": "Trnava"
    },
    {
        "first_name": "Marek", "last_name": "Gašpar", "email": "marek.gaspar.test@example.sk",
        "phone": "+421901234515", "job_group": "IT a telekomunikácie", "job_subgroup": "Kybernetická bezpečnosť",
        "role": "Security Engineer", "typ_prace": "TPP", "experience_years": 7, "salary": 3200,
        "languages": {"sk": "native", "en": "C1"}, "city": "Bratislava"
    },
    {
        "first_name": "Nikola", "last_name": "Pavlík", "email": "nikola.pavlik.test@example.sk",
        "phone": "+421901234516", "job_group": "Manažment a administratíva", "job_subgroup": "Administratíva",
        "role": "Office Administrator", "typ_prace": "TPP", "experience_years": 2, "salary": 1000,
        "languages": {"sk": "native", "en": "A2"}, "city": "Nitra"
    },
    {
        "first_name": "Radovan", "last_name": "Blažek", "email": "radovan.blazek.test@example.sk",
        "phone": "+421901234517", "job_group": "IT a telekomunikácie", "job_subgroup": "Dátová analýza",
        "role": "Business Analyst", "typ_prace": "TPP", "experience_years": 5, "salary": 2400,
        "languages": {"sk": "native", "en": "B2"}, "city": "Bratislava"
    },
    {
        "first_name": "Daniela", "last_name": "Marko", "email": "daniela.marko.test@example.sk",
        "phone": "+421901234518", "job_group": "Marketing a komunikácia", "job_subgroup": "Obsahový marketing",
        "role": "Content Writer", "typ_prace": "Polovičný úväzok", "experience_years": 3, "salary": 800,
        "languages": {"sk": "native", "en": "C1"}, "city": "Košice"
    },
    {
        "first_name": "Vladimír", "last_name": "Lacko", "email": "vladimir.lacko.test@example.sk",
        "phone": "+421901234519", "job_group": "IT a telekomunikácie", "job_subgroup": "IT podpora",
        "role": "IT Support Specialist", "typ_prace": "TPP", "experience_years": 2, "salary": 1400,
        "languages": {"sk": "native", "en": "B1"}, "city": "Žilina"
    },
    {
        "first_name": "Ingrid", "last_name": "Nemec", "email": "ingrid.nemec.test@example.sk",
        "phone": "+421901234520", "job_group": "Obchod a predaj", "job_subgroup": "Obchodný manažment",
        "role": "Sales Manager", "typ_prace": "TPP", "experience_years": 9, "salary": 3000,
        "languages": {"sk": "native", "en": "C1", "de": "B2"}, "city": "Bratislava"
    }
]

# Craft workers data
craft_candidates = [
    {
        "first_name": "Jozef", "last_name": "Kováč", "email": "jozef.kovac.test@example.sk",
        "phone": "+421901235001", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Elektroinštalácie",
        "role": "Elektrikár", "typ_prace": "TPP", "experience_years": 12, "salary": 2400,
        "languages": {"sk": "native", "de": "B1"}, "city": "Bratislava"
    },
    {
        "first_name": "Matej", "last_name": "Novotný", "email": "matej.novotny.test@example.sk",
        "phone": "+421901235002", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Murárstvo",
        "role": "Murár", "typ_prace": "TPP", "experience_years": 10, "salary": 2200,
        "languages": {"sk": "native", "de": "A2"}, "city": "Trnava"
    },
    {
        "first_name": "Pavol", "last_name": "Mach", "email": "pavol.mach.test@example.sk",
        "phone": "+421901235003", "job_group": "Výroba a remeselná výroba", "job_subgroup": "Stolárstvo",
        "role": "Stolár", "typ_prace": "TPP", "experience_years": 15, "salary": 2600,
        "languages": {"sk": "native", "de": "B2"}, "city": "Nitra"
    },
    {
        "first_name": "Róbert", "last_name": "Fabian", "email": "robert.fabian.test@example.sk",
        "phone": "+421901235004", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Zváračstvo",
        "role": "Zvárač", "typ_prace": "TPP", "experience_years": 8, "salary": 2000,
        "languages": {"sk": "native", "de": "B1"}, "city": "Košice"
    },
    {
        "first_name": "Miroslav", "last_name": "Tóth", "email": "miroslav.toth.test@example.sk",
        "phone": "+421901235005", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Inštalatérstvo",
        "role": "Inštalatér - vykurovanie", "typ_prace": "TPP", "experience_years": 7, "salary": 1900,
        "languages": {"sk": "native", "de": "A2"}, "city": "Žilina"
    },
    {
        "first_name": "Ľubomír", "last_name": "Čech", "email": "lubomir.cech.test@example.sk",
        "phone": "+421901235006", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Mechanika",
        "role": "Mechanik", "typ_prace": "TPP", "experience_years": 11, "salary": 2300,
        "languages": {"sk": "native", "de": "B1"}, "city": "Bratislava"
    },
    {
        "first_name": "Dušan", "last_name": "Nagy", "email": "dusan.nagy.test@example.sk",
        "phone": "+421901235007", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Maľovanie",
        "role": "Maliar - natierač", "typ_prace": "TPP", "experience_years": 5, "salary": 1600,
        "languages": {"sk": "native", "de": "A1"}, "city": "Trnava"
    },
    {
        "first_name": "Stanislav", "last_name": "Baláž", "email": "stanislav.balaz.test@example.sk",
        "phone": "+421901235008", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Klampiarske práce",
        "role": "Klampiar", "typ_prace": "TPP", "experience_years": 9, "salary": 2100,
        "languages": {"sk": "native", "de": "B1"}, "city": "Košice"
    },
    {
        "first_name": "Ladislav", "last_name": "Beneš", "email": "ladislav.benes.test@example.sk",
        "phone": "+421901235009", "job_group": "Výroba a remeselná výroba", "job_subgroup": "Stolárstvo",
        "role": "Tesár", "typ_prace": "TPP", "experience_years": 13, "salary": 2500,
        "languages": {"sk": "native", "de": "B2"}, "city": "Nitra"
    },
    {
        "first_name": "Branislav", "last_name": "Černý", "email": "branislav.cerny.test@example.sk",
        "phone": "+421901235010", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Zámočníctvo",
        "role": "Zámočník", "typ_prace": "TPP", "experience_years": 6, "salary": 1800,
        "languages": {"sk": "native"}, "city": "Žilina"
    },
    {
        "first_name": "Igor", "last_name": "Hudák", "email": "igor.hudak.test@example.sk",
        "phone": "+421901235011", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Elektroinštalácie",
        "role": "Elektrikár - junior", "typ_prace": "TPP", "experience_years": 2, "salary": 1200,
        "languages": {"sk": "native"}, "city": "Bratislava"
    },
    {
        "first_name": "Jaroslav", "last_name": "Holub", "email": "jaroslav.holub.test@example.sk",
        "phone": "+421901235012", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Murárstvo",
        "role": "Murár - junior", "typ_prace": "TPP", "experience_years": 1, "salary": 1000,
        "languages": {"sk": "native"}, "city": "Trnava"
    },
    {
        "first_name": "Karol", "last_name": "Kollár", "email": "karol.kollar.test@example.sk",
        "phone": "+421901235013", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Zváračstvo",
        "role": "Zvárač TIG/MIG", "typ_prace": "TPP", "experience_years": 14, "salary": 2800,
        "languages": {"sk": "native", "de": "B2"}, "city": "Košice"
    },
    {
        "first_name": "Milan", "last_name": "Petrovič", "email": "milan.petrovic.test@example.sk",
        "phone": "+421901235014", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Inštalatérstvo",
        "role": "Inštalatér - vodoinštalácie", "typ_prace": "TPP", "experience_years": 8, "salary": 2000,
        "languages": {"sk": "native", "de": "A2"}, "city": "Nitra"
    },
    {
        "first_name": "Norbert", "last_name": "Richter", "email": "norbert.richter.test@example.sk",
        "phone": "+421901235015", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Stavbyvedúci",
        "role": "Stavbyvedúci", "typ_prace": "TPP", "experience_years": 12, "salary": 3400,
        "languages": {"sk": "native", "de": "C1"}, "city": "Bratislava"
    },
    {
        "first_name": "Ondrej", "last_name": "Šimko", "email": "ondrej.simko.test@example.sk",
        "phone": "+421901235016", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Mechanika",
        "role": "CNC operátor", "typ_prace": "TPP", "experience_years": 4, "salary": 1600,
        "languages": {"sk": "native"}, "city": "Žilina"
    },
    {
        "first_name": "Patrik", "last_name": "Lengyel", "email": "patrik.lengyel.test@example.sk",
        "phone": "+421901235017", "job_group": "Kvalita a kontrola", "job_subgroup": "Kontrola kvality",
        "role": "Kontrolór kvality", "typ_prace": "TPP", "experience_years": 5, "salary": 1700,
        "languages": {"sk": "native", "en": "B1"}, "city": "Košice"
    },
    {
        "first_name": "Rastislav", "last_name": "Šoltés", "email": "rastislav.soltes.test@example.sk",
        "phone": "+421901235018", "job_group": "Stavebníctvo a remeslá", "job_subgroup": "Maľovanie",
        "role": "Maliar - fasády", "typ_prace": "TPP", "experience_years": 7, "salary": 1800,
        "languages": {"sk": "native", "de": "A2"}, "city": "Trnava"
    },
    {
        "first_name": "Slavomír", "last_name": "Vavro", "email": "slavomir.vavro.test@example.sk",
        "phone": "+421901235019", "job_group": "Výroba a remeselná výroba", "job_subgroup": "Stolárstvo",
        "role": "Stolár - nábytok", "typ_prace": "TPP", "experience_years": 6, "salary": 1900,
        "languages": {"sk": "native"}, "city": "Nitra"
    },
    {
        "first_name": "Tibor", "last_name": "Zvara", "email": "tibor.zvara.test@example.sk",
        "phone": "+421901235020", "job_group": "Strojárenstvo a údržba", "job_subgroup": "Mechanika",
        "role": "Mechanik - údržbár", "typ_prace": "TPP", "experience_years": 9, "salary": 2100,
        "languages": {"sk": "native", "de": "B1"}, "city": "Bratislava"
    }
]

def create_candidate(candidate_data):
    """Create a single candidate profile"""
    try:
        candidate_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        # Prepare work country preferences (UUID array)
        work_countries = [sk_id]
        if "de" in candidate_data["languages"]:
            de_id = countries.get("DE")
            if de_id:
                work_countries.append(de_id)
        if "en" in candidate_data["languages"] and candidate_data["languages"]["en"] in ["B2", "C1", "C2"]:
            at_id = countries.get("AT")
            if at_id:
                work_countries.append(at_id)
        
        # Insert into candidate_profiles
        profile_data = {
            "id": candidate_id,
            "first_name": candidate_data["first_name"],
            "last_name": candidate_data["last_name"],
            "email": candidate_data["email"],
            "phone": candidate_data.get("phone"),
            "city": candidate_data.get("city"),
            "country": "Slovensko",
            "expected_salary": candidate_data["salary"],
            "work_country_preferences": work_countries,
            "created_at": now,
            "updated_at": now,
            "cv_summary": {
                "role": candidate_data["role"],
                "typ_prace": candidate_data["typ_prace"]
            }
        }
        
        supabase.table("candidate_profiles").insert(profile_data).execute()
        
        # Insert into candidate_cv_data
        cv_data = {
            "candidate_id": candidate_id,
            "job_group": candidate_data["job_group"],
            "job_subgroup": candidate_data["job_subgroup"],
            "typ_prace": [candidate_data["typ_prace"]],
            "languages": candidate_data["languages"],
            "experience_years": candidate_data["experience_years"],
            "expected_salary": candidate_data["salary"],
            "available_from": (datetime.now() + timedelta(days=random.randint(0, 60))).date().isoformat(),
            "created_at": now,
            "updated_at": now
        }
        
        supabase.table("candidate_cv_data").insert(cv_data).execute()
        
        return True, candidate_data["email"]
        
    except Exception as e:
        return False, f"{candidate_data['email']}: {str(e)}"

# Create all candidates
print("\n🚀 Creating IT/Office candidates...")
it_success = 0
it_errors = []

for candidate in it_candidates:
    success, message = create_candidate(candidate)
    if success:
        it_success += 1
        print(f"  ✅ {message}")
    else:
        it_errors.append(message)
        print(f"  ❌ {message}")

print(f"\n✅ Created {it_success}/{len(it_candidates)} IT/Office candidates")

print("\n🚀 Creating Craft candidates...")
craft_success = 0
craft_errors = []

for candidate in craft_candidates:
    success, message = create_candidate(candidate)
    if success:
        craft_success += 1
        print(f"  ✅ {message}")
    else:
        craft_errors.append(message)
        print(f"  ❌ {message}")

print(f"\n✅ Created {craft_success}/{len(craft_candidates)} Craft candidates")

print(f"\n🎉 TOTAL: {it_success + craft_success}/40 candidates created successfully")

if it_errors or craft_errors:
    print("\n❌ Errors:")
    for error in it_errors + craft_errors:
        print(f"  - {error}")
