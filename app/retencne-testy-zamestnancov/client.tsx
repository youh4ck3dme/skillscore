"use client"

import Link from "next/link"

export default function RetenčnéTestyPageClient() {
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
          Somviac • Retenčné testy zamestnancov
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Retenčné testy zamestnancov: interné testovanie zručností a rozvoj tímov
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Firmy môžu používať Somviac aj interne: na retenčné testy, mapovanie zručností a meranie progresu. Cieľom je
          mať objektívne dáta o schopnostiach tímu a plánovať rozvoj. Somviac nie je pracovná agentúra ani job board.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Čo firma získa</h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Mapa zručností tímu
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Vidíš, kde má tím silné stránky a kde sú kompetenčné diery.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Plán rozvoja a školení
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Výsledky testov pomôžu nastaviť školenia podľa reality, nie podľa dojmu.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Meranie progresu
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Opakované testy ukážu, či sa zručnosti zlepšujú a kde to stojí.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Podpora retencie
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Rozvojové plány a transparentnosť kompetencií znižujú frustráciu a odchody.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Ako to funguje</h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firma</strong> nastaví oblasti testovania (kompetencie,
            role, úrovne).
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Zamestnanci</strong> absolvujú testy podľa pravidiel firmy.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firma</strong> vyhodnotí výsledky a nastaví rozvoj /
            školenia / interné presuny.
          </li>
        </ol>
      </section>
    </main>
  )
}
