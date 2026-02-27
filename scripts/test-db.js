const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkTable(tableName) {
    const res = await fetch(`${URL}/rest/v1/${tableName}?limit=1`, {
        headers: {
            "apikey": KEY,
            "Authorization": `Bearer ${KEY}`
        }
    });

    if (res.status === 200 || res.status === 401 || res.status === 403) {
        console.log(`✅ Tabuľka '${tableName}' existuje (HTTP ${res.status})`);
        return true;
    }

    if (res.status === 404) {
        console.log(`❌ Tabuľka '${tableName}' NEEXISTUJE (HTTP 404)`);
        return false;
    }

    console.log(`⚠️ Tabuľka '${tableName}': Neznámy stav (HTTP ${res.status})`);
    return false;
}

async function runTests() {
    console.log("==================================================");
    console.log("🔍 SKILLSCORE — VEĽKÝ TEST DATABÁZY (REST API)");
    console.log("==================================================\n");

    const tables = [
        "profiles",
        "worker_profiles",
        "company_profiles",
        "assessment_tests",
        "assessment_questions",
        "assessment_options",
        "worker_test_results",
        "unlocked_workers",
    ];

    let missing = 0;
    for (const t of tables) {
        const exists = await checkTable(t);
        if (!exists) missing++;
    }

    if (missing > 0) {
        console.log(`\n❌ ZLYHANIE: Chýba ${missing} tabuliek. Skúste spustiť schému znova.`);
    } else {
        console.log(`\n🎉 VÝSLEDOK: Všetky tabuľky existujú! Databáza je pripravená.`);
    }
}

runTests();
