"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDynamicTranslation } from "@/lib/hooks/use-dynamic-translation"

interface ContactRevealContractProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (contractData: ContractData) => void
  candidateId: string
  contactPrice: number // in coins
}

interface ContractData {
  companyName: string
  ico: string
  address: string
  representative: string
  email: string
  phone: string
  signatureDate: string
  signaturePlace: string
}

export function ContactRevealContract({
  isOpen,
  onClose,
  onAccept,
  candidateId,
  contactPrice,
}: ContactRevealContractProps) {
  const [contractAccepted, setContractAccepted] = useState(false)
  const [contractData, setContractData] = useState<ContractData>({
    companyName: "",
    ico: "",
    address: "",
    representative: "",
    email: "",
    phone: "",
    signatureDate: new Date().toLocaleDateString("sk-SK"),
    signaturePlace: "Bratislava",
  })
  const { translateText, language } = useDynamicTranslation()
  const [translatedContent, setTranslatedContent] = useState<{
    title: string
    summary: string
    contractText: string
  } | null>(null)

  useEffect(() => {
    const translateContract = async () => {
      if (language === "sk") {
        setTranslatedContent(null)
        return
      }

      try {
        const title = await translateText("Zmluva o sprostredkovaní kontaktu", "contract_title")
        const summary = await translateText(
          "Pred odhalením kontaktu na kandidáta musíte podpísať túto zmluvu",
          "contract_summary",
        )
        const contractText = await translateText("ZMLUVA O SPROSTREDKOVANÍ KONTAKTU", "contract_header")

        setTranslatedContent({
          title,
          summary,
          contractText,
        })
      } catch (error) {
        console.error("Contract translation error:", error)
        setTranslatedContent(null)
      }
    }

    if (isOpen) {
      translateContract()
    }
  }, [language, isOpen, translateText])

  const handleAccept = () => {
    if (contractAccepted && isFormValid()) {
      onAccept(contractData)
    }
  }

  const isFormValid = () => {
    return Object.values(contractData).every((value) => value.trim() !== "")
  }

  const totalPrice = contactPrice * 6 // 6 months maximum
  const creditRequired = Math.ceil(totalPrice * 0.5) // 50% credit requirement

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-600">
            {translatedContent?.title || "Zmluva o sprostredkovaní kontaktu"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {translatedContent?.summary || "Pred odhalením kontaktu na kandidáta musíte podpísať túto zmluvu"}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Summary */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
            <h3 className="font-semibold text-orange-800">Súhrn zmluvy:</h3>
            <ul className="text-sm text-orange-700 mt-2 space-y-1">
              <li>
                • Cena kontaktu:{" "}
                <strong>
                  {contactPrice} coinov/mesiac × 6 mesiacov = {totalPrice} coinov
                </strong>
              </li>
              <li>
                • Kreditová podmienka: <strong>{creditRequired} coinov</strong> (50% z celkovej ceny)
              </li>
              <li>• Mesačné platby počas zamestnania (max 6 mesiacov)</li>
              <li>
                • Pokuta za obchádzanie: <strong>5,000 €</strong>
              </li>
              <li>• Výpovedná lehota: 30 dní</li>
            </ul>
          </div>

          {/* Company Information Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Obchodné meno *</Label>
              <Input
                id="companyName"
                value={contractData.companyName}
                onChange={(e) => setContractData((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Názov firmy"
              />
            </div>
            <div>
              <Label htmlFor="ico">IČO/DIČ/IČ DPH *</Label>
              <Input
                id="ico"
                value={contractData.ico}
                onChange={(e) => setContractData((prev) => ({ ...prev, ico: e.target.value }))}
                placeholder="12345678"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address">Sídlo *</Label>
              <Input
                id="address"
                value={contractData.address}
                onChange={(e) => setContractData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Ulica 123, 821 08 Bratislava"
              />
            </div>
            <div>
              <Label htmlFor="representative">Zastúpená *</Label>
              <Input
                id="representative"
                value={contractData.representative}
                onChange={(e) => setContractData((prev) => ({ ...prev, representative: e.target.value }))}
                placeholder="Meno Priezvisko, pozícia"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail/Telefón *</Label>
              <Input
                id="email"
                value={contractData.email}
                onChange={(e) => setContractData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@firma.sk / +421 900 123 456"
              />
            </div>
            <div>
              <Label htmlFor="signaturePlace">Miesto podpisu *</Label>
              <Input
                id="signaturePlace"
                value={contractData.signaturePlace}
                onChange={(e) => setContractData((prev) => ({ ...prev, signaturePlace: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="signatureDate">Dátum podpisu *</Label>
              <Input
                id="signatureDate"
                value={contractData.signatureDate}
                onChange={(e) => setContractData((prev) => ({ ...prev, signatureDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Contract Text */}
          <ScrollArea className="h-64 border rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-teal-600 border-b-2 border-teal-600 pb-2">
                {translatedContent?.contractText || "ZMLUVA O SPROSTREDKOVANÍ KONTAKTU"}
              </h3>

              <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                uzatvorená podľa § 269 ods. 2 Obchodného zákonníka (SR) – nejde o zmluvu podľa zákona o agentúrach
                dočasného zamestnávania
              </div>

              <h4 className="text-teal-500 mt-6">Článok I – Zmluvné strany a definície</h4>
              <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                <strong>Definície:</strong>
                <br />
                <em>Kontakt</em> – sprístupnenie osobných údajov kandidáta Firme.
                <br />
                <em>Index</em> – mesačná cena za Kontakt podľa Prílohy č. 1 (Cenník), vyjadrená v coinoch.
                <br />
                <em>Celková cena kontaktu</em> – 6 × Index (maximálne 6 mesiacov).
              </div>

              <div className="border p-3 rounded mb-4">
                <p>
                  <strong>Sprostredkovateľ:</strong>
                  <br />
                  <strong>SOMVIAC</strong> – Oskar Nagy, Bajzova 1, 821 08 Bratislava, IČO: 57226202, Tel.: 0902 120
                  258, E‑mail: oskar.nagy@gmail.com
                </p>

                <p>
                  <strong>Firma (Odberateľ):</strong>
                  <br />
                  Obchodné meno:{" "}
                  <strong>{contractData.companyName || "..........................................."}</strong>
                  <br />
                  IČO/DIČ/IČ DPH: <strong>{contractData.ico || "..........................................."}</strong>
                  <br />
                  Sídlo:{" "}
                  <strong>
                    {contractData.address || "....................................................................."}
                  </strong>
                  <br />
                  Zastúpená:{" "}
                  <strong>
                    {contractData.representative || "................................................................."}
                  </strong>
                  <br />
                  E‑mail/Telefón:{" "}
                  <strong>
                    {contractData.email || "............................................................"}
                  </strong>
                </p>

                <p>
                  <strong>Dátum účinnosti zmluvy:</strong> <strong>{contractData.signatureDate}</strong>
                </p>
              </div>

              <h4 className="text-teal-500">Článok II – Predmet zmluvy</h4>
              <ol className="text-sm">
                <li>
                  Sprostredkovateľ sa zaväzuje poskytnúť Firme službu <em>sprístupnenia kontaktu</em> na vybraných
                  kandidátov vedených v databáze SOMVIAC (ďalej len „Kontakt").
                </li>
                <li>
                  Zmluvné strany berú na vedomie, že Sprostredkovateľ nevykonáva činnosť agentúry dočasného
                  zamestnávania a nie je stranou pracovnoprávneho vzťahu medzi Firme a kandidátom. Služba má povahu
                  sprístupnenia Kontaktu a súvisiacich údajov v zmysle VOP.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok III – Cena a platobné podmienky</h4>
              <p className="text-sm">
                Cena za Kontakt je určená podľa <strong>Indexu</strong> uvedeného v Prílohe č. 1 (Cenník). Index je
                pevne stanovený a nie je odvodený od mzdy kandidáta.
              </p>
              <ol className="text-sm">
                <li>
                  <strong>Pevná cena za Kontakt:</strong> Cena za sprístupnenie Kontaktu je stanovená podľa platného
                  cenníka v coinoch na platforme SOMVIAC a <strong>nie je odvodená od mzdy</strong> ani iných pracovných
                  podmienok kandidáta.
                </li>
                <li>
                  <strong>Kreditová podmienka:</strong> Pred sprístupnením Kontaktu musí mať Firma na účte platformy k
                  dispozícii minimálne <strong>50&nbsp;%</strong> z celkovej ceny Kontaktu. Po splnení podmienky Firma
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
                <li>
                  <strong>Fixácia Indexu:</strong> Pre každý sprístupnený Kontakt platí Index podľa cenníka účinného v
                  deň sprístupnenia a zostáva fixný počas celého obdobia až do 6 mesiacov. Zmeny cenníka sa uplatnia len
                  na nové Kontakty a nemajú spätnú účinnosť.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok IV – Povinnosti a spolupráca</h4>
              <ol className="text-sm">
                <li>
                  Firma je povinná oznámiť Sprostredkovateľovi uzatvorenie pracovného pomeru s kandidátom najneskôr do{" "}
                  <strong>7 dní</strong> od podpisu pracovnej zmluvy a rovnako oznámiť skončenie pracovného pomeru.
                </li>
                <li>
                  Firma sa zaväzuje používať poskytnuté osobné údaje kandidátov výlučne na účely náboru a v súlade s
                  GDPR a VOP.
                </li>
                <li>
                  Sprostredkovateľ zabezpečí sprístupnenie Kontaktu po splnení kreditovej podmienky a autorizácii Firme.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok V – Zákaz obchádzania a sankcie</h4>
              <ol className="text-sm">
                <li>
                  Firma sa zaväzuje neobchádzať Sprostredkovateľa a platformu SOMVIAC. Za obchádzanie sa považuje najmä:
                  získanie Kontaktu mimo platformy, kontaktovanie kandidáta bez splnenia kreditovej podmienky a
                  autorizácie, alebo využitie Kontaktu na vznik pracovného pomeru bez riadneho uhrádzania mesačných
                  platieb.
                </li>
                <li>
                  V prípade porušenia tohto článku je Firma povinná uhradiť Sprostredkovateľovi{" "}
                  <strong>zmluvnú pokutu vo výške 5&nbsp;000&nbsp;€</strong> za každé jednotlivé porušenie. Tým nie je
                  dotknuté právo Sprostredkovateľa na náhradu škody v plnom rozsahu a na úhradu všetkých neuhradených
                  častí ceny Kontaktu.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok VI – Zodpovednosť a obmedzenia</h4>
              <ol className="text-sm">
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

              <h4 className="text-teal-500">Článok VII – Dôvernosť a ochrana údajov</h4>
              <ol className="text-sm">
                <li>
                  Strany sa zaväzujú zachovávať mlčanlivosť o všetkých informáciách, ktoré sa dozvedia pri plnení tejto
                  zmluvy, a to aj po jej ukončení.
                </li>
                <li>
                  Spracúvanie osobných údajov sa riadi zásadami ochrany osobných údajov SOMVIAC a VOP pre Firmy; Firma
                  je v postavení samostatného prevádzkovateľa vo vzťahu k údajom, ktoré jej boli sprístupnené.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok VIII – Trvanie a ukončenie</h4>
              <ol className="text-sm">
                <li>Zmluva sa uzatvára na dobu neurčitú.</li>
                <li>
                  Ktorákoľvek zo strán môže zmluvu vypovedať písomne s <strong>30‑dňovou</strong> výpovednou lehotou.
                </li>
                <li>
                  Ukončenie zmluvy sa nedotýka nárokov na úhradu už splatných alebo vzniknutých platieb a zmluvných
                  pokút.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok IX – Rozhodné právo, riešenie sporov</h4>
              <ol className="text-sm">
                <li>Táto zmluva sa spravuje právnym poriadkom Slovenskej republiky.</li>
                <li>
                  Spory vyplývajúce z tejto zmluvy budú riešené pred vecne a miestne príslušným súdom v{" "}
                  <strong>Bratislave</strong>.
                </li>
              </ol>

              <h4 className="text-teal-500">Článok X – Záverečné ustanovenia</h4>
              <ol className="text-sm">
                <li>
                  Neplatnosť alebo nevymáhateľnosť niektorého ustanovenia nemá vplyv na platnosť ostatných ustanovení
                  tejto zmluvy. Strany nahradia také ustanovenie ustanovením s čo najbližším významom.
                </li>
                <li>Akékoľvek zmeny tejto zmluvy možno vykonať len písomnými dodatkami podpísanými oboma stranami.</li>
              </ol>

              <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                <strong>Prílohy a prepojenie na VOP:</strong> Zmluvné strany berú na vedomie, že táto zmluva je
                previazaná s aktuálne platnými VOP pre Firmy dostupnými na platforme SOMVIAC a cenovým cenníkom (coin
                systém). V prípade rozporu má táto zmluva prednosť v otázkach ceny za Kontakt, kreditovej podmienky,
                splatnosti a sankcií.
              </div>

              <h4 className="text-teal-500 mt-6">Príloha č. 1 – Cenník testov (Index pre testy)</h4>
              <p className="text-sm mb-3">Nižšie je vložený aktuálny cenník testov. Tento cenník je súčasťou zmluvy.</p>
              <p className="text-xs text-gray-600 mb-4">
                Ceny sú uvedené v EUR s DPH / bez DPH podľa fakturácie. Tento cenník je prílohou zmlúv a AGB.
              </p>

              <h5 className="text-sm font-semibold text-teal-600 mb-2">Základné testy (7)</h5>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border border-gray-300 p-2 text-left">Názov testu</th>
                      <th className="border border-gray-300 p-2 text-left">Popis</th>
                      <th className="border border-gray-300 p-2 text-center">Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Pracovné zručnosti na danú pozíciu</td>
                      <td className="border border-gray-300 p-2">Prispôsobené požiadavkám pozície</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">29 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Jazykové schopnosti a úroveň</td>
                      <td className="border border-gray-300 p-2">Úroveň A1–C2</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">zadarmo</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Digitálna gramotnosť</td>
                      <td className="border border-gray-300 p-2">Základné digitálne zručnosti</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">zadarmo</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Situational Judgement Test (SJT)</td>
                      <td className="border border-gray-300 p-2">Správanie v modelových situáciách</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">24 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Logické a numerické uvažovanie</td>
                      <td className="border border-gray-300 p-2">Logika a práca s číslami</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">18 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Verbálne porozumenie a komunikácia</td>
                      <td className="border border-gray-300 p-2">Textová a verbálna analýza</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">15 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Pozornosť k detailu a kvalita</td>
                      <td className="border border-gray-300 p-2">Konzistentnosť a precíznosť</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">12 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h5 className="text-sm font-semibold text-teal-600 mb-2">Doplnkové testy (4)</h5>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border border-gray-300 p-2 text-left">Názov testu</th>
                      <th className="border border-gray-300 p-2 text-left">Popis</th>
                      <th className="border border-gray-300 p-2 text-center">Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Plánovanie práce a priority</td>
                      <td className="border border-gray-300 p-2">Time-management a prioritizácia</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">14 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Rýchlosť a presnosť zadávania údajov</td>
                      <td className="border border-gray-300 p-2">Datlovanie / data entry</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">9 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Zákaznícka orientácia</td>
                      <td className="border border-gray-300 p-2">Prístup ku klientom</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">14 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">BOZP – základné povedomie</td>
                      <td className="border border-gray-300 p-2">Bezpečnosť a zdravie pri práci</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold">9 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h5 className="text-sm font-semibold text-teal-600 mb-2">Balíky (výhodnejšie)</h5>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border border-gray-300 p-2 text-left">Názov balíka</th>
                      <th className="border border-gray-300 p-2 text-left">Obsah</th>
                      <th className="border border-gray-300 p-2 text-center">Cena</th>
                      <th className="border border-gray-300 p-2 text-center">Bežná cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Základný balík</td>
                      <td className="border border-gray-300 p-2">Všetkých 7 základných testov</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">89 €</td>
                      <td className="border border-gray-300 p-2 text-center text-gray-500 line-through">98 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Doplnkový balík</td>
                      <td className="border border-gray-300 p-2">Všetky 4 doplnkové testy</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">39 €</td>
                      <td className="border border-gray-300 p-2 text-center text-gray-500 line-through">46 €</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Kompletný balík</td>
                      <td className="border border-gray-300 p-2">Všetkých 11 testov</td>
                      <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">119 €</td>
                      <td className="border border-gray-300 p-2 text-center text-gray-500 line-through">146 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-xs mb-4">
                <strong>Poznámky:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Testy sú spoplatnené nezávisle od ceny za sprístupnenie kontaktu</li>
                  <li>• Ceny testov sa neupravujú podľa mzdy kandidáta</li>
                  <li>• Objednávka testu sa spúšťa až po autorizácii a overení krytia</li>
                  <li>• Po spustení testu je poplatok nevratný</li>
                </ul>
              </div>

              <h4 className="text-teal-500">Príloha č. 2 – Cenník za povolania (Kontakt – Index)</h4>
              <p className="text-sm mb-3">Aktuálny cenník za sprístupnenie kontaktu (Index) je dostupný online:</p>
              <div className="bg-gray-100 p-3 rounded text-sm mb-3">
                <a
                  href="european-jobs-browser.newkey.html"
                  target="_blank"
                  className="text-teal-600 underline"
                  rel="noreferrer"
                >
                  Otvoriť cenník za povolania (HTML)
                </a>
              </div>
              <p className="text-xs text-gray-600">
                Pre túto zmluvu platí verzia cenníka účinná v deň sprístupnenia kontaktu.
              </p>

              <div className="text-xs text-gray-600 mt-4">
                Kompletná zmluva v plnom znení je k dispozícii v účte Firmy po podpísaní.
              </div>
            </div>
          </ScrollArea>

          {/* Contract Acceptance */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox id="contract-accept" checked={contractAccepted} onCheckedChange={setContractAccepted} />
            <div className="space-y-1">
              <Label
                htmlFor="contract-accept"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Súhlasím so zmluvou o sprostredkovaní kontaktu
              </Label>
              <p className="text-xs text-muted-foreground">
                Elektronickým podpisom potvrdzujem, že som si prečítal/a celú zmluvu, rozumiem jej obsahu a súhlasím s
                jej podmienkami.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Zrušiť
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!contractAccepted || !isFormValid()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Elektronicky podpísať zmluvu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
