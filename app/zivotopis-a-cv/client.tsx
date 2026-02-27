"use client"

import Link from "next/link"

export default function ClientPage() {
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
          Somviac • Životopis a CV
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Životopis a CV, ktoré majú zmysel: profil + testy zručností + anonymita
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Somviac nie je pracovná agentúra. Kandidáti si vytvoria profil (aj anonymný), doplnia CV a overia zručnosti
          testami. Firmy vidia anonymné profily a výsledky a môžu kandidátov kontaktovať po dohode.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Prečo „CV + testy" funguje lepšie než len CV
        </h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Štruktúrovaný profil
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Firmy vedia filtrovať podľa skúseností, preferencií, jazyka a zručností – nie len podľa PDF.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Overenie zručností
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Testy pridajú dôveryhodný signál. Firma vidí viac než len „viem X" v texte.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Anonymita až do dohody
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Citlivé údaje držíš pod kontrolou. Zdieľaš ich až keď to dáva zmysel.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Rýchlejší kontakt
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Firmy si vedia vybrať relevantné profily a kontaktovať kandidáta bez zbytočných krokov.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Ako si pripraviť profil (3 kroky)
        </h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Vyplň profil a CV</strong> – skúsenosti, jazyk, zručnosti,
            preferencie.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Urob testy</strong> – pridáš overenie a lepšiu
            porovnateľnosť.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Nechaj sa nájsť</strong> – firmy si pozrú anonymný profil a
            ozvú sa po dohode.
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
