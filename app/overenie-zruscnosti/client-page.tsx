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
          Somviac • Overené zručnosti
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Overené zručnosti: viac než len text v životopise
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Somviac umožňuje kandidátom doplniť profil o overené zručnosti pomocou testov. Firmy vidia výsledky anonymne a
          rozhodujú sa na základe dát, nie len pocitu z CV. Neponúkame pracovné miesta ani sprostredkovanie zamestnania.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Prečo sú overené zručnosti dôležité
        </h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>Objektivita</h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Výsledky testov dávajú firmám porovnateľný a jasný signál o úrovni schopností.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Menej chaosu v nábore
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Menej hádania, viac dát. Firmy sa rozhodujú na základe zručností, nie len slov.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Anonymita kandidáta
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Identita zostáva skrytá, kým sa obe strany nedohodnú pokračovať.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Využitie aj interne
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Overenie zručností je vhodné aj pre rozvoj alebo retenčné testy zamestnancov.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Ako overenie funguje
        </h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>Kandidát vyplní profil a zvolí testy.</li>
          <li>Testy overia konkrétne zručnosti.</li>
          <li>Firma vidí výsledky na anonymnom profile.</li>
        </ol>
      </section>
    </main>
  )
}
