"use client"

import Link from "next/link"

export default function AnonymnyProfilClient() {
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
          Somviac • Anonymný profil
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Anonymný profil kandidáta: kontrola údajov, GDPR a overenie zručností
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Kandidát môže začať anonymne: vytvorí profil, doplní skúsenosti a overí zručnosti testami. Firmy vidia
          anonymné profily a výsledky testov – kontakt a zdieľanie citlivých údajov prebieha až po dohode. Somviac nie
          je pracovná agentúra ani pracovný portál.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Prečo anonymita dáva zmysel
        </h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Menej stresu pre kandidáta
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Profil môže byť anonymný, kým sa nerozhodneš pokračovať. Nemusíš hneď zverejňovať citlivé údaje.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Firma vidí zručnosti
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Testy a profil ukážu schopnosti bez potreby identity. Firma sa rozhoduje na základe dát, nie dojmov.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              GDPR a kontrola zdieľania
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Kandidát má pod kontrolou, čo zdieľa a kedy. Citlivé údaje sa riešia až po dohode.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Transparentný proces
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Profil → testy → prípadný kontakt. Žiadne skryté „magické" kroky.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Ako to funguje</h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Vytvoríš anonymný profil</strong> – skúsenosti, preferencie,
            zručnosti (bez citlivých údajov).
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Overíš zručnosti testami</strong> – výsledky sa priradia k
            profilu.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Kontakt po dohode</strong> – keď to dáva zmysel, môžeš
            zdieľať kontakt a pokračovať.
          </li>
        </ol>
      </section>

      <section>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Právna poznámka
        </h2>

        <p style={{ margin: 0, lineHeight: 1.75, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          Somviac je online platforma a testovací/filtračný nástroj. Nie sme pracovná agentúra ani sprostredkovateľ
          zamestnania za úhradu. Platforma slúži na profil a overenie zručností; dohody prebiehajú mimo platformy.
        </p>
      </section>
    </main>
  )
}
