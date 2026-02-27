"use client"

import Link from "next/link"

export default function PageClient() {
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
          Somviac • Práca v zahraničí
        </p>

        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 42, lineHeight: 1.15, color: "hsl(180, 45%, 20%)" }}>
          Profil pre prácu v zahraničí: zručnosti overené testami a kontakt od firiem
        </h1>

        <p style={{ margin: 0, color: "hsl(180, 20%, 35%)", fontSize: 18, lineHeight: 1.65 }}>
          Somviac nie je pracovná agentúra ani pracovný portál. Je to platforma, kde si vytvoríš kandidátsky profil (aj
          anonymný), overíš zručnosti testami a firmy ťa môžu na základe profilu a výsledkov kontaktovať. Pracovné
          ponuky ani prácu priamo nesprostredkúvame.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Prečo Somviac</h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Profil, ktorý firmy vedia vyhľadať
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Nejde len o PDF životopis. Vyplníš skúsenosti, preferencie a zručnosti tak, aby firmy vedeli rýchlo
              pochopiť, čo ponúkaš.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Overenie zručností testami
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Testy pridajú profilu dôveryhodný signál. Firma vidí výsledky a vie lepšie posúdiť zhodu na pozíciu alebo
              typ práce.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Anonymita a kontrola údajov
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Profil môže byť anonymný. Ty rozhoduješ, kedy a komu dáš citlivé údaje. Zmysel to má hlavne v úvode, kým
              si nie si istý spoluprácou.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Firmy kontaktujú teba
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Namiesto posielania CV na desiatky miest si spravíš profil a firmy, ktoré hľadajú podobné zručnosti, ťa
              môžu osloviť.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>Ako to funguje</h2>

        <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.9, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Vytvoríš kandidátsky profil</strong> – skúsenosti,
            preferencie, krajiny, jazyk.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Overíš zručnosti testami</strong> – pridáš výsledky, ktoré
            firmy vedia porovnať.
          </li>
          <li>
            <strong style={{ color: "hsl(180, 40%, 28%)" }}>Firmy ťa môžu kontaktovať</strong> – a ty sa rozhodneš, ako
            ďalej a čo zdieľaš.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Práca v zahraničí: čo ľudia najčastejšie riešia
        </h2>

        <p style={{ margin: 0, lineHeight: 1.75, color: "hsl(180, 20%, 35%)", fontSize: 17 }}>
          Pri hľadaní práce v zahraničí je problém často v tom, že firmy nevidia reálne zručnosti – iba text v CV.
          Somviac rieši práve to: profil + testy = jasnejší obraz pre firmu. Ty si pritom držíš kontrolu nad údajmi a
          môžeš zostať anonymný až do dohody.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 28, lineHeight: 1.2, color: "hsl(180, 45%, 22%)" }}>
          Dôvera a bezpečie
        </h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              GDPR a kontrola zdieľania
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Ty rozhoduješ, čo firma uvidí. Začať môžeš anonymne a zdieľať citlivé údaje až neskôr.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: "hsl(180, 40%, 28%)" }}>
              Transparentné pravidlá
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: "hsl(180, 20%, 35%)" }}>
              Platforma je na profily a testy. Nie sme agentúra, neposkytujeme pracovné ponuky a nevystupujeme ako
              sprostredkovateľ zamestnania.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
