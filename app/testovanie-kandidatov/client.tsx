"use client"

import Link from "next/link"

export function ClientPage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 18px", color: "hsl(180, 25%, 25%)" }}>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 15,
          color: "hsl(180, 40%, 30%)",
          border: "1px solid hsl(180, 30%, 75%)",
          background: "hsl(180, 45%, 96%)",
          marginBottom: 24,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "hsl(180, 45%, 92%)"
          e.currentTarget.style.borderColor = "hsl(180, 35%, 65%)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "hsl(180, 45%, 96%)"
          e.currentTarget.style.borderColor = "hsl(180, 30%, 75%)"
        }}
      >
        ← Späť na hlavnú
      </Link>

      <header style={{ marginBottom: 40 }}>
        <p style={{ margin: 0, marginBottom: 12, color: "hsl(180, 35%, 45%)", fontWeight: 600, fontSize: 14 }}>
          Somviac • Testovanie kandidátov
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Testovanie kandidátov: skill testy, screening a porovnanie zručností
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Platforma pre firmy, ktoré chcú rýchlejšie overiť zručnosti kandidátov. Kandidáti vyplnia profil a spravia
          testy. Firmy vidia anonymné profily a výsledky – kontakt prebieha až po dohode.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Čo firma získa</h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Rýchlejší predvýber
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Namiesto pocitov máš dáta: výsledky testov, porovnanie a jasné signály zručností.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Menej rizika v nábore
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              CV je často nejednoznačné. Testy doplnia realitu o praktický výkon.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Anonymita a GDPR
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Kandidát môže byť anonymný až do dohody. Citlivé údaje zostávajú pod kontrolou.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Využitie aj interne
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Retenčné a rozvojové testy pre existujúcich zamestnancov podľa potreby firmy.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Ako to funguje</h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Kandidát</strong> vytvorí profil a doplní informácie (môže
            byť anonymný).
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Kandidát</strong> absolvuje skill testy / hodnotenia
            zručností.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firma</strong> vidí anonymné profily a výsledky a rozhodne
            sa, koho kontaktovať.
          </li>
        </ol>
      </section>

      <section>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Právna poznámka
        </h2>

        <p style={{ margin: 0, lineHeight: 1.75, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          Somviac je online platforma a testovací/filtračný nástroj. Nie sme agentúra dočasného zamestnávania ani
          neposkytujeme sprostredkovanie zamestnania za úhradu. Prípadné poplatky (ak existujú) sú za službu platformy a
          administratívnu/technickú podporu.
        </p>
      </section>
    </main>
  )
}
