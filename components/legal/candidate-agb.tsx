"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const content = {
  sk: {
    title: "VŠEOBECNÉ OBCHODNÉ PODMIENKY (VOP/AGB) – Kandidát",
    provider: "Poskytovateľ (SOMVIAC):",
    effectiveDate: "Dátum účinnosti:",
    warning: "Upozornenie: Ide o šablónu. Pred použitím ju nechajte skontrolovať právnikom. Vyplňte zátvorky.",
    sections: [
      {
        title: "1. Povaha služby",
        items: [
          "1.1. SOMVIAC je online platforma a testovací/filtračný nástroj na prepojenie talentov s firmami na základe overených schopností.",
          "1.2. Poskytovateľ nie je agentúra dočasného zamestnávania ani sprostredkovateľ práce. Poplatky (ak existujú) sú za platformové/digitálne služby.",
          "1.3. Kandidátsky profil je anonymný až do chvíle, kým kandidát výslovne nezdieľa kontakt s firmou.",
        ],
      },
      {
        title: "2. Účet a používanie",
        items: [
          "2.1. Kandidát vytvára účet (e‑mail + heslo/Google). Musí poskytovať pravdivé údaje.",
          "2.2. Zakázané je zdieľať účet, obchádzať platformu, pokúšať sa o neoprávnený prístup, nahrávať nepravdivé/porušujúce obsah.",
          "2.3. Platforma je bezplatná pre kandidátov; objednávky testov zadávajú zvyčajne firmy.",
        ],
      },
      {
        title: "3. Testy a výsledky",
        items: [
          "3.1. Základné a pokročilé testy merajú zručnosti; výsledky sa zobrazujú kandidátovi a (po publikovaní profilu) firmám.",
          "3.2. Testy môžu využívať automatizované hodnotenie; kandidát má právo požiadať o vysvetlenie a ľudské posúdenie (pozri GDPR Informácie).",
          "3.3. Nezaručuje sa špecifický výsledok ani prijatie do zamestnania.",
        ],
      },
      {
        title: "4. Viditeľnosť a kontakt",
        items: [
          "4.1. Firmy vidia anonymizované profily s výsledkami testov a zručnosťami.",
          "4.2. Zdieľanie mena/kontaktu nastáva len so súhlasom kandidáta. Po zdieľaní sa firma stáva samostatným prevádzkovateľom jeho údajov.",
        ],
      },
      {
        title: "5. Integrácie a platby",
        items: [
          "5.1. Platforma používa externé služby (napr. hosting, e‑mail, platby) – zoznam je v Informáciách o ochrane osobných údajov.",
          "5.2. Kandidát nemá nárok na provízie z poplatkov firiem ani testov.",
        ],
      },
      {
        title: "6. Duševné vlastníctvo",
        items: [
          "6.1. Platforma a obsah testov sú chránené. Kandidát získava nevýlučné právo používať platformu pre osobné kariérne účely.",
          "6.2. Zákaz reverzného inžinierstva a verejného zdieľania testov.",
        ],
      },
      {
        title: "7. Zodpovednosť a limit náhrady škody",
        items: [
          "7.1. Služby sa poskytujú „ako sú“. Poskytovateľ nezaručuje nepretržitú dostupnosť ani úspech v nábore.",
          "7.2. Limit náhrady škody: súhrnná zodpovednosť Poskytovateľa voči kandidátovi je obmedzená na 100 €, s výnimkou prípadov úmyslu alebo hrubej nedbanlivosti a zodpovednosti, ktorú nemožno vylúčiť podľa práva.",
        ],
      },
      {
        title: "8. Trvanie, predĺženie a ukončenie účtu",
        items: [
          "8.1. Účet kandidáta sa zriaďuje na dobu určitú 12 mesiacov od registrácie.",
          "8.2. Kandidát môže kedykoľvek účet zrušiť (okamžitá deaktivácia; následné vymazanie/anononymizácia údajov podľa GDPR).",
          "8.3. Predĺženie: pred uplynutím doby môže kandidát v nastaveniach účet predĺžiť o ďalších 12 mesiacov; predĺženie je dobrovoľné. Ak nedôjde k predĺženiu, účet po uplynutí doby zanikne/deaktivuje sa.",
          "8.4. Poskytovateľ môže účet pozastaviť alebo zrušiť pri závažnom porušení týchto VOP alebo GDPR pravidiel.",
        ],
      },
      {
        title: "9. Zákaz obchádzania (anti‑circumvention)",
        items: [
          "9.1. Kandidát sa zaväzuje nevyužívať informácie nadobudnuté cez platformu na obchádzanie SOMVIAC (napr. cielené dojednanie spolupráce mimo platformy s cieľom vylúčiť úhradu poplatku firmou alebo porušiť pravidlá anonymity).",
          "9.2. Zmluvná pokuta: za každé preukázané obchádzanie alebo jeho napomáhanie je kandidát povinný uhradiť Poskytovateľovi 5 000 €; tým nie je dotknuté právo na náhradu škody presahujúcej pokutu. Evidenčné obdobie: 12 mesiacov od prvého kontaktu/identifikácie cez platformu.",
        ],
      },
      {
        title: "10. Právo a spory",
        items: [
          "10.1. Rozhodné právo: Slovenská republika.",
          "10.2. Spory sa riešia prednostne rokovaním, inak súdmi podľa sídla Poskytovateľa.",
        ],
      },
    ],
  },
  en: {
    title: "GENERAL TERMS AND CONDITIONS (GTC) – Candidate",
    provider: "Provider (SOMVIAC):",
    effectiveDate: "Effective date:",
    warning: "Notice: This is a template. Have it reviewed by a lawyer before use. Fill in the brackets.",
    sections: [
      {
        title: "1. Nature of Service",
        items: [
          "1.1. SOMVIAC is an online platform and testing/filtering tool for connecting talents with companies based on verified skills.",
          "1.2. The provider is not a temporary employment agency or job intermediary. Fees (if any) are for platform/digital services.",
          "1.3. The candidate profile is anonymous until the candidate explicitly shares contact with a company.",
        ],
      },
      {
        title: "2. Account and Usage",
        items: [
          "2.1. The candidate creates an account (email + password/Google). Must provide truthful information.",
          "2.2. It is prohibited to share the account, circumvent the platform, attempt unauthorized access, upload false/infringing content.",
          "2.3. The platform is free for candidates; test orders are usually placed by companies.",
        ],
      },
      {
        title: "3. Tests and Results",
        items: [
          "3.1. Basic and advanced tests measure skills; results are displayed to the candidate and (after profile publication) to companies.",
          "3.2. Tests may use automated evaluation; the candidate has the right to request explanation and human assessment (see GDPR Information).",
          "3.3. No specific result or employment acceptance is guaranteed.",
        ],
      },
      {
        title: "4. Visibility and Contact",
        items: [
          "4.1. Companies see anonymized profiles with test results and skills.",
          "4.2. Sharing name/contact occurs only with the candidate's consent. After sharing, the company becomes an independent controller of their data.",
        ],
      },
      {
        title: "5. Integrations and Payments",
        items: [
          "5.1. The platform uses external services (e.g., hosting, email, payments) – the list is in the Personal Data Protection Information.",
          "5.2. The candidate is not entitled to commissions from company fees or tests.",
        ],
      },
      {
        title: "6. Intellectual Property",
        items: [
          "6.1. The platform and test content are protected. The candidate receives a non-exclusive right to use the platform for personal career purposes.",
          "6.2. Reverse engineering and public sharing of tests is prohibited.",
        ],
      },
      {
        title: "7. Liability and Damage Limit",
        items: [
          '7.1. Services are provided "as is". The provider does not guarantee continuous availability or recruitment success.',
          "7.2. Damage limit: The provider's aggregate liability to the candidate is limited to €100, except in cases of intent or gross negligence and liability that cannot be excluded by law.",
        ],
      },
      {
        title: "8. Duration, Extension and Account Termination",
        items: [
          "8.1. The candidate's account is established for a fixed period of 12 months from registration.",
          "8.2. The candidate can cancel the account at any time (immediate deactivation; subsequent deletion/anonymization of data according to GDPR).",
          "8.3. Extension: before expiration, the candidate can extend the account in settings for another 12 months; extension is voluntary. If not extended, the account expires/is deactivated.",
          "8.4. The provider may suspend or cancel the account for serious violation of these GTC or GDPR rules.",
        ],
      },
      {
        title: "9. Anti-Circumvention",
        items: [
          "9.1. The candidate agrees not to use information obtained through the platform to circumvent SOMVIAC (e.g., targeted arrangement of cooperation outside the platform to exclude company fee payment or violate anonymity rules).",
          "9.2. Contractual penalty: for each proven circumvention or its facilitation, the candidate must pay the provider €5,000; this does not affect the right to compensation for damages exceeding the penalty. Evidence period: 12 months from first contact/identification through the platform.",
        ],
      },
      {
        title: "10. Law and Disputes",
        items: [
          "10.1. Governing law: Slovak Republic.",
          "10.2. Disputes are resolved preferably by negotiation, otherwise by courts according to the provider's registered office.",
        ],
      },
    ],
  },
  de: {
    title: "ALLGEMEINE GESCHÄFTSBEDINGUNGEN (AGB) – Kandidat",
    provider: "Anbieter (SOMVIAC):",
    effectiveDate: "Gültig ab:",
    warning:
      "Hinweis: Dies ist eine Vorlage. Lassen Sie sie vor der Verwendung von einem Anwalt prüfen. Füllen Sie die Klammern aus.",
    sections: [
      {
        title: "1. Art der Dienstleistung",
        items: [
          "1.1. SOMVIAC ist eine Online-Plattform und ein Test-/Filtertool zur Verbindung von Talenten mit Unternehmen auf Basis verifizierter Fähigkeiten.",
          "1.2. Der Anbieter ist keine Zeitarbeitsfirma oder Arbeitsvermittler. Gebühren (falls vorhanden) sind für Plattform-/Digitaldienstleistungen.",
          "1.3. Das Kandidatenprofil ist anonym, bis der Kandidat ausdrücklich den Kontakt mit einem Unternehmen teilt.",
        ],
      },
      {
        title: "2. Konto und Nutzung",
        items: [
          "2.1. Der Kandidat erstellt ein Konto (E-Mail + Passwort/Google). Muss wahrheitsgemäße Angaben machen.",
          "2.2. Es ist verboten, das Konto zu teilen, die Plattform zu umgehen, unbefugten Zugriff zu versuchen, falsche/verletzende Inhalte hochzuladen.",
          "2.3. Die Plattform ist für Kandidaten kostenlos; Testbestellungen werden in der Regel von Unternehmen aufgegeben.",
        ],
      },
      {
        title: "3. Tests und Ergebnisse",
        items: [
          "3.1. Basis- und Fortgeschrittenentests messen Fähigkeiten; Ergebnisse werden dem Kandidaten und (nach Profilveröffentlichung) Unternehmen angezeigt.",
          "3.2. Tests können automatisierte Bewertung verwenden; der Kandidat hat das Recht, eine Erklärung und menschliche Bewertung anzufordern (siehe DSGVO-Informationen).",
          "3.3. Es wird kein spezifisches Ergebnis oder eine Einstellungszusage garantiert.",
        ],
      },
      {
        title: "4. Sichtbarkeit und Kontakt",
        items: [
          "4.1. Unternehmen sehen anonymisierte Profile mit Testergebnissen und Fähigkeiten.",
          "4.2. Die Weitergabe von Name/Kontakt erfolgt nur mit Zustimmung des Kandidaten. Nach der Weitergabe wird das Unternehmen zum eigenständigen Verantwortlichen seiner Daten.",
        ],
      },
      {
        title: "5. Integrationen und Zahlungen",
        items: [
          "5.1. Die Plattform nutzt externe Dienste (z.B. Hosting, E-Mail, Zahlungen) – die Liste befindet sich in den Datenschutzinformationen.",
          "5.2. Der Kandidat hat keinen Anspruch auf Provisionen aus Unternehmensgebühren oder Tests.",
        ],
      },
      {
        title: "6. Geistiges Eigentum",
        items: [
          "6.1. Die Plattform und Testinhalte sind geschützt. Der Kandidat erhält ein nicht-exklusives Recht zur Nutzung der Plattform für persönliche Karrierezwecke.",
          "6.2. Reverse Engineering und öffentliches Teilen von Tests ist verboten.",
        ],
      },
      {
        title: "7. Haftung und Schadensbegrenzung",
        items: [
          '7.1. Dienstleistungen werden "wie besehen" erbracht. Der Anbieter garantiert keine kontinuierliche Verfügbarkeit oder Rekrutierungserfolg.',
          "7.2. Schadensbegrenzung: Die Gesamthaftung des Anbieters gegenüber dem Kandidaten ist auf 100 € begrenzt, außer bei Vorsatz oder grober Fahrlässigkeit und Haftung, die gesetzlich nicht ausgeschlossen werden kann.",
        ],
      },
      {
        title: "8. Dauer, Verlängerung und Kontobeendigung",
        items: [
          "8.1. Das Konto des Kandidaten wird für einen festen Zeitraum von 12 Monaten ab Registrierung eingerichtet.",
          "8.2. Der Kandidat kann das Konto jederzeit kündigen (sofortige Deaktivierung; anschließende Löschung/Anonymisierung der Daten gemäß DSGVO).",
          "8.3. Verlängerung: Vor Ablauf kann der Kandidat das Konto in den Einstellungen um weitere 12 Monate verlängern; die Verlängerung ist freiwillig. Wenn nicht verlängert, läuft das Konto ab/wird deaktiviert.",
          "8.4. Der Anbieter kann das Konto bei schwerwiegendem Verstoß gegen diese AGB oder DSGVO-Regeln aussetzen oder kündigen.",
        ],
      },
      {
        title: "9. Umgehungsverbot",
        items: [
          "9.1. Der Kandidat verpflichtet sich, über die Plattform gewonnene Informationen nicht zur Umgehung von SOMVIAC zu nutzen (z.B. gezielte Vereinbarung einer Zusammenarbeit außerhalb der Plattform, um die Gebührenzahlung des Unternehmens auszuschließen oder Anonymitätsregeln zu verletzen).",
          "9.2. Vertragsstrafe: Für jede nachgewiesene Umgehung oder deren Unterstützung muss der Kandidat dem Anbieter 5.000 € zahlen; dies berührt nicht das Recht auf Schadensersatz, der die Strafe übersteigt. Nachweiszeitraum: 12 Monate ab erstem Kontakt/Identifikation über die Plattform.",
        ],
      },
      {
        title: "10. Recht und Streitigkeiten",
        items: [
          "10.1. Anwendbares Recht: Slowakische Republik.",
          "10.2. Streitigkeiten werden vorzugsweise durch Verhandlung gelöst, andernfalls durch Gerichte am Sitz des Anbieters.",
        ],
      },
    ],
  },
}

export function CandidateAGB() {
  const { language } = useI18n()
  const router = useRouter()
  const t = content[language as keyof typeof content] || content.sk

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold text-primary">{t.title}</CardTitle>
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">{t.provider}</p>
          <p>SOMVIAC, IČO: 57226202</p>
          <p>Bajzova 1, 821 08 Bratislava</p>
          <p>E-mail: oskar.nagy@gmail.com</p>
          <p>Tel.: 0902 120 258</p>
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
                {section.items.map((item, i) => (
                  <p key={i} className="mb-2">
                    {item}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
