"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CandidateGDPR() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Zásady ochrany osobných údajov – Kandidáti</CardTitle>
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold">Prevádzkovateľ:</p>
          <p className="font-semibold">SOMVIAC – Oskar Nagy</p>
          <p>Bajzova 1, 821 08 Bratislava</p>
          <p>IČO: 57226202</p>
          <p>Tel.: 0902 120 258</p>
          <p>E‑mail: oskar.nagy@gmail.com</p>
          <p>Web: www.somviac.com</p>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-6 pr-4">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Úvod a rozsah</h2>
              <p className="mb-4">
                Cieľom tohto dokumentu je poskytnúť prehľadné informácie o tom, ako spracúvame vaše osobné údaje v
                súlade s Nariadením (EÚ) 2016/679 (GDPR) a súvisiacimi právnymi predpismi SR. Zásady sa vzťahujú na
                registráciu kandidátov, vedenie profilu, testovací systém, sprostredkovanie kontaktu s firmami,
                vzdelávací fond a odmeňovanie za odporúčanie kandidátov.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Aké údaje spracúvame</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Identifikačné a kontaktné údaje: meno, priezvisko, e‑mail, telefón, adresa</li>
                <li>
                  Údaje profilu a CV (Životopis): pracovné skúsenosti, vzdelanie, zručnosti, jazyky, portfólio,
                  referencie, fotografia
                </li>
                <li>Údaje z testov: výsledky jazykových, IT a kompetenčných testov a informácie o pokusoch</li>
                <li>
                  Údaje o využívaní platformy: prihlásenie, nastavenia, komunikácia cez platformu, 8‑miestny anonymný
                  kód
                </li>
                <li>
                  Referral program: identifikácia odporúčateľa, prepojenie s odporučeným kandidátom, nárok na províziu
                </li>
                <li>Fakturačné/odmeňovacie údaje: bankové spojenie, daňové náležitosti</li>
                <li>Technické údaje: logy, IP adresa, cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Účely a právne základy spracúvania</h2>

              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-3 text-left">Účel</th>
                      <th className="border border-gray-300 p-3 text-left">Právny základ (GDPR)</th>
                      <th className="border border-gray-300 p-3 text-left">Doba uchovávania</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">
                        Registrácia a vedenie účtu kandidáta; sprostredkovanie kontaktu s Firmami; prevádzka anonymita
                        systému
                      </td>
                      <td className="border border-gray-300 p-3">
                        Čl. 6 ods. 1 písm. b) – plnenie zmluvy a predzmluvné vzťahy
                      </td>
                      <td className="border border-gray-300 p-3">
                        Po dobu trvania účtu; po zrušení účtu vymazanie alebo archivácia v obmedzenom rozsahu
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">
                        Testovací systém a odporúčania zhodných pozícií (základné profilovanie)
                      </td>
                      <td className="border border-gray-300 p-3">
                        Čl. 6 ods. 1 písm. b) a/alebo písm. f) (oprávnený záujem)
                      </td>
                      <td className="border border-gray-300 p-3">
                        Po dobu účtu; historické pokusy môžu byť anonymizované na analytické účely
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">
                        Referral program (odmeny za odporúčanie kandidátov)
                      </td>
                      <td className="border border-gray-300 p-3">
                        Čl. 6 ods. 1 písm. b) (vyplatenie odmeny); účtovné povinnosti – čl. 6 ods. 1 písm. c)
                      </td>
                      <td className="border border-gray-300 p-3">
                        Po dobu trvania nároku a následne počas zákonných lehôt archivácie (min. 10 rokov)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <p className="font-medium">
                  <strong>Automatizované rozhodovanie:</strong> Nevykonávame rozhodovanie, ktoré by voči vám vyvolávalo
                  právne účinky výlučne na základe automatizovaného spracúvania. Testy sú orientačné a slúžia ako
                  podporný podklad pre Firmy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">7. Doba uchovávania a mazanie</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  Účet kandidáta je platný 12 mesiacov a môžete ho opakovane predlžovať vždy o ďalších 12 mesiacov. Po
                  zrušení účtu údaje vymažeme, pokiaľ neexistuje zákonný dôvod na ich uchovanie.
                </li>
                <li>
                  Údaje nevyhnutné na uplatnenie právnych nárokov môžeme uchovávať po dobu premlčacích/archivačných
                  lehôt (spravidla 3 roky pre nároky, 10 rokov pre účtovné doklady).
                </li>
                <li>Testovacie dáta môžeme po zrušení účtu anonymizovať na štatistické účely.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">8. Cookies a podobné technológie</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Nevyhnutné cookies</strong> – prihlásenie, bezpečnosť, preferencie (právny základ: oprávnený
                  záujem/zmluva)
                </li>
                <li>
                  <strong>Analytické a marketingové cookies</strong> – len s vaším súhlasom; môžete ho kedykoľvek
                  odvolať v nastaveniach cookies
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">10. Vaše práva</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Právo na prístup k údajom (čl. 15)</li>
                <li>Právo na opravu (čl. 16) a vymazanie (čl. 17)</li>
                <li>Právo na obmedzenie spracúvania (čl. 18)</li>
                <li>Právo na prenosnosť údajov (čl. 20)</li>
                <li>Právo namietať (čl. 21) – najmä voči spracúvaniu na oprávnený záujem a marketingu</li>
                <li>Právo odvolať súhlas kedykoľvek, bez vplyvu na zákonnosť spracúvania pred odvolaním</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">11. Ako uplatniť práva</h2>
              <p className="mb-4">
                Kontaktujte nás na oskar.nagy@gmail.com alebo poštou na adresu sídla. Z dôvodu ochrany súkromia si
                môžeme vyžiadať dodatočné overenie identity. Štandardne odpovieme do 1 mesiaca.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">14. Osobitné ustanovenia</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Anonymita systém:</strong> váš profil môže byť identifikovaný 8‑miestnym kódom. Osobné údaje
                  zdieľame s Firmou až po vašom súhlase a uhradení príslušného poplatku Firmou.
                </li>
                <li>
                  <strong>Referral program:</strong> spracúvame údaje odporúčateľa a odporučeného kandidáta na účely
                  sledovania nároku na províziu a vyplatenia odmeny (10% z provízie SOMVIAC, vo dvoch častiach po
                  výplate zisku).
                </li>
                <li>
                  <strong>Zákaz obchádzania platformy:</strong> monitorujeme podozrivé aktivity len v nevyhnutnom
                  rozsahu na ochranu našich práv a práv Firiem.
                </li>
              </ul>
            </section>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-6">
              <p className="font-semibold">Dátum účinnosti: 25. 09. 2025</p>
              <p className="font-semibold">Verzia: 1.0</p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
