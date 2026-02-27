import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecruiterGDPRProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecruiterGDPR({ open, onOpenChange }: RecruiterGDPRProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-teal-600">
            Zásady ochrany osobných údajov – Rekrúteri
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="font-semibold text-teal-800 mb-2">Prevádzkovateľ:</div>
              <div className="text-teal-700">
                <p>
                  <strong>SOMVIAC</strong> – Oskar Nagy
                </p>
                <p>Bajzova 1, 821 08 Bratislava</p>
                <p>IČO: 57226202</p>
                <p>Tel.: 0902 120 258</p>
                <p>
                  E-mail:{" "}
                  <a href="mailto:oskar.nagy@gmail.com" className="text-teal-600 underline">
                    oskar.nagy@gmail.com
                  </a>
                </p>
                <p>
                  Web:{" "}
                  <a href="https://www.somviac.com" className="text-teal-600 underline">
                    www.somviac.com
                  </a>
                </p>
              </div>
              <p className="text-teal-600 text-xs mt-3">
                Tieto zásady sa vzťahujú na rekrúterov využívajúcich platformu SOMVIAC a zohľadňujú provízny model (20%
                z provízie SOMVIAC mesačne počas zamestnania kandidáta max. 6 mesiacov; 2% override z podrekrútera,
                odpočítaný z jeho provízie) a hierarchiu s max. 1 úrovňou.
              </p>
            </div>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">1. Úvod a rozsah</h3>
              <p>
                Popisuje, ako spracúvame osobné údaje rekrúterov v súlade s GDPR a právom SR pri využívaní platformy,
                vyplácaní provízií a správe hierarchie.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">2. Aké údaje spracúvame</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Identifikačné a kontaktné údaje:</strong> meno, priezvisko, e-mail, telefón.
                </li>
                <li>
                  <strong>Údaje o účte a aktivite:</strong> prihlásenie, nastavenia, pozvánky, referral linky, zoznam
                  privedených kandidátov a podrekrúterov.
                </li>
                <li>
                  <strong>Provízne údaje:</strong> výška provízií (20%), override (2%), podklady pre výplaty,
                  IBAN/fakturačné údaje.
                </li>
                <li>
                  <strong>Daňové a účtovné údaje:</strong> faktúry, výkazy, potvrdenia o úhrade, údaje nutné na splnenie
                  zákonných povinností.
                </li>
                <li>
                  <strong>Technické údaje:</strong> IP adresa, logy, cookies (pozri časť 8).
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">3. Účely a právne základy</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border border-gray-300 p-2 text-left font-medium">Účel</th>
                      <th className="border border-gray-300 p-2 text-left font-medium">Právny základ</th>
                      <th className="border border-gray-300 p-2 text-left font-medium">Príklady údajov</th>
                      <th className="border border-gray-300 p-2 text-left font-medium">Doba uchovávania</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Registrácia rekrútera, vedenie účtu a hierarchie (1 úroveň), správa dashboardu.
                      </td>
                      <td className="border border-gray-300 p-2">
                        Čl. 6(1)(b) GDPR – plnenie zmluvy; Čl. 6(1)(f) – oprávnený záujem (bezpečnosť, antifraud).
                      </td>
                      <td className="border border-gray-300 p-2">
                        Kontaktné údaje, nastavenia, zoznam pozvánok a podrekrúterov.
                      </td>
                      <td className="border border-gray-300 p-2">Po dobu trvania účtu; po zrušení podľa časti 7.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Výpočet a vyplatenie provízie (20% mesačne počas zamestnania, max. 6 mesiacov; 2% override
                        odpočítaný podrekrúterovi).
                      </td>
                      <td className="border border-gray-300 p-2">
                        Čl. 6(1)(b) – plnenie zmluvy; Čl. 6(1)(c) – zákonné účtovné povinnosti.
                      </td>
                      <td className="border border-gray-300 p-2">
                        Provízne záznamy, IBAN/fakturačné údaje, doklady o úhrade.
                      </td>
                      <td className="border border-gray-300 p-2">
                        Po dobu nároku a následne podľa zákonných lehôt (účtovné doklady min. 10 rokov).
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Prevádzková analytika, bezpečnosť a riešenie sporov.
                      </td>
                      <td className="border border-gray-300 p-2">Čl. 6(1)(f) – oprávnený záujem.</td>
                      <td className="border border-gray-300 p-2">Logy, interná korešpondencia, záznamy incidentov.</td>
                      <td className="border border-gray-300 p-2">
                        Spravidla do 12 mesiacov (logy), resp. podľa premlčacích lehôt pri sporoch.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Marketing (dobrovoľné).</td>
                      <td className="border border-gray-300 p-2">Čl. 6(1)(a) – súhlas.</td>
                      <td className="border border-gray-300 p-2">E-mail, preferencie.</td>
                      <td className="border border-gray-300 p-2">Do odvolania súhlasu.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">4. Príjemcovia</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sprostredkovatelia (hosting, CRM, e-mail, účtovníctvo, platby) podľa čl. 28 GDPR.</li>
                <li>Orgány verejnej moci, ak to vyžaduje zákon.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">5. Doba uchovávania</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Účet:</strong> po dobu trvania; po zrušení vymazanie/anonymizácia, s výnimkou zákonných
                  povinností a nárokov.
                </li>
                <li>
                  <strong>Účtovné doklady:</strong> min. 10 rokov.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">6. Prenosy do tretích krajín</h3>
              <p>Ak budú použité služby mimo EHP, zabezpečíme primerané záruky (SCC, čl. 46 GDPR) a informujeme vás.</p>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">7. Vaše práva</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Prístup, oprava, vymazanie, obmedzenie, prenosnosť, námietka, odvolanie súhlasu.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">8. Cookies</h3>
              <p>
                Používame nevyhnutné cookies (prevádzka a bezpečnosť) a voliteľné analytické/marketingové cookies na
                základe vášho súhlasu.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">9. Kontakt a sťažnosť</h3>
              <p>
                Kontakt:{" "}
                <a href="mailto:oskar.nagy@gmail.com" className="text-teal-600 underline">
                  oskar.nagy@gmail.com
                </a>
                . Dozor: Úrad na ochranu osobných údajov SR,{" "}
                <a href="https://dataprotection.gov.sk" className="text-teal-600 underline">
                  dataprotection.gov.sk
                </a>
                .
              </p>
            </section>

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <p>
                <strong>Dátum účinnosti:</strong> 25. 09. 2025
              </p>
              <p>
                <strong>Verzia:</strong> 1.0
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
