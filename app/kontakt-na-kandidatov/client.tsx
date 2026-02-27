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
          Somviac • Kontakt na kandidátov
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Kontakt na kandidátov: anonymné profily a kontakt po dohode
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Firmy najprv vidia anonymné profily a výsledky testov. Kandidát môže zostať anonymný až do dohody. Kontakt sa
          zdieľa až keď to dáva zmysel – podľa nastavení súkromia a pravidiel platformy. Somviac nie je pracovná
          agentúra ani job portál.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Prečo to funguje takto
        </h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Súkromie kandidáta
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Kandidát nezverejňuje kontakt hneď. Zdieľa ho až vtedy, keď chce pokračovať.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Firma vidí zručnosti
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Pred kontaktom vidí firma výsledky testov a profilové informácie bez citlivých údajov.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Menej spamu a chaosu
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Znižuje sa zbytočné kontaktovanie. Oslovenie má väčšiu relevanciu.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              GDPR a kontrola
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Kandidát má kontrolu nad tým, čo zdieľa. Anonymita až do dohody dáva zmysel.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Ako prebieha kontakt
        </h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firma</strong> prezerá anonymné profily a výsledky testov.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firma</strong> vyjadrí záujem o kandidáta (podľa procesov
            platformy).
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Kandidát</strong> sa rozhodne, či a kedy zdieľa kontakt a
            pokračuje.
          </li>
        </ol>
      </section>
    </main>
  )
}
