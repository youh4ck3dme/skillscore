import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CompanyAGBProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyAGB({ open, onOpenChange }: CompanyAGBProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Všeobecné obchodné podmienky pre firmy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-teal-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-800 mb-2">SOMVIAC</h3>
              <p className="text-teal-700">
                Oskar Nagy
                <br />
                Bajzova 1, 821 08 Bratislava
                <br />
                IČO: 57226202
                <br />
                Tel: 0902 120 258
                <br />
                Email: oskar.nagy@gmail.com
                <br />
                Web: www.somviac.com
              </p>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 1 - VŠEOBECNÉ USTANOVENIA</h2>

              <h3 className="font-medium mb-2">1.1 Predmet služieb</h3>
              <p className="mb-4">
                SOMVIAC prevádzkovaný Oskarom Nagy poskytuje Firmám prístup k databáze kandidátov a sprostredkúva
                kontakt medzi Firmou a kandidátmi. SOMVIAC nie je personálna agentúra a neuzatvára pracovné zmluvy.
              </p>

              <h3 className="font-medium mb-2">1.2 Definície</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  <strong>Firma</strong> - právnická alebo fyzická osoba hľadajúca zamestnancov
                </li>
                <li>
                  <strong>Kandidát</strong> - osoba registrovaná v databáze SOMVIAC
                </li>
                <li>
                  <strong>Coin</strong> - virtuálna mena používaná na platforme SOMVIAC
                </li>
                <li>
                  <strong>Kontakt</strong> - sprístupnenie osobných údajov kandidáta Firme
                </li>
              </ul>

              <h3 className="font-medium mb-2">1.3 Súhlas s podmienkami</h3>
              <p className="mb-4">Registráciou Firma súhlasí s týmito VOP a zaväzuje sa ich dodržiavať.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 2 - COIN SYSTÉM A PLATBY</h2>

              <h3 className="font-medium mb-2">2.1 Princíp coin systému</h3>
              <p className="mb-4">
                Prístup k databáze kandidátov je bezplatný. Kontaktovanie kandidáta sa platí pomocou coinov, ktoré si
                Firma kupuje vopred.
              </p>

              <h3 className="font-medium mb-2">2.2 Cena coinov</h3>
              <p className="mb-2">Cena coinov za kontakt kandidáta sa líši podľa:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Typu pracovnej pozície</li>
                <li>Krajiny pôsobenia</li>
                <li>Úrovne kvalifikácie kandidáta</li>
              </ul>

              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="border border-gray-300 p-2 text-left">Pozícia</th>
                      <th className="border border-gray-300 p-2 text-left">Nemecko</th>
                      <th className="border border-gray-300 p-2 text-left">Švajčiarsko</th>
                      <th className="border border-gray-300 p-2 text-left">Ostatné krajiny</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Elektrikár</td>
                      <td className="border border-gray-300 p-2">200 coinov</td>
                      <td className="border border-gray-300 p-2">300 coinov</td>
                      <td className="border border-gray-300 p-2">150 coinov</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">IT špecialista</td>
                      <td className="border border-gray-300 p-2">400 coinov</td>
                      <td className="border border-gray-300 p-2">500 coinov</td>
                      <td className="border border-gray-300 p-2">300 coinov</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Manažér</td>
                      <td className="border border-gray-300 p-2">600 coinov</td>
                      <td className="border border-gray-300 p-2">800 coinov</td>
                      <td className="border border-gray-300 p-2">400 coinov</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-medium mb-2">2.3 Nákup coinov</h3>
              <p className="mb-2">
                Coiny sa kupujú v balíčkoch cez interný shop SOMVIAC. Platba sa realizuje bankovým prevodom na účet:
              </p>
              <div className="bg-gray-50 p-3 rounded mb-4">
                <p>
                  <strong>IBAN:</strong> CH0280808002125803277
                  <br />
                  <strong>Banka:</strong> Raiffeisen Švajčiarsko
                </p>
              </div>

              <h3 className="font-medium mb-2">2.4 Platnosť coinov</h3>
              <p className="mb-4">
                Coiny majú platnosť 12 mesiacov od dátumu nákupu. Po uplynutí platnosti sa coiny automaticky zrušia.
              </p>

              <h3 className="font-medium mb-2">2.5 Nevratnosť coinov</h3>
              <p className="mb-4">Coiny nie sú vratné ani prevoditeľné na inú Firmu.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 3 - PRÍSTUP K DATABÁZE KANDIDÁTOV</h2>

              <h3 className="font-medium mb-2">3.1 Bezplatný prístup</h3>
              <p className="mb-4">
                Firma má bezplatný prístup k anonymizovaným profilom kandidátov v databáze SOMVIAC.
              </p>

              <h3 className="font-medium mb-2">3.2 Vyhľadávacie filtre</h3>
              <p className="mb-2">Firma môže vyhľadávať kandidátov pomocou filtrov:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Jazyky a ich úroveň (A1-C2)</li>
                <li>IT zručnosti a úroveň</li>
                <li>Pracovné skúsenosti</li>
                <li>Roky praxe</li>
                <li>Lokalita</li>
                <li>Výsledky testov</li>
              </ul>

              <h3 className="font-medium mb-2">3.3 Dodatočné testy</h3>
              <p className="mb-2">Firma môže zadať kandidátom dodatočné testy:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Pracovné zručnosti špecifické pre pozíciu</li>
                <li>Odborné testy</li>
                <li>Situačné testy</li>
              </ul>

              <h3 className="font-medium mb-2">3.4 Anonymita kandidátov</h3>
              <p className="mb-4">
                Kandidáti sú identifikovaní 8-miestnym kódom až do sprístupnenia kontaktu. Osobné údaje sa sprístupnia
                po splnení kreditovej podmienky podľa článku 4.5 a autorizácii kontaktu.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 4 - KONTAKTOVANIE KANDIDÁTOV</h2>

              <h3 className="font-medium mb-2">4.1 Proces kontaktovania</h3>
              <ol className="list-decimal pl-6 mb-4 space-y-1">
                <li>Firma vyberie kandidáta z databázy</li>
                <li>
                  Overí sa splnenie kreditovej podmienky (min. 50% celkovej ceny kontaktu) a Firma autorizuje kontakt
                </li>
                <li>Po splnení kreditovej podmienky získa Firma prístup k osobným údajom kandidáta</li>
                <li>Kontaktuje kandidáta priamo</li>
              </ol>

              <h3 className="font-medium mb-2">4.2 Sprístupnené údaje</h3>
              <p className="mb-2">Po zaplatení coinov získa Firma prístup k:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Meno a priezvisko kandidáta</li>
                <li>Kontaktné údaje (email, telefón)</li>
                <li>Detailné CV</li>
                <li>Výsledky všetkých testov</li>
              </ul>

              <h3 className="font-medium mb-2">4.3 Priama komunikácia</h3>
              <p className="mb-4">
                Po sprístupnení kontaktu prebieha komunikácia priamo medzi Firmou a kandidátom. SOMVIAC nie je súčasťou
                tejto komunikácie.
              </p>

              <h3 className="font-medium mb-2">4.4 Ochrana údajov</h3>
              <p className="mb-4">
                Firma sa zaväzuje používať získané osobné údaje len na účely náboru a v súlade s GDPR.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <h3 className="font-medium mb-2">4.5 Kreditová podmienka na oslovenie</h3>
                <p>
                  Na oslovenie kandidáta musí mať Firma na účte platformy k dispozícii minimálne <strong>50%</strong> z
                  celkovej ceny kontaktu vyjadrenej v coinoch. Bez splnenia tejto podmienky nebude možné sprístupniť
                  osobné údaje kandidáta. Táto podmienka neznamená úhradu celej ceny vopred; úhrada prebieha podľa
                  článku 5 formou mesačných platieb.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 5 - PRACOVNÉ ZMLUVY A PLATBY</h2>

              <h3 className="font-medium mb-2">5.1 Priama zmluva</h3>
              <p className="mb-4">
                Pracovná zmluva sa uzatvára priamo medzi Firmou a kandidátom. SOMVIAC nie je stranou tejto zmluvy.
              </p>

              <h3 className="font-medium mb-2">5.2 Povaha poplatku (fixný za kontakt)</h3>
              <p className="mb-4">
                Poplatok za sprístupnenie kontaktu na kandidáta je pevne stanovený podľa cenníka (coinov) a{" "}
                <strong>nie je odvodený od mzdy</strong> ani iných pracovných podmienok kandidáta.
              </p>

              <h3 className="font-medium mb-2">5.3 Mesačné platby a dĺžka</h3>
              <p className="mb-4">
                Poplatok sa uhrádza formou mesačných platieb počas trvania zamestnania kandidáta,{" "}
                <strong>najviac však 6 po sebe idúcich mesiacov</strong> od jeho nástupu.
              </p>

              <h3 className="font-medium mb-2">5.4 Výška mesačných platieb</h3>
              <p className="mb-4">
                Mesačný poplatok sa určí ako celková cena kontaktu (v coinoch) <strong>delená šiestimi</strong>. Ak
                pracovný pomer skončí skôr, Firma platí iba za mesiace, počas ktorých bol kandidát zamestnaný.
              </p>

              <h3 className="font-medium mb-2">5.5 Splatnosť</h3>
              <p className="mb-4">Mesačné platby sú splatné do 15. dňa každého mesiaca bankovým prevodom.</p>

              <h3 className="font-medium mb-2">5.6 Oznámenie o prijatí</h3>
              <p className="mb-4">
                Firma je povinná oznámiť SOMVIAC prijatie kandidáta do 7 dní od podpisu pracovnej zmluvy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 6 - PRÁVA A POVINNOSTI FIRMY</h2>

              <h3 className="font-medium mb-2">6.1 Práva Firmy</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Bezplatný prístup k databáze kandidátov</li>
                <li>Používanie vyhľadávacích filtrov</li>
                <li>Zadávanie dodatočných testov</li>
                <li>Priamy kontakt s kandidátmi po zaplatení</li>
                <li>Technická podpora SOMVIAC</li>
              </ul>

              <h3 className="font-medium mb-2">6.2 Povinnosti Firmy</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Poskytovanie pravdivých údajov o firme</li>
                <li>Dodržiavanie pracovnoprávnych predpisov</li>
                <li>Ochrana osobných údajov kandidátov</li>
                <li>Platenie coinov a mesačných poplatkov</li>
                <li>Oznámenie o prijatí kandidáta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 7 - ZODPOVEDNOSŤ A OBMEDZENIA</h2>

              <h3 className="font-medium mb-2">7.1 Obmedzenie zodpovednosti SOMVIAC</h3>
              <p className="mb-2">SOMVIAC nenesie zodpovednosť za:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Kvalitu, schopnosti alebo správanie kandidátov</li>
                <li>Pravdivosť informácií poskytnutých kandidátmi</li>
                <li>Pracovný vzťah medzi Firmou a kandidátom</li>
                <li>Škody vzniknuté z pracovného vzťahu</li>
                <li>Technické problémy alebo výpadky služby</li>
              </ul>

              <h3 className="font-medium mb-2">7.2 Zodpovednosť Firmy</h3>
              <p className="mb-2">Firma nesie plnú zodpovednosť za:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Dodržiavanie pracovnoprávnych predpisov</li>
                <li>Ochranu osobných údajov kandidátov</li>
                <li>Kvalitu pracovného prostredia</li>
                <li>Platenie miezd a odvodov</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 8 - UKONČENIE SLUŽBY</h2>

              <h3 className="font-medium mb-2">8.1 Ukončenie zo strany Firmy</h3>
              <p className="mb-4">
                Firma môže kedykoľvek ukončiť používanie služieb SOMVIAC. Nevyužité coiny sa nevrátia.
              </p>

              <h3 className="font-medium mb-2">8.2 Ukončenie zo strany SOMVIAC</h3>
              <p className="mb-2">SOMVIAC môže ukončiť poskytovanie služieb v prípade:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Porušenia týchto VOP</li>
                <li>Neplatenia poplatkov</li>
                <li>Zneužitia platformy</li>
              </ul>

              <h3 className="font-medium mb-2">8.3 Následky ukončenia</h3>
              <p className="mb-4">
                Po ukončení služby zostávajú v platnosti záväzky týkajúce sa už prijatých kandidátov.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok 9 - ZÁVEREČNÉ USTANOVENIA</h2>

              <h3 className="font-medium mb-2">9.1 Zmeny VOP</h3>
              <p className="mb-4">SOMVIAC si vyhradzuje právo zmeniť tieto VOP s 30-dňovou výpovednou lehotou.</p>

              <h3 className="font-medium mb-2">9.2 Rozhodné právo</h3>
              <p className="mb-4">Na tieto VOP sa vzťahuje slovenské právo.</p>

              <h3 className="font-medium mb-2">9.3 Riešenie sporov</h3>
              <p className="mb-4">Spory sa riešia príslušnými súdmi Slovenskej republiky.</p>

              <h3 className="font-medium mb-2">9.4 Kontakt</h3>
              <p className="mb-4">Pre otázky kontaktujte: oskar.nagy@gmail.com</p>
            </section>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <p className="font-semibold mb-2">
                Tieto VOP nadobúdajú účinnosť dňom registrácie Firmy na platforme SOMVIAC.
              </p>
              <p>
                <strong>Posledná aktualizácia:</strong> {new Date().toLocaleDateString("sk-SK")}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
