"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

const content = {
  sk: {
    title: "Obchodné podmienky",
    validFrom: "Platné od: 1. januára 2025",
    agree: "Súhlasím",
    contactTitle: "Kontakt pre otázky týkajúce sa obchodných podmienok:",
    sections: [
      {
        title: "1. Základné ustanovenia",
        text: 'Tieto obchodné podmienky upravujú vzťah medzi poskytovateľom služby SOMVIAC (ďalej len "poskytovateľ") a užívateľom platformy (ďalej len "užívateľ").',
        provider: {
          label: "Poskytovateľ:",
          name: "Oskar Nagy",
          address: "Bajzova 1, 821 08 Bratislava",
          ico: "IČO: 57226202",
          tel: "Tel: 0902 120 258",
          email: "Email: oskar.nagy@gmail.com",
          web: "Web: www.somviac.com",
        },
      },
      {
        title: "2. Predmet služieb",
        text: "Poskytovateľ prevádzkuje online platformu pre testovanie a hodnotenie kandidátov, ktorá zahŕňa:",
        items: [
          "Psychometrické testy (SJT, verbálne, numerické, logické)",
          "Hodnotenie pracovných zručností a kompetencií",
          "Správu kandidátskych profilov a CV",
          "Komunikáciu medzi kandidátmi a zamestnávateľmi",
          "Systém coinov a odmien",
        ],
      },
      {
        title: "3. Registrácia a užívateľský účet",
        subsections: [
          {
            num: "3.1",
            text: "Registráciou na platforme užívateľ potvrdzuje, že:",
            items: [
              "Je plnoletý (má minimálne 18 rokov)",
              "Poskytol pravdivé a aktuálne údaje",
              "Súhlasí s týmito obchodnými podmienkami a GDPR",
            ],
          },
          {
            num: "3.2",
            text: "Užívateľ je povinný chrániť svoje prihlasovacie údaje a nesprístupniť ich tretím osobám.",
          },
          {
            num: "3.3",
            text: "Poskytovateľ si vyhradzuje právo zablokovať alebo zrušiť účet pri porušení týchto podmienok.",
          },
        ],
      },
      {
        title: "4. Práva a povinnosti užívateľa",
        subsections: [
          {
            num: "4.1",
            label: "Užívateľ má právo:",
            items: [
              "Používať služby platformy v súlade s týmito podmienkami",
              "Upravovať a aktualizovať svoj profil a CV",
              "Absolvovať dostupné testy a získavať coiny",
              "Komunikovať so zamestnávateľmi prostredníctvom platformy",
              "Kedykoľvek požiadať o vymazanie svojho účtu",
            ],
          },
          {
            num: "4.2",
            label: "Užívateľ sa zaväzuje:",
            items: [
              "Poskytovať pravdivé informácie",
              "Nepoužívať platformu na nelegálne účely",
              "Nerušiť fungovanie platformy",
              "Nepoužívať automatizované nástroje na absolvovanie testov",
              "Rešpektovať práva iných užívateľov",
            ],
          },
        ],
      },
      {
        title: "5. Systém coinov",
        subsections: [
          {
            num: "5.1",
            text: "Coiny sú virtuálna mena platformy, ktorú užívatelia získavajú za absolvovanie testov a aktivitu.",
          },
          { num: "5.2", text: "Coiny nemajú peňažnú hodnotu a nemôžu byť vymenené za reálne peniaze." },
          { num: "5.3", text: "Poskytovateľ si vyhradzuje právo upraviť systém coinov alebo ho zrušiť." },
        ],
      },
      {
        title: "6. Duševné vlastníctvo",
        text: "Všetok obsah platformy (texty, testy, grafika, logo, dizajn) je chránený autorskými právami a je majetkom poskytovateľa. Užívateľ nemá právo kopírovať, šíriť alebo inak používať tento obsah bez písomného súhlasu poskytovateľa.",
      },
      {
        title: "7. Zodpovednosť",
        subsections: [
          {
            num: "7.1",
            text: "Poskytovateľ nezodpovedá za škody spôsobené nesprávnym používaním platformy užívateľom.",
          },
          {
            num: "7.2",
            text: "Poskytovateľ nezaručuje nepretržitú dostupnosť služieb a nezodpovedá za technické výpadky.",
          },
          { num: "7.3", text: "Poskytovateľ nezodpovedá za obsah vytvorený užívateľmi (CV, správy)." },
        ],
      },
      {
        title: "8. Ochrana osobných údajov",
        text: "Spracovanie osobných údajov sa riadi samostatným dokumentom GDPR, ktorý je neoddeliteľnou súčasťou týchto obchodných podmienok.",
      },
      {
        title: "9. Ukončenie služby",
        subsections: [
          { num: "9.1", text: "Užívateľ môže kedykoľvek zrušiť svoj účet prostredníctvom nastavení profilu." },
          { num: "9.2", text: "Poskytovateľ môže zrušiť účet užívateľa pri porušení týchto podmienok." },
          { num: "9.3", text: "Pri zrušení účtu budú osobné údaje vymazané v súlade s GDPR." },
        ],
      },
      {
        title: "10. Záverečné ustanovenia",
        subsections: [
          {
            num: "10.1",
            text: "Poskytovateľ si vyhradzuje právo kedykoľvek zmeniť tieto obchodné podmienky. Užívatelia budú o zmenách informovaní emailom.",
          },
          { num: "10.2", text: "Tieto podmienky sa riadia právnym poriadkom Slovenskej republiky." },
          { num: "10.3", text: "V prípade sporov je príslušný súd v Bratislave." },
        ],
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    validFrom: "Valid from: January 1, 2025",
    agree: "I Agree",
    contactTitle: "Contact for questions regarding terms and conditions:",
    sections: [
      {
        title: "1. Basic Provisions",
        text: 'These terms and conditions govern the relationship between the service provider SOMVIAC (hereinafter "provider") and the platform user (hereinafter "user").',
        provider: {
          label: "Provider:",
          name: "Oskar Nagy",
          address: "Bajzova 1, 821 08 Bratislava",
          ico: "ID: 57226202",
          tel: "Tel: 0902 120 258",
          email: "Email: oskar.nagy@gmail.com",
          web: "Web: www.somviac.com",
        },
      },
      {
        title: "2. Subject of Services",
        text: "The provider operates an online platform for testing and evaluating candidates, which includes:",
        items: [
          "Psychometric tests (SJT, verbal, numerical, logical)",
          "Assessment of work skills and competencies",
          "Management of candidate profiles and CVs",
          "Communication between candidates and employers",
          "Coin and reward system",
        ],
      },
      {
        title: "3. Registration and User Account",
        subsections: [
          {
            num: "3.1",
            text: "By registering on the platform, the user confirms that:",
            items: [
              "They are of legal age (at least 18 years old)",
              "They have provided truthful and current information",
              "They agree to these terms and conditions and GDPR",
            ],
          },
          {
            num: "3.2",
            text: "The user is obliged to protect their login credentials and not share them with third parties.",
          },
          {
            num: "3.3",
            text: "The provider reserves the right to block or delete an account in case of violation of these terms.",
          },
        ],
      },
      {
        title: "4. User Rights and Obligations",
        subsections: [
          {
            num: "4.1",
            label: "The user has the right to:",
            items: [
              "Use platform services in accordance with these terms",
              "Edit and update their profile and CV",
              "Take available tests and earn coins",
              "Communicate with employers through the platform",
              "Request deletion of their account at any time",
            ],
          },
          {
            num: "4.2",
            label: "The user agrees to:",
            items: [
              "Provide truthful information",
              "Not use the platform for illegal purposes",
              "Not disrupt the platform's operation",
              "Not use automated tools to complete tests",
              "Respect the rights of other users",
            ],
          },
        ],
      },
      {
        title: "5. Coin System",
        subsections: [
          {
            num: "5.1",
            text: "Coins are the platform's virtual currency that users earn for completing tests and activities.",
          },
          { num: "5.2", text: "Coins have no monetary value and cannot be exchanged for real money." },
          { num: "5.3", text: "The provider reserves the right to modify or discontinue the coin system." },
        ],
      },
      {
        title: "6. Intellectual Property",
        text: "All platform content (texts, tests, graphics, logo, design) is protected by copyright and is the property of the provider. The user has no right to copy, distribute, or otherwise use this content without the provider's written consent.",
      },
      {
        title: "7. Liability",
        subsections: [
          {
            num: "7.1",
            text: "The provider is not liable for damages caused by incorrect use of the platform by the user.",
          },
          {
            num: "7.2",
            text: "The provider does not guarantee continuous service availability and is not responsible for technical outages.",
          },
          { num: "7.3", text: "The provider is not responsible for content created by users (CV, messages)." },
        ],
      },
      {
        title: "8. Personal Data Protection",
        text: "Personal data processing is governed by a separate GDPR document, which is an integral part of these terms and conditions.",
      },
      {
        title: "9. Service Termination",
        subsections: [
          { num: "9.1", text: "The user can cancel their account at any time through profile settings." },
          { num: "9.2", text: "The provider may cancel the user's account for violation of these terms." },
          { num: "9.3", text: "Upon account cancellation, personal data will be deleted in accordance with GDPR." },
        ],
      },
      {
        title: "10. Final Provisions",
        subsections: [
          {
            num: "10.1",
            text: "The provider reserves the right to change these terms at any time. Users will be notified of changes by email.",
          },
          { num: "10.2", text: "These terms are governed by the laws of the Slovak Republic." },
          { num: "10.3", text: "In case of disputes, the court in Bratislava has jurisdiction." },
        ],
      },
    ],
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    validFrom: "Gültig ab: 1. Januar 2025",
    agree: "Ich stimme zu",
    contactTitle: "Kontakt für Fragen zu den Geschäftsbedingungen:",
    sections: [
      {
        title: "1. Grundlegende Bestimmungen",
        text: 'Diese Geschäftsbedingungen regeln das Verhältnis zwischen dem Dienstanbieter SOMVIAC (nachfolgend "Anbieter") und dem Plattformnutzer (nachfolgend "Nutzer").',
        provider: {
          label: "Anbieter:",
          name: "Oskar Nagy",
          address: "Bajzova 1, 821 08 Bratislava",
          ico: "ID-Nr.: 57226202",
          tel: "Tel: 0902 120 258",
          email: "E-Mail: oskar.nagy@gmail.com",
          web: "Web: www.somviac.com",
        },
      },
      {
        title: "2. Gegenstand der Dienstleistungen",
        text: "Der Anbieter betreibt eine Online-Plattform zur Prüfung und Bewertung von Kandidaten, die Folgendes umfasst:",
        items: [
          "Psychometrische Tests (SJT, verbal, numerisch, logisch)",
          "Bewertung von Arbeitsfähigkeiten und Kompetenzen",
          "Verwaltung von Kandidatenprofilen und Lebensläufen",
          "Kommunikation zwischen Kandidaten und Arbeitgebern",
          "Coin- und Belohnungssystem",
        ],
      },
      {
        title: "3. Registrierung und Benutzerkonto",
        subsections: [
          {
            num: "3.1",
            text: "Durch die Registrierung auf der Plattform bestätigt der Nutzer, dass:",
            items: [
              "Er volljährig ist (mindestens 18 Jahre alt)",
              "Er wahrheitsgemäße und aktuelle Angaben gemacht hat",
              "Er diesen Geschäftsbedingungen und der DSGVO zustimmt",
            ],
          },
          {
            num: "3.2",
            text: "Der Nutzer ist verpflichtet, seine Anmeldedaten zu schützen und nicht an Dritte weiterzugeben.",
          },
          {
            num: "3.3",
            text: "Der Anbieter behält sich das Recht vor, ein Konto bei Verstoß gegen diese Bedingungen zu sperren oder zu löschen.",
          },
        ],
      },
      {
        title: "4. Rechte und Pflichten des Nutzers",
        subsections: [
          {
            num: "4.1",
            label: "Der Nutzer hat das Recht:",
            items: [
              "Plattformdienste gemäß diesen Bedingungen zu nutzen",
              "Sein Profil und seinen Lebenslauf zu bearbeiten und zu aktualisieren",
              "Verfügbare Tests zu absolvieren und Coins zu verdienen",
              "Mit Arbeitgebern über die Plattform zu kommunizieren",
              "Jederzeit die Löschung seines Kontos zu beantragen",
            ],
          },
          {
            num: "4.2",
            label: "Der Nutzer verpflichtet sich:",
            items: [
              "Wahrheitsgemäße Informationen bereitzustellen",
              "Die Plattform nicht für illegale Zwecke zu nutzen",
              "Den Betrieb der Plattform nicht zu stören",
              "Keine automatisierten Tools zum Absolvieren von Tests zu verwenden",
              "Die Rechte anderer Nutzer zu respektieren",
            ],
          },
        ],
      },
      {
        title: "5. Coin-System",
        subsections: [
          {
            num: "5.1",
            text: "Coins sind die virtuelle Währung der Plattform, die Nutzer für das Absolvieren von Tests und Aktivitäten verdienen.",
          },
          { num: "5.2", text: "Coins haben keinen Geldwert und können nicht gegen echtes Geld eingetauscht werden." },
          { num: "5.3", text: "Der Anbieter behält sich das Recht vor, das Coin-System zu ändern oder einzustellen." },
        ],
      },
      {
        title: "6. Geistiges Eigentum",
        text: "Alle Plattforminhalte (Texte, Tests, Grafiken, Logo, Design) sind urheberrechtlich geschützt und Eigentum des Anbieters. Der Nutzer hat kein Recht, diese Inhalte ohne schriftliche Zustimmung des Anbieters zu kopieren, zu verbreiten oder anderweitig zu verwenden.",
      },
      {
        title: "7. Haftung",
        subsections: [
          {
            num: "7.1",
            text: "Der Anbieter haftet nicht für Schäden, die durch unsachgemäße Nutzung der Plattform durch den Nutzer verursacht werden.",
          },
          {
            num: "7.2",
            text: "Der Anbieter garantiert keine kontinuierliche Dienstverfügbarkeit und haftet nicht für technische Ausfälle.",
          },
          {
            num: "7.3",
            text: "Der Anbieter haftet nicht für von Nutzern erstellte Inhalte (Lebenslauf, Nachrichten).",
          },
        ],
      },
      {
        title: "8. Datenschutz",
        text: "Die Verarbeitung personenbezogener Daten wird durch ein separates DSGVO-Dokument geregelt, das integraler Bestandteil dieser Geschäftsbedingungen ist.",
      },
      {
        title: "9. Beendigung des Dienstes",
        subsections: [
          { num: "9.1", text: "Der Nutzer kann sein Konto jederzeit über die Profileinstellungen kündigen." },
          { num: "9.2", text: "Der Anbieter kann das Konto des Nutzers bei Verstoß gegen diese Bedingungen kündigen." },
          { num: "9.3", text: "Bei Kontokündigung werden personenbezogene Daten gemäß DSGVO gelöscht." },
        ],
      },
      {
        title: "10. Schlussbestimmungen",
        subsections: [
          {
            num: "10.1",
            text: "Der Anbieter behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Nutzer werden per E-Mail über Änderungen informiert.",
          },
          { num: "10.2", text: "Diese Bedingungen unterliegen dem Recht der Slowakischen Republik." },
          { num: "10.3", text: "Bei Streitigkeiten ist das Gericht in Bratislava zuständig." },
        ],
      },
    ],
  },
}

export function CandidateTermsNew() {
  const { language } = useI18n()
  const t = content[language as keyof typeof content] || content.sk

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
            <p className="text-sm text-teal-50 mt-2">{t.validFrom}</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {t.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>

                {section.text && <p className="text-gray-700 leading-relaxed">{section.text}</p>}

                {section.provider && (
                  <div className="mt-4 space-y-2 text-gray-700">
                    <p>
                      <strong>{section.provider.label}</strong>
                    </p>
                    <p>{section.provider.name}</p>
                    <p>{section.provider.address}</p>
                    <p>{section.provider.ico}</p>
                    <p>{section.provider.tel}</p>
                    <p>{section.provider.email}</p>
                    <p>{section.provider.web}</p>
                  </div>
                )}

                {section.items && (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="space-y-3 text-gray-700">
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        {sub.label && (
                          <p>
                            <strong>
                              {sub.num} {sub.label}
                            </strong>
                          </p>
                        )}
                        {!sub.label && sub.text && (
                          <p>
                            <strong>{sub.num}</strong> {sub.text}
                          </p>
                        )}
                        {sub.label && sub.text && <p>{sub.text}</p>}
                        {sub.items && (
                          <ul className="list-disc list-inside space-y-2 ml-4">
                            {sub.items.map((item, j) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <section className="pt-6 border-t">
              <p className="text-sm text-gray-600">{t.contactTitle}</p>
              <p className="text-sm text-gray-600 mt-2">
                Email: oskar.nagy@gmail.com
                <br />
                Tel: 0902 120 258
              </p>
            </section>

            <div className="flex justify-center pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                <Link href="/auth/register">{t.agree}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
