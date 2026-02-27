import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CompanyContractProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyContract({ open, onOpenChange }: CompanyContractProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Zmluva o sprostredkovaní kontaktu</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-teal-50 p-4 rounded-lg border text-center">
              <h1 className="text-xl font-bold text-teal-800 mb-2">ZMLUVA O SPROSTREDKOVANÍ KONTAKTU</h1>
              <p className="text-sm text-teal-600">
                uzatvorená podľa § 269 ods. 2 Obchodného zákonníka (SR) – nejde o zmluvu podľa zákona o agentúrach
                dočasného zamestnávania
              </p>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok I – Zmluvné strany</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold mb-1">Sprostredkovateľ:</p>
                  <p>
                    <strong>SOMVIAC</strong> – Oskar Nagy, Bajzova 1, 821 08 Bratislava, IČO: 57226202, Tel.: 0902 120
                    258, E‑mail: oskar.nagy@gmail.com
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Firma (Odberateľ):</p>
                  <p>
                    Obchodné meno: ..........................................................
                    <br />
                    IČO/DIČ/IČ DPH: ..........................................................
                    <br />
                    Sídlo: .....................................................................
                    <br />
                    Zastúpená: .................................................................
                    <br />
                    E‑mail/Telefón: ............................................................
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Dátum účinnosti zmluvy:</strong> .................
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok II – Predmet zmluvy</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Sprostredkovateľ sa zaväzuje poskytnúť Firme službu <em>sprístupnenia kontaktu</em> na vybraných
                  kandidátov vedených v databáze SOMVIAC (ďalej len „Kontakt").
                </li>
                <li>
                  Zmluvné strany berú na vedomie, že Sprostredkovateľ nevykonáva činnosť agentúry dočasného
                  zamestnávania a nie je stranou pracovnoprávneho vzťahu medzi Firmou a kandidátom. Služba má povahu
                  sprístupnenia Kontaktu a súvisiacich údajov v zmysle VOP.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok III – Cena a platobné podmienky</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Pevná cena za Kontakt:</strong> Cena za sprístupnenie Kontaktu je stanovená podľa platného
                  cenníka v coinoch na platforme SOMVIAC a <strong>nie je odvodená od mzdy</strong> ani iných pracovných
                  podmienok kandidáta.
                </li>
                <li>
                  <strong>Kreditová podmienka:</strong> Pred sprístupnením Kontaktu musí mať Firma na účte platformy k
                  dispozícii minimálne <strong>50%</strong> z celkovej ceny Kontaktu. Po splnení podmienky Firma
                  autorizuje sprístupnenie Kontaktu.
                </li>
                <li>
                  <strong>Spôsob úhrady:</strong> Celková cena Kontaktu sa uhrádza formou mesačných platieb počas
                  trvania zamestnania kandidáta u Firmy, <strong>najviac však 6 po sebe idúcich mesiacov</strong> od
                  jeho nástupu. Každá mesačná platba predstavuje 1/6 celkovej ceny Kontaktu.
                </li>
                <li>
                  Ak pracovný pomer skončí pred uplynutím 6 mesiacov, Firma uhradí len tie mesačné platby, ktoré
                  prislúchajú obdobiam, počas ktorých bol kandidát u Firmy zamestnaný.
                </li>
                <li>
                  Fakturačné a splatnostné podmienky sa riadia VOP pre Firmy; mesačné platby sú spravidla splatné do 15.
                  dňa nasledujúceho mesiaca.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok IV – Povinnosti a spolupráca</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Firma je povinná oznámiť Sprostredkovateľovi uzatvorenie pracovného pomeru s kandidátom najneskôr do{" "}
                  <strong>7 dní</strong> od podpisu pracovnej zmluvy a rovnako oznámiť skončenie pracovného pomeru.
                </li>
                <li>
                  Firma sa zaväzuje používať poskytnuté osobné údaje kandidátov výlučne na účely náboru a v súlade s
                  GDPR a VOP.
                </li>
                <li>
                  Sprostredkovateľ zabezpečí sprístupnenie Kontaktu po splnení kreditovej podmienky a autorizácii
                  Firmou.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok V – Zákaz obchádzania a sankcie</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Firma sa zaväzuje neobchádzať Sprostredkovateľa a platformu SOMVIAC. Za obchádzanie sa považuje najmä:
                  získanie Kontaktu mimo platformy, kontaktovanie kandidáta bez splnenia kreditovej podmienky a
                  autorizácie, alebo využitie Kontaktu na vznik pracovného pomeru bez riadneho uhrádzania mesačných
                  platieb.
                </li>
                <li className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                  V prípade porušenia tohto článku je Firma povinná uhradiť Sprostredkovateľovi{" "}
                  <strong>zmluvnú pokutu vo výške 5 000 €</strong> za každé jednotlivé porušenie. Tým nie je dotknuté
                  právo Sprostredkovateľa na náhradu škody v plnom rozsahu a na úhradu všetkých neuhradených častí ceny
                  Kontaktu.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok VI – Zodpovednosť a obmedzenia</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Sprostredkovateľ nezodpovedá za výsledok náboru, pracovnú spôsobilosť, výkon alebo správanie
                  kandidáta, ani za trvanie jeho pracovného pomeru. Zodpovednosť Sprostredkovateľa je obmedzená na
                  riadne sprístupnenie Kontaktu a vedenie účtovných záznamov o úhradách.
                </li>
                <li>
                  Firma nesie plnú zodpovednosť za dodržiavanie pracovnoprávnych predpisov, mzdové a odvodové
                  povinnosti, bezpečnosť a ochranu zdravia pri práci a za ochranu osobných údajov kandidáta po
                  sprístupnení Kontaktu.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok VII – Dôvernosť a ochrana údajov</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Strany sa zaväzujú zachovávať mlčanlivosť o všetkých informáciách, ktoré sa dozvedia pri plnení tejto
                  zmluvy, a to aj po jej ukončení.
                </li>
                <li>
                  Spracúvanie osobných údajov sa riadi zásadami ochrany osobných údajov SOMVIAC a VOP pre Firmy; Firma
                  je v postavení samostatného prevádzkovateľa vo vzťahu k údajom, ktoré jej boli sprístupnené.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok VIII – Trvanie a ukončenie</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Zmluva sa uzatvára na dobu neurčitú.</li>
                <li>
                  Ktorákoľvek zo strán môže zmluvu vypovedať písomne s <strong>30‑dňovou</strong> výpovednou lehotou.
                </li>
                <li>
                  Ukončenie zmluvy sa nedotýka nárokov na úhradu už splatných alebo vzniknutých platieb a zmluvných
                  pokút.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok IX – Rozhodné právo, riešenie sporov</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Táto zmluva sa spravuje právnym poriadkom Slovenskej republiky.</li>
                <li>
                  Spory vyplývajúce z tejto zmluvy budú riešené pred vecne a miestne príslušným súdom v{" "}
                  <strong>Bratislave</strong>.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-teal-700 mb-3">Článok X – Záverečné ustanovenia</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Neplatnosť alebo nevymáhateľnosť niektorého ustanovenia nemá vplyv na platnosť ostatných ustanovení
                  tejto zmluvy. Strany nahradia také ustanovenie ustanovením s čo najbližším významom.
                </li>
                <li>Akékoľvek zmeny tejto zmluvy možno vykonať len písomnými dodatkami podpísanými oboma stranami.</li>
              </ol>
            </section>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Prílohy a prepojenie na VOP:</p>
              <p className="text-sm">
                Zmluvné strany berú na vedomie, že táto zmluva je previazaná s aktuálne platnými VOP pre Firmy
                dostupnými na platforme SOMVIAC a cenovým cenníkom (coin systém). V prípade rozporu má táto zmluva
                prednosť v otázkach ceny za Kontakt, kreditovej podmienky, splatnosti a sankcií.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t">
              <div className="text-center">
                <p className="mb-4">V ........................................ dňa ......................</p>
                <p className="font-semibold mb-8">Za Sprostredkovateľa</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-sm">Podpis</p>
                </div>
              </div>
              <div className="text-center">
                <p className="mb-4">V ........................................ dňa ......................</p>
                <p className="font-semibold mb-8">Za Firmu</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-sm">Podpis</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
