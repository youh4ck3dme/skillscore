import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecruiterAGBProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecruiterAGB({ open, onOpenChange }: RecruiterAGBProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-teal-600">
            Všeobecné obchodné podmienky pre Rekrúterov
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="font-semibold text-teal-800 mb-2">SOMVIAC</div>
              <div className="text-teal-700">
                <p>Oskar Nagy</p>
                <p>Bajzova 1, 821 08 Bratislava</p>
                <p>IČO: 57226202</p>
                <p>Tel: 0902 120 258</p>
                <p>Email: oskar.nagy@gmail.com</p>
                <p>Web: www.somviac.com</p>
              </div>
            </div>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 1 - VŠEOBECNÉ USTANOVENIA</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">1.1 Definícia rekrútera</h4>
                <p className="mb-3">
                  Rekrúter je osoba, ktorá sprostredkúva kontakt medzi kandidátmi a firmami prostredníctvom platformy
                  SOMVIAC a za túto činnosť dostáva províziu.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">1.2 Predmet spolupráce</h4>
                <p className="mb-2">SOMVIAC prevádzkovaný Oskarom Nagy poskytuje Rekrúterom možnosť:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pozývať kandidátov do databázy</li>
                  <li>Vytvárať profily kandidátov</li>
                  <li>Získavať provízie z úspešných sprostredkovaní</li>
                  <li>Budovať hierarchiu podrekrúterov</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">1.3 Súhlas s podmienkami</h4>
                <p>Registráciou Rekrúter súhlasí s týmito VOP a zaväzuje sa ich dodržiavať.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 2 - PROVÍZNY SYSTÉM</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.1 Základ pre výpočet provízie</h4>
                <p className="mb-2">
                  Provízia SOMVIAC za sprostredkovanie kontaktu je <strong>fixná suma</strong> podľa{" "}
                  <strong>Index cenníka</strong> (nie percento zo mzdy). Táto fixná suma sa vypočíta pomocou kalkulačky
                  na základe krajiny, pozície, druhu práce a rokov praxe kandidáta.
                </p>
                <p>
                  Provízia rekrútera predstavuje <strong>20% z tejto fixnej Index ceny SOMVIAC</strong> a je počítaná{" "}
                  <strong>mesačne</strong> počas trvania zamestnania kandidáta.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.2 Výplata provízie (podmienená úhradou)</h4>
                <p>
                  Provízia je splatná a vyplatiteľná výlučne za mesiace, za ktoré{" "}
                  <strong>SOMVIAC reálne obdrží fixnú mesačnú platbu od firmy</strong> za daného kandidáta. Do času
                  prijatia príslušnej mesačnej úhrady nevzniká rekrúterovi nárok na výplatu.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.3 Provízia z podrekrútera (override)</h4>
                <p>
                  Ak rekrúter pozve iného rekrútera (ďalej len „podrekrúter"), vzniká mu nárok na{" "}
                  <strong>2% z fixnej Index provízie podrekrútera</strong> za každého kandidáta, ktorého privedie
                  podrekrúter. Týchto 2% sa <strong>odpočíta z provízie podrekrútera</strong> a pripočíta k provízii
                  nadradeného rekrútera (parita).
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.4 Transparentnosť a výkazy</h4>
                <p>
                  Rekrúter má prístup k prehľadnému dashboardu s detailom provízií (vlastných aj z podrekrútera) a
                  stavom kandidátov vrátane histórie platieb od firiem.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.5 Výplatné termíny</h4>
                <p>
                  Provízia sa vyplácajú mesačne do 15. dňa nasledujúceho mesiaca, len v rozsahu, v ktorom už bola
                  príslušná provízia uhradená firme voči SOMVIAC.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.6 Minimálna suma výplaty</h4>
                <p>Minimálna suma pre výplatu provízie je 50 EUR. Nižšie sumy sa prenášajú do nasledujúceho mesiaca.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">2.7 Trvanie nároku a strop</h4>
                <p>
                  Nárok na mesačnú fixnú províziu podľa článku 2.1 trvá <strong>počas zamestnania kandidáta</strong>,
                  najviac však <strong>6 po sebe idúcich mesiacov</strong> od jeho nástupu. Ak je fixná mesačná platba
                  zo strany firmy uhrádzaná nepravidelne alebo so zdržaním, výplata rekrúterovi sa uskutoční len v
                  rozsahu reálne prijatých mesačných úhrad.
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 3 - POZÝVANIE KANDIDÁTOV</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">3.1 Spôsoby pozývania</h4>
                <p className="mb-2">Rekrúter môže pozývať kandidátov:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>E-mailovým pozvaním cez platformu SOMVIAC</li>
                  <li>Zdieľaním registračného odkazu</li>
                  <li>Osobným kontaktom s následnou registráciou</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">3.2 Súhlas kandidáta</h4>
                <p>
                  Každý kandidát musí potvrdiť svoju registráciu a súhlas s vytvorením profilu. Rekrúter nemôže
                  registrovať kandidáta bez jeho súhlasu.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">3.3 Vytvorenie profilu kandidáta</h4>
                <p className="mb-2">Rekrúter môže s písomným súhlasom kandidáta:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Vytvoriť profil kandidáta</li>
                  <li>Nahrať CV kandidáta</li>
                  <li>Vyplniť základné údaje</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">3.4 Zodpovednosť za údaje</h4>
                <p>Rekrúter je zodpovedný za pravdivosť všetkých údajov, ktoré poskytne o kandidátovi.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 4 - HIERARCHIA REKRÚTEROV</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">4.1 Budovanie tímu</h4>
                <p>Rekrúter môže pozývať ďalších rekrúterov do svojho tímu a získavať provízie z ich činnosti.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">4.2 Podrekrúteri</h4>
                <p>
                  Podrekrúteri sú rekrúteri, ktorých pozval nadradený rekrúter. Nadradený rekrúter získava províziu vo
                  výške 2% z provízie podrekrútera; táto suma sa odpočíta z provízie podrekrútera a pripočíta k provízii
                  nadradeného (parita).
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">4.3 Maximálna hĺbka hierarchie</h4>
                <p>
                  Hierarchia rekrúterov má maximálne <strong>1 úroveň</strong>. Provízie sa vyplácajú len z priamych
                  podrekrúterov (override podľa článku 2.3).
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">4.4 Transparentnosť hierarchie</h4>
                <p>Každý rekrúter vidí svoju pozíciu v hierarchii a všetky provízie sú transparentne zobrazené.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 5 - DASHBOARD A ŠTATISTIKY</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">5.1 Rekrúterský dashboard</h4>
                <p className="mb-2">Každý rekrúter má prístup k dashboardu s informáciami:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Zoznam svojich kandidátov</li>
                  <li>Stav kandidátov (aktívny, kontaktovaný, prijatý)</li>
                  <li>Mesačné provízie</li>
                  <li>Štatistiky úspešnosti</li>
                  <li>Zoznam podrekrúterov</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">5.2 Reporty</h4>
                <p>Rekrúter môže generovať mesačné a ročné reporty svojej činnosti pre daňové účely.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">5.3 Notifikácie</h4>
                <p className="mb-2">Rekrúter dostáva notifikácie o:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kontaktovaní svojich kandidátov</li>
                  <li>Prijatí kandidátov na prácu</li>
                  <li>Výplate provízie</li>
                  <li>Nových podrekrúteroch</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 6 - PRÁVA A POVINNOSTI REKRÚTERA</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">6.1 Práva rekrútera</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pozývať kandidátov do databázy</li>
                  <li>Vytváranie profilov kandidátov so súhlasom</li>
                  <li>Získavanie provízie z úspešných sprostredkovaní</li>
                  <li>Budovanie tímu podrekrúterov</li>
                  <li>Prístup k transparentným štatistikám</li>
                  <li>Technická podpora SOMVIAC</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">6.2 Povinnosti rekrútera</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Poskytovanie pravdivých údajov o kandidátoch</li>
                  <li>Získanie súhlasu kandidátov pred registráciou</li>
                  <li>Dodržiavanie GDPR pri spracovaní osobných údajov</li>
                  <li>Slušné správanie voči kandidátom a firmám</li>
                  <li>Vedenie daňovej evidencie provízie</li>
                  <li>Dodržiavanie týchto VOP</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 7 - DAŇOVÉ POVINNOSTI</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">7.1 Zodpovednosť rekrútera</h4>
                <p className="mb-2">Rekrúter je zodpovedný za:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Vedenie evidencie príjmov z provízie</li>
                  <li>Platenie daní z príjmov</li>
                  <li>Sociálne a zdravotné odvody (ak je povinný)</li>
                  <li>Registráciu živnosti (ak je potrebná)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">7.2 Daňové doklady</h4>
                <p>
                  SOMVIAC poskytuje rekrúterom mesačné výkazy provízie, ktoré môžu použiť ako podklad pre daňové
                  priznanie.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">7.3 Poradenstvo</h4>
                <p>SOMVIAC neporaduje v daňových otázkach. Rekrúter si musí zabezpečiť vlastné daňové poradenstvo.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 8 - ZODPOVEDNOSŤ A OBMEDZENIA</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">8.1 Obmedzenie zodpovednosti SOMVIAC</h4>
                <p className="mb-2">SOMVIAC nenesie zodpovednosť za:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Daňové povinnosti rekrútera</li>
                  <li>Kvalitu kandidátov privedených rekrúterom</li>
                  <li>Spory medzi rekrúterom a kandidátmi</li>
                  <li>Technické problémy alebo výpadky služby</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">8.2 Zodpovednosť rekrútera</h4>
                <p className="mb-2">Rekrúter nesie zodpovednosť za:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pravdivosť údajov o kandidátoch</li>
                  <li>Získanie súhlasu kandidátov</li>
                  <li>Dodržiavanie GDPR</li>
                  <li>Svoje daňové povinnosti</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 9 - UKONČENIE SPOLUPRÁCE</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">9.1 Ukončenie zo strany rekrútera</h4>
                <p>Rekrúter môže kedykoľvek ukončiť spoluprácu so SOMVIAC. Nevyplatené provízie zostávajú zachované.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">9.2 Ukončenie zo strany SOMVIAC</h4>
                <p className="mb-2">SOMVIAC môže ukončiť spoluprácu v prípade:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Porušenia týchto VOP</li>
                  <li>Poskytnutia nepravdivých údajov</li>
                  <li>Zneužitia platformy</li>
                  <li>Neetického správania</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">9.3 Následky ukončenia</h4>
                <p className="mb-2">Po ukončení spolupráce:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Rekrúter stráca prístup k platforme</li>
                  <li>Nevyplatené provízie sa vyplatia v najbližšom termíne</li>
                  <li>Kandidáti zostávajú v databáze SOMVIAC</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-teal-700 mb-3">Článok 10 - ZÁVEREČNÉ USTANOVENIA</h3>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">10.1 Zmeny VOP</h4>
                <p>SOMVIAC si vyhradzuje právo zmeniť tieto VOP s 30-dňovou výpovednou lehotou.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">10.2 Rozhodné právo</h4>
                <p>Na tieto VOP sa vzťahuje slovenské právo.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">10.3 Riešenie sporov</h4>
                <p>Spory sa riešia príslušnými súdmi Slovenskej republiky.</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-teal-600 mb-2">10.4 Kontakt</h4>
                <p>Pre otázky kontaktujte: oskar.nagy@gmail.com</p>
              </div>
            </section>

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <p className="font-semibold">
                Tieto VOP nadobúdajú účinnosť dňom registrácie Rekrútera na platforme SOMVIAC.
              </p>
              <p className="font-semibold mt-2">Posledná aktualizácia: [DÁTUM]</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
