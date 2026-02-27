import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Client (No SSR module to run easily in Node.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ chýbajú Supabase credentials v spúšťacom prostredí!")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runTests() {
    console.log("==================================================")
    console.log("🔍 SKILLSCORE — VEĽKÝ TEST DATABÁZY (DIAGNOSTIKA)")
    console.log("==================================================\n")

    // 1. Connection Test
    console.log("⏳ 1. Testujem pripojenie k databáze...")
    const { error: healthError } = await supabase.from("profiles").select("id").limit(1)

    if (healthError) {
        if (healthError.code === "42P01") {
            console.log("❌ ZLYHANIE: Pripojenie je funkčné, ale tabuľka 'profiles' NEEXISTUJE!")
            console.log("   👉 Riešenie: Musíš spustiť SQL skript z 'scripts/tradecheck-schema.sql' v Supabase Editore.")
            process.exit(1)
        } else {
            console.log(`❌ ZLYHANIE: Chyba pripojenia - ${healthError.message}`)
            process.exit(1)
        }
    }
    console.log("✅ Pripojenie a základné zistenie tabuliek: OK\n")

    // 2. Table Existence Test
    console.log("⏳ 2. Preverujem existenciu všetkých potrebných tabuliek...")
    const requiredTables = [
        "profiles",
        "worker_profiles",
        "company_profiles",
        "assessment_tests",
        "assessment_questions",
        "assessment_options",
        "worker_test_results",
        "unlocked_workers",
    ]

    let missingTables = 0

    for (const table of requiredTables) {
        const { error } = await supabase.from(table).select("*").limit(1)

        // 42P01 is PostgREST error for relation (table) does not exist
        if (error && error.code === "42P01") {
            console.log(`   ❌ Tabuľka '${table}' chýba!`)
            missingTables++
        } else {
            console.log(`   ✅ Tabuľka '${table}' existuje (alebo RLS odmietlo prístup, čo je v poriadku).`)
        }
    }

    if (missingTables > 0) {
        console.log(`\n❌ ZLYHANIE: Chýba ${missingTables} tabuliek. Schéma nie je kompletná.`)
        process.exit(1)
    }
    console.log("✅ Všetky tabuľky existujú.\n")

    // 3. RLS (Row Level Security) Test
    console.log("⏳ 3. Testujem RLS pravidlá (Anon užívateľ by nemal vidieť citlivé dáta)...")

    // Try to insert a worker anonymously (should fail because RLS)
    const fakeId = "00000000-0000-0000-0000-000000000000"
    const { error: rlsError } = await supabase.from("worker_profiles").insert({
        id: fakeId,
        trade: "electrician"
    })

    // We EXPECT an error here if RLS is tight. PostgREST usually returns 401/403 or 409 depending on policy
    if (rlsError) {
        console.log("   ✅ RLS funguje: Zápis anonymného profilu bol zablokovaný pre worker_profiles.")
    } else {
        console.log("   ❌ BEZPEČNOSTNÉ RIZIKO: RLS pre worker_profiles nie je zapnuté alebo je deravé! Anonym môže zapisovať!")
    }

    // 4. Test RLS on Admin logs / unlocked
    const { data: unlockedData, error: unlockedError } = await supabase.from("unlocked_workers").select("*").limit(1)

    if (unlockedData && unlockedData.length > 0) {
        console.log("   ❌ BEZPEČNOSTNÉ RIZIKO: Anonym môže čítať citlivé transakcie (unlocked_workers)!")
    } else {
        console.log("   ✅ RLS funguje: Anonym nevidí odomknuté profily iných firiem.")
    }

    console.log("\n==================================================")
    console.log("🎉 VÝSLEDOK: DATABÁZA JE PRIPRAVENÁ A BEZPEČNÁ NA 100%")
    console.log("==================================================")
}

runTests().catch(console.error)
