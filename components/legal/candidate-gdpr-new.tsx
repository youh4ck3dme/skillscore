"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"

const content = {
  sk: {
    title: "INFORMÁCIE O OCHRANE OSOBNÝCH ÚDAJOV (GDPR) – Kandidát",
    operator: "Prevádzkovateľ:",
    effectiveDate: "Dátum účinnosti:",
    agree: "Súhlasím",
    sections: [
      {
        title: "1. Aké údaje spracúvame",
        content: [
          "Identifikátory účtu (e-mail, heslo/hash), jazyk, krajina.",
          "Profil kandidáta (pracovné podmienky, zručnosti, jazyky, vzdelanie, prax, preferencie).",
          "Výsledky testov a metriky (čas, skóre, pokrok).",
          "Údaje o komunikácii cez platformu a logy (IP, zariadenie).",
          "Voliteľne dokumenty/certifikáty nahrané kandidátom.",
        ],
      },
      {
        title: "2. Účely a právne základy",
        content: [
          "Poskytovanie služieb platformy (založenie účtu, profil, testy, zobrazenie firmám): plnenie zmluvy (čl. 6(1)(b) GDPR).",
          "Bezpečnosť a prevencia zneužitia: oprávnený záujem (čl. 6(1)(f)).",
          "Marketing/novinky (ak sa prihlásite): súhlas (čl. 6(1)(a)) – možnosť kedykoľvek odvolať.",
          "Účtovné a právne povinnosti: právna povinnosť (čl. 6(1)(c)).",
        ],
      },
      {
        title: "3. Zdieľanie údajov",
        content: [
          "Firmy (Klienti): až po tom, čo kandidát zdieľa kontakt; následne je firma samostatným prevádzkovateľom.",
          "Recruiteri: ak kandidát prišiel cez referral link, Recruiter vidí stav/progres (bez kontaktu, pokiaľ kandidát nezdieľa).",
          "Sprostredkovatelia (spracovatelia): hosting, databáza, e-mail, analytika, platby (napr. Supabase, Vercel, Resend, Stripe).",
          "Prenosy mimo EHP len pri zabezpečení primeraných záruk (štandardné zmluvné doložky/EÚ rozhodnutie o primeranosti).",
        ],
      },
      {
        title: "4. Automatizované rozhodovanie",
        text: "Testy a ranking môžu používať automatizované hodnotenie. Výsledok nepredstavuje právne účinky; slúži ako podklad pre firmy. Máte právo na ľudský zásah/vysvetlenie a napadnutie výsledku.",
      },
      {
        title: "5. Doba uchovávania",
        content: [
          "Účet a profil: po dobu trvania účtu.",
          "Logy bezpečnosti: typicky 6–24 mesiacov.",
          "Zálohy/fakturácia: podľa zákonných lehôt.",
          "Po zrušení účtu údaje zlikvidujeme/anonymizujeme, ak neexistuje zákonný dôvod na ďalšie spracúvanie.",
        ],
      },
      {
        title: "6. Vaše práva",
        text: "Prístup, oprava, výmaz, obmedzenie, prenesenie, námietka, odvolanie súhlasu. Sťažnosť: ÚOOÚ SR alebo váš miestny dozorný orgán v EÚ.",
      },
      {
        title: "7. Bezpečnosť",
        text: "Implementujeme primerané technické a organizačné opatrenia (šifrovanie, pseudonymizácia, prístupové kontroly, zálohy).",
      },
      {
        title: "8. Kontakt na ochranu súkromia",
        text: "E-mail: oskar.nagy@gmail.com; poštová adresa: Bajzova 1, 821 08 Bratislava. Tel.: 0902 120 258",
      },
    ],
  },
  en: {
    title: "PERSONAL DATA PROTECTION INFORMATION (GDPR) – Candidate",
    operator: "Data Controller:",
    effectiveDate: "Effective date:",
    agree: "I Agree",
    sections: [
      {
        title: "1. What data we process",
        content: [
          "Account identifiers (email, password/hash), language, country.",
          "Candidate profile (work conditions, skills, languages, education, experience, preferences).",
          "Test results and metrics (time, score, progress).",
          "Communication data through the platform and logs (IP, device).",
          "Optionally documents/certificates uploaded by the candidate.",
        ],
      },
      {
        title: "2. Purposes and legal bases",
        content: [
          "Providing platform services (account creation, profile, tests, display to companies): contract performance (Art. 6(1)(b) GDPR).",
          "Security and abuse prevention: legitimate interest (Art. 6(1)(f)).",
          "Marketing/news (if you subscribe): consent (Art. 6(1)(a)) – can be withdrawn at any time.",
          "Accounting and legal obligations: legal obligation (Art. 6(1)(c)).",
        ],
      },
      {
        title: "3. Data sharing",
        content: [
          "Companies (Clients): only after the candidate shares contact; then the company becomes an independent controller.",
          "Recruiters: if the candidate came via referral link, the Recruiter sees status/progress (no contact unless shared by candidate).",
          "Processors: hosting, database, email, analytics, payments (e.g., Supabase, Vercel, Resend, Stripe).",
          "Transfers outside EEA only with appropriate safeguards (standard contractual clauses/EU adequacy decision).",
        ],
      },
      {
        title: "4. Automated decision-making",
        text: "Tests and ranking may use automated evaluation. The result does not have legal effects; it serves as a basis for companies. You have the right to human intervention/explanation and to contest the result.",
      },
      {
        title: "5. Retention period",
        content: [
          "Account and profile: for the duration of the account.",
          "Security logs: typically 6–24 months.",
          "Backups/invoicing: according to legal deadlines.",
          "After account deletion, data is destroyed/anonymized unless there is a legal reason for further processing.",
        ],
      },
      {
        title: "6. Your rights",
        text: "Access, rectification, erasure, restriction, portability, objection, withdrawal of consent. Complaint: Slovak DPA or your local EU supervisory authority.",
      },
      {
        title: "7. Security",
        text: "We implement appropriate technical and organizational measures (encryption, pseudonymization, access controls, backups).",
      },
      {
        title: "8. Privacy contact",
        text: "Email: oskar.nagy@gmail.com; postal address: Bajzova 1, 821 08 Bratislava. Tel.: 0902 120 258",
      },
    ],
  },
  de: {
    title: "DATENSCHUTZINFORMATIONEN (DSGVO) – Kandidat",
    operator: "Verantwortlicher:",
    effectiveDate: "Gültig ab:",
    agree: "Ich stimme zu",
    sections: [
      {
        title: "1. Welche Daten wir verarbeiten",
        content: [
          "Kontokennungen (E-Mail, Passwort/Hash), Sprache, Land.",
          "Kandidatenprofil (Arbeitsbedingungen, Fähigkeiten, Sprachen, Ausbildung, Erfahrung, Präferenzen).",
          "Testergebnisse und Metriken (Zeit, Punktzahl, Fortschritt).",
          "Kommunikationsdaten über die Plattform und Protokolle (IP, Gerät).",
          "Optional vom Kandidaten hochgeladene Dokumente/Zertifikate.",
        ],
      },
      {
        title: "2. Zwecke und Rechtsgrundlagen",
        content: [
          "Bereitstellung von Plattformdiensten (Kontoerstellung, Profil, Tests, Anzeige für Unternehmen): Vertragserfüllung (Art. 6(1)(b) DSGVO).",
          "Sicherheit und Missbrauchsprävention: berechtigtes Interesse (Art. 6(1)(f)).",
          "Marketing/Neuigkeiten (bei Anmeldung): Einwilligung (Art. 6(1)(a)) – jederzeit widerrufbar.",
          "Buchhaltung und rechtliche Verpflichtungen: rechtliche Verpflichtung (Art. 6(1)(c)).",
        ],
      },
      {
        title: "3. Datenweitergabe",
        content: [
          "Unternehmen (Kunden): erst nachdem der Kandidat den Kontakt teilt; dann wird das Unternehmen zum eigenständigen Verantwortlichen.",
          "Recruiter: wenn der Kandidat über einen Empfehlungslink kam, sieht der Recruiter Status/Fortschritt (kein Kontakt, es sei denn, der Kandidat teilt ihn).",
          "Auftragsverarbeiter: Hosting, Datenbank, E-Mail, Analytik, Zahlungen (z.B. Supabase, Vercel, Resend, Stripe).",
          "Übermittlungen außerhalb des EWR nur mit angemessenen Garantien (Standardvertragsklauseln/EU-Angemessenheitsbeschluss).",
        ],
      },
      {
        title: "4. Automatisierte Entscheidungsfindung",
        text: "Tests und Rankings können automatisierte Bewertung verwenden. Das Ergebnis hat keine rechtlichen Auswirkungen; es dient als Grundlage für Unternehmen. Sie haben das Recht auf menschliches Eingreifen/Erklärung und Anfechtung des Ergebnisses.",
      },
      {
        title: "5. Aufbewahrungsdauer",
        content: [
          "Konto und Profil: für die Dauer des Kontos.",
          "Sicherheitsprotokolle: typischerweise 6–24 Monate.",
          "Backups/Rechnungsstellung: gemäß gesetzlichen Fristen.",
          "Nach Kontolöschung werden Daten vernichtet/anonymisiert, es sei denn, es gibt einen rechtlichen Grund für weitere Verarbeitung.",
        ],
      },
      {
        title: "6. Ihre Rechte",
        text: "Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit, Widerspruch, Widerruf der Einwilligung. Beschwerde: Slowakische Datenschutzbehörde oder Ihre lokale EU-Aufsichtsbehörde.",
      },
      {
        title: "7. Sicherheit",
        text: "Wir implementieren angemessene technische und organisatorische Maßnahmen (Verschlüsselung, Pseudonymisierung, Zugriffskontrollen, Backups).",
      },
      {
        title: "8. Datenschutzkontakt",
        text: "E-Mail: oskar.nagy@gmail.com; Postadresse: Bajzova 1, 821 08 Bratislava. Tel.: 0902 120 258",
      },
    ],
  },
}

export function CandidateGDPRNew() {
  const router = useRouter()
  const { language } = useI18n()
  const t = content[language as keyof typeof content] || content.sk

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t.title}</CardTitle>
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">{t.operator}</p>
          <p>SOMVIAC, IČO: 57226202</p>
          <p>Bajzova 1, 821 08 Bratislava</p>
          <p>E-mail: oskar.nagy@gmail.com</p>
          <p>Tel.: 0902 120 258</p>
          <p>Web: www.somviac.com</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t.effectiveDate}{" "}
            {new Date().toLocaleDateString(language === "sk" ? "sk-SK" : language === "de" ? "de-DE" : "en-US")}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-6 pr-4">
            {t.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold text-primary mb-3">{section.title}</h2>
                {section.content ? (
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-4">{section.text}</p>
                )}
              </section>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-center pt-6 mt-6 border-t">
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            {t.agree}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
