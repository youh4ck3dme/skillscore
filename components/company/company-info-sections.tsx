"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardList,
  Heart,
  Info,
  CheckCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileCheck,
} from "lucide-react"

interface CompanyInfoSectionsProps {
  onContractSign?: () => void
  contractSigned?: boolean
  contractData?: {
    company_name?: string
    contact_person?: string
    email?: string
    phone?: string
    address?: string
    ico?: string
    dic?: string
    signed_at?: string
    contract_text?: string
  }
}

export function CompanyInfoSections({ onContractSign, contractSigned, contractData }: CompanyInfoSectionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4">
      {/* Zmluva */}
      <Collapsible open={openSections.contract} onOpenChange={() => toggleSection("contract")}>
        <Card className={!contractSigned ? "border-orange-300 bg-orange-50/50" : "border-green-200 bg-green-50/30"}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className={`h-5 w-5 ${contractSigned ? "text-green-600" : "text-primary"}`} />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Zmluva
                      {!contractSigned ? (
                        <span className="text-orange-500 text-sm font-normal">(vyžaduje sa)</span>
                      ) : (
                        <span className="text-green-600 text-sm font-normal flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> Podpísaná
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>Rámcová zmluva o využívaní platformy SOMVIAC</CardDescription>
                  </div>
                </div>
                {openSections.contract ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {contractSigned && contractData ? (
                <div className="space-y-6">
                  {/* Signed contract info banner */}
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Zmluva bola podpísaná</p>
                      <p className="text-sm text-green-700">
                        Dňa{" "}
                        {contractData.signed_at ? new Date(contractData.signed_at).toLocaleDateString("sk-SK") : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Company data from signed contract */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Údaje firmy v zmluve
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Firma:</span>
                        <span className="font-medium">{contractData.company_name || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Zastúpená:</span>
                        <span className="font-medium">{contractData.contact_person || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{contractData.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Telefón:</span>
                        <span className="font-medium">{contractData.phone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Sídlo:</span>
                        <span className="font-medium">{contractData.address || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">IČO:</span>
                        <span className="font-medium">{contractData.ico || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">DIČ:</span>
                        <span className="font-medium">{contractData.dic || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Full contract text */}
                  <div className="border rounded-lg">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                      <h4 className="font-semibold text-gray-700">Plné znenie zmluvy</h4>
                    </div>
                    <div className="p-4 max-h-[500px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                        {contractData.contract_text || "Zmluva nie je dostupná"}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                /* Original unsigned contract template */
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-bold text-center mb-4">RÁMCOVÁ ZMLUVA O VYUŽÍVANÍ PLATFORMY SOMVIAC</h3>
                  <p className="text-center text-muted-foreground mb-6">(verzia s coin systémom a Index cenou)</p>
                  <p className="text-center mb-8">uzatvorená podľa § 269 ods. 2 Obchodného zákonníka</p>

                  {/* Článok 1 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 1 – ZMLUVNÉ STRANY</h4>
                    <div className="mt-2 space-y-2">
                      <p className="font-semibold">1.1 Poskytovateľ (Prevádzkovateľ platformy)</p>
                      <p>
                        SOMVIAC
                        <br />
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
                        (ďalej len „Poskytovateľ")
                      </p>

                      <p className="font-semibold mt-4">1.2 Odberateľ (Firma)</p>
                      <p className="text-muted-foreground italic">
                        Údaje budú doplnené po vyplnení profilu firmy a podpísaní zmluvy.
                      </p>
                    </div>
                  </div>

                  {/* Článok 2 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 2 – CHARAKTER SLUŽBY</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>2.1</strong> Poskytovateľ vyhlasuje a Firma berie na vedomie, že:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>SOMVIAC je online platforma a testovací/filtračný nástroj,</li>
                        <li>Poskytovateľ NIE je agentúra dočasného zamestnávania,</li>
                        <li>
                          Poskytovateľ neposkytuje sprostredkovanie zamestnania za úhradu v zmysle osobitných predpisov,
                        </li>
                        <li>
                          Poplatky (ak existujú) sú výlučne za služby platformy a administratívnu/technickú podporu.
                        </li>
                      </ul>
                      <p>
                        <strong>2.2</strong> Táto zmluva nijakým spôsobom neupravuje pracovnoprávne ani obdobné zmluvné
                        vzťahy medzi Firmou a kandidátmi. Poskytovateľ nevstupuje do týchto vzťahov, nekoná v mene
                        kandidátov a nezodpovedá za obsah dohôd medzi Firmou a kandidátmi.
                      </p>
                    </div>
                  </div>

                  {/* Článok 3 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 3 – PREDMET ZMLUVY</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>3.1</strong> Predmetom tejto zmluvy je úprava podmienok, za ktorých Poskytovateľ umožní
                        Firme využívať platformu SOMVIAC najmä na:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>vyhľadávanie kandidátov v anonymizovanej databáze,</li>
                        <li>sprístupnenie kontaktných údajov vybraných kandidátov („Odkrytie kontaktu"),</li>
                        <li>objednávanie testov a testovacích balíkov pre kandidátov a/alebo zamestnancov Firmy,</li>
                        <li>využívanie retenčných testov pre vlastných zamestnancov,</li>
                        <li>prístup k reportom a analytickým výstupom.</li>
                      </ul>
                      <p>
                        <strong>3.2</strong> Táto zmluva je rámcová. Konkrétne jednotlivé plnenia (Odkrytie kontaktu,
                        testy, retenčné balíky, moduly) sa realizujú formou online úkonov v rozhraní platformy SOMVIAC
                        podľa aktuálneho cenníka a Index ceny.
                      </p>
                      <p>
                        <strong>3.3</strong> Podrobnosti o technickom fungovaní platformy a pravidlách používania sú
                        uvedené vo Všeobecných obchodných podmienkach (VOP) a v zásadách ochrany osobných údajov
                        Poskytovateľa, ktoré sú neoddeliteľnou súčasťou tejto zmluvy.
                      </p>
                    </div>
                  </div>

                  {/* Článok 4 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 4 – COIN SYSTÉM A INDEX CENA</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>4.1</strong> Platforma používa interný kreditný systém („coiny").{" "}
                        <strong>1 coin spravidla zodpovedá 1 EUR</strong>, pokiaľ cenník neustanovuje inak.
                      </p>
                      <p>
                        <strong>4.2</strong> Firma si dobíja coiny:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>jednorazovým nákupom kreditov (predplatený balík),</li>
                        <li>alebo iným dohodnutým spôsobom podľa individuálnej cenovej dohody.</li>
                      </ul>
                      <p>
                        <strong>4.3</strong> „Index cena" je súhrnná cena za využitie kontaktu na kandidáta podľa
                        platného cenníka Poskytovateľa. Konkrétna výška Index ceny je vždy uvedená v cenníku alebo
                        individuálnej ponuke.
                      </p>
                      <p>
                        <strong>4.4</strong> Coiny slúžia:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>na úhradu testov a retenčných balíkov,</li>
                        <li>
                          ako garancia schopnosti Firmy uhrádzať Index cenu v prípade zamestnania kandidáta podľa článku
                          6 a 7.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Článok 5 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 5 – ODKRYTIE KONTAKTU NA KANDIDÁTA</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>5.1</strong> Profily kandidátov sú Firme najskôr zobrazované anonymizovane (bez mena a
                        priameho kontaktu). Odkrytie kontaktu znamená sprístupnenie:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>e-mailovej adresy kandidáta, alebo</li>
                        <li>telefónneho čísla kandidáta,</li>
                      </ul>
                      <p>podľa toho, čo kandidát v platforme zvolil.</p>
                      <p>
                        <strong>5.2</strong> Firma neplatí samostatný poplatok za samotné Odkrytie kontaktu. Odkrytie
                        kontaktu je však podmienené minimálnym zostatkom coinov na účte Firmy podľa bodu 5.3.
                      </p>
                      <p>
                        <strong>5.3</strong> Podmienka minimálneho zostatku coinov:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Firma môže mať odkrytých 1–15 kontaktov kandidátov len vtedy, ak má na účte minimálne{" "}
                          <strong>100 coinov</strong>.
                        </li>
                        <li>
                          Pri 16–30 odkrytých kontaktoch musí mať na účte minimálne <strong>200 coinov</strong>.
                        </li>
                        <li>
                          Pri 31–45 odkrytých kontaktoch minimálne <strong>300 coinov</strong>.
                        </li>
                        <li>
                          Rovnaká logika platí aj ďalej – za každých začatých 15 odkrytých kontaktov musí mať Firma na
                          účte minimálne 100 coinov.
                        </li>
                      </ul>
                      <p>
                        <strong>5.4</strong> Ak Firma nespĺňa podmienku minimálneho zostatku podľa bodu 5.3, systém jej
                        technicky neumožní Odkrytie kontaktu.
                      </p>
                      <p>
                        <strong>5.5</strong> Pri Odkrytí kontaktu sa coiny z účtu Firmy neodpočítavajú. Coiny plnia
                        funkciu finančnej garancie pri prípadnom neskoršom zamestnaní kandidáta podľa článku 6 a 7.
                      </p>
                    </div>
                  </div>

                  {/* Článok 6 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 6 – OZNAČENIE „ZAMESTNAŤ KANDIDÁTA"</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>6.1</strong> Ak Firma po výbere kandidáta dospeje k rozhodnutiu uzavrieť s kandidátom
                        pracovnoprávny, dohodársky, živnostenský alebo iný obdobný zmluvný vzťah (ďalej len
                        „Spolupráca"), zaväzuje sa:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>kliknúť v profile kandidáta v platforme SOMVIAC na tlačidlo „Zamestnať kandidáta",</li>
                        <li>uviesť dátum začiatku Spolupráce (dátum nástupu),</li>
                        <li>
                          uviesť deň v mesiaci, ktorý zodpovedá pravidelnému výplatnému cyklu kandidáta (ďalej len „Deň
                          vyplatenia").
                        </li>
                      </ul>
                      <p>
                        <strong>6.2</strong> Kliknutím na „Zamestnať kandidáta":
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          vzniká Poskytovateľovi nárok na úhradu Index ceny za využitie kontaktu, v rozsahu podľa článku
                          7,
                        </li>
                        <li>z účtu Firmy sa v tomto momente neodpočítavajú žiadne coiny,</li>
                        <li>kontroluje sa iba splnenie podmienky minimálneho zostatku podľa bodu 6.3.</li>
                      </ul>
                      <p>
                        <strong>6.3</strong> Podmienka minimálneho zostatku pri označení „Zamestnať kandidáta":
                      </p>
                      <p>
                        Firma sa zaväzuje, že v momente kliknutia na „Zamestnať kandidáta" bude mať na účte coinov
                        minimálne <strong>50 % z celkovej Index ceny</strong> kandidáta podľa cenníka. Bez splnenia
                        tejto podmienky systém úkon „Zamestnať kandidáta" nedokončí.
                      </p>
                    </div>
                  </div>

                  {/* Článok 7 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 7 – SPLÁCANIE INDEX CENY A MAXIMÁLNE OBDOBIE</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>7.1</strong> Index cena sa uhrádza v mesačných splátkach („Mesačná index platba")
                        najviac počas obdobia <strong>6 po sebe idúcich mesiacov</strong> od dátumu nástupu kandidáta.
                      </p>
                      <p>
                        <strong>7.2</strong> Vznik nároku na Mesačnú index platbu:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          prvý nárok na Mesačnú index platbu vzniká až po tom, čo kandidát odpracuje prvé celé dohodnuté
                          obdobie do Dňa vyplatenia,
                        </li>
                        <li>
                          ak kandidát ukončí Spoluprácu pred prvým Dňom vyplatenia, nevzniká nárok na žiadnu Mesačnú
                          index platbu,
                        </li>
                        <li>
                          ďalšie Mesačné index platby vznikajú vždy len spätne za obdobia, ktoré kandidát reálne
                          odpracoval až do príslušného Dňa vyplatenia,
                        </li>
                        <li>
                          nárok na Mesačné index platby môže vzniknúť najviac 6-krát po sebe (maximálne 6 mesiacov od
                          dátumu nástupu).
                        </li>
                      </ul>
                      <p>
                        <strong>7.3</strong> Splatnosť a odpočítanie coinov:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>každá Mesačná index platba je splatná 10 dní po príslušnom Dni vyplatenia,</li>
                        <li>v tento deň systém skontroluje zostatok coinov na účte Firmy,</li>
                        <li>
                          ak je zostatok dostatočný, automaticky odpočíta príslušný počet coinov za danú Mesačnú index
                          platbu,
                        </li>
                        <li>
                          ak zostatok nie je dostatočný, platba sa neuskutoční, avšak peňažný nárok Poskytovateľa na
                          úhradu danej Mesačnej index platby trvá a môže byť fakturovaný.
                        </li>
                      </ul>
                      <p>
                        <strong>7.4</strong> Notifikácie:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          5 dní pred plánovaným odpočítaním coinov za Mesačnú index platbu dostane Firma upozornenie,
                        </li>
                        <li>
                          ak v deň splatnosti nie je zostatok coinov dostatočný, systém zasiela Firme opakované denné
                          upozornenia na potrebu dobitia coinov až do uhradenia danej Mesačnej index platby.
                        </li>
                      </ul>
                      <p>
                        <strong>7.5</strong> Po uplynutí maximálneho obdobia 6 mesiacov od nástupu kandidáta už
                        Poskytovateľ nemá nárok na ďalšie Mesačné index platby, bez ohľadu na to, či Spolupráca s
                        kandidátom trvá dlhšie.
                      </p>
                    </div>
                  </div>

                  {/* Článok 8 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 8 – NEZAMESTNANIE KANDIDÁTA</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>8.1</strong> Ak Firma kandidáta, ktorého kontakt odkryla, nikdy neoznačí v systéme ako
                        „Zamestnať kandidáta" a zároveň s ním reálne neuzavrie žiadnu Spoluprácu, nevzniká
                        Poskytovateľovi žiadny nárok na úhradu Index ceny.
                      </p>
                      <p>
                        <strong>8.2</strong> Ak však Firma reálne uzavrie s kandidátom Spoluprácu, ale neoznačí ho v
                        systéme ako „Zamestnať kandidáta", považuje sa to za porušenie tejto zmluvy a článku 9 (zákaz
                        obchádzania platformy).
                      </p>
                    </div>
                  </div>

                  {/* Článok 9 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 9 – ZÁKAZ OBCHÁDZANIA PLATFORMY A ZMLUVNÁ POKUTA</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>9.1</strong> Firma sa zaväzuje, že nebude obchádzať platformu SOMVIAC, najmä nie tak,
                        že:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          použije kontaktné údaje kandidáta získané z platformy a uzavrie s kandidátom Spoluprácu mimo
                          oficiálneho označenia „Zamestnať kandidáta" v systéme,
                        </li>
                        <li>
                          vedome neoznačí v systéme zamestnanie kandidáta, napriek tomu, že s ním uzavrela Spoluprácu,
                        </li>
                        <li>
                          poskytne kontaktné údaje kandidáta tretej osobe (iná firma, agentúra) za účelom uzavretia
                          Spolupráce mimo platformy SOMVIAC.
                        </li>
                      </ul>
                      <p>
                        <strong>9.2</strong> Za každé porušenie povinností podľa bodu 9.1 sa Firma zaväzuje uhradiť
                        Poskytovateľovi zmluvnú pokutu vo výške <strong>3 000 EUR</strong> za každého dotknutého
                        kandidáta.
                      </p>
                      <p>
                        <strong>9.3</strong> Uhradením zmluvnej pokuty nie je dotknutý nárok Poskytovateľa na náhradu
                        škody v plnom rozsahu.
                      </p>
                      <p>
                        <strong>9.4</strong> Poskytovateľ je oprávnený v prípade závažného alebo opakovaného porušenia
                        článku 9:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>obmedziť alebo zablokovať prístup Firmy do platformy,</li>
                        <li>odstúpiť od tejto zmluvy s okamžitou účinnosťou.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Článok 10 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 10 – TESTOVACIE SLUŽBY A RETENČNÉ TESTY</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>10.1</strong> Firma môže prostredníctvom platformy objednávať testy pre kandidátov a
                        svojich zamestnancov, vrátane retenčných testov.
                      </p>
                      <p>
                        <strong>10.2</strong> Cena jednotlivých testov a balíkov je stanovená v cenníku Poskytovateľa.
                        Pred potvrdením objednávky je vždy zobrazená v coinoch alebo v EUR.
                      </p>
                      <p>
                        <strong>10.3</strong> Test sa považuje za objednaný a záväzný v momente potvrdenia objednávky v
                        rozhraní platformy a overenia dostatočného kreditného krytia.
                      </p>
                      <p>
                        <strong>10.4</strong> Po spustení testu je poplatok za test nevratný, pokiaľ sa Zmluvné strany
                        nedohodnú inak.
                      </p>
                      <p>
                        <strong>10.5</strong> Výsledky testov majú informatívny a orientačný charakter a slúžia ako
                        podklad pre rozhodovanie Firmy. Poskytovateľ nezodpovedá za rozhodnutia Firmy ani výsledok
                        Spolupráce.
                      </p>
                    </div>
                  </div>

                  {/* Článok 11 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 11 – PLATOBNÉ PODMIENKY</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>11.1</strong> Poskytovateľ vystavuje faktúry v EUR na fakturačné údaje Firmy. Štandardná
                        splatnosť je 14 dní, ak sa Zmluvné strany nedohodnú inak.
                      </p>
                      <p>
                        <strong>11.2</strong> V prípade omeškania s úhradou je Poskytovateľ oprávnený:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>účtovať zákonné úroky z omeškania,</li>
                        <li>požadovať zmluvnú pokutu, ak je osobitne dohodnutá vo VOP alebo cenovej dohode,</li>
                        <li>dočasne obmedziť prístup Firmy k spoplatneným funkciám platformy,</li>
                        <li>pozastaviť sprístupňovanie nových kontaktov a testovacích balíkov až do uhradenia dlhu.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Článok 12 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 12 – DOBA TRVANIA A UKONČENIE ZMLUVY</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>12.1</strong> Zmluva sa uzatvára na dobu neurčitú a nadobúda účinnosť dňom jej podpisu
                        oboma Zmluvnými stranami, prípadne potvrdením v online rozhraní platformy.
                      </p>
                      <p>
                        <strong>12.2</strong> Ktorákoľvek Zmluvná strana môže zmluvu vypovedať s výpovednou lehotou 1
                        mesiac, ktorá začína plynúť prvým dňom mesiaca nasledujúceho po doručení výpovede druhej strane.
                      </p>
                      <p>
                        <strong>12.3</strong> Ukončenie zmluvy nemá vplyv na:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>povinnosť Firmy uhradiť už vzniknuté Mesačné index platby,</li>
                        <li>nárok Poskytovateľa na zaplatenie zmluvných pokút podľa článku 9.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Článok 13 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-primary">Článok 13 – ZÁVEREČNÉ USTANOVENIA</h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <strong>13.1</strong> Právne vzťahy neupravené touto zmluvou sa riadia právnym poriadkom
                        Slovenskej republiky.
                      </p>
                      <p>
                        <strong>13.2</strong> Ak sa niektoré ustanovenie tejto zmluvy stane neplatným alebo neúčinným,
                        ostatné ustanovenia ostávajú nedotknuté a Zmluvné strany ho nahradia ustanovením s významom čo
                        najbližším pôvodnému.
                      </p>
                      <p>
                        <strong>13.3</strong> Zmluva je vyhotovená v dvoch rovnopisoch, z ktorých každá Zmluvná strana
                        obdrží po jednom vyhotovení.
                      </p>
                    </div>
                  </div>

                  {/* Podpisy */}
                  <div className="border-t pt-6 mt-6">
                    <p className="text-center text-muted-foreground mb-6">
                      V Bratislave dňa ..............................
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <p className="font-semibold">Za Poskytovateľa:</p>
                        <p className="mt-8 border-t pt-2">
                          Oskar Nagy
                          <br />
                          SOMVIAC
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">Za Firmu:</p>
                        <p className="mt-8 border-t pt-2">Meno a funkcia</p>
                      </div>
                    </div>
                  </div>

                  {!contractSigned && onContractSign && (
                    <button
                      onClick={onContractSign}
                      className="mt-6 w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                    >
                      Podpísať zmluvu
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.basic} onOpenChange={() => toggleSection("basic")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>13 základných testov</CardTitle>
                    <CardDescription>Detailné vysvetlenie všetkých testov</CardDescription>
                  </div>
                </div>
                {openSections.basic ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <div>
                <h4>ZÁKLADNÉ TESTY (5)</h4>
                <div className="space-y-4">
                  {/* 1) DIGITÁLNE ZRUČNOSTI */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">1) DIGITÁLNE ZRUČNOSTI</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Tento test meria, ako dobre sa kandidát orientuje v bežných kancelárskych nástrojoch – e-maily,
                      dokumenty, tabuľky, online formuláre a jednoduché interné systémy. Firma získa istotu, že nový
                      človek zvládne každodenné úlohy bez dlhého zaškoľovania a bez zbytočných chýb pri práci s
                      počítačom.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>schopnosť používať e-mail v pracovnom kontexte (prílohy, odpovede, kopie)</li>
                      <li>práca s dokumentmi a tabuľkami (úpravy, jednoduché vzorce, formátovanie)</li>
                      <li>bezpečné správanie v online prostredí (phishing, podozrivé linky, prístupové údaje)</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane situáciu, kde musí poslať dokument viacerým ľuďom – rozhoduje, či použiť
                        „Odpovedať všetkým", „Kópia (CC)" alebo „Skrytá kópia (BCC)".
                      </li>
                      <li>
                        Vidí ukážku tabuľky, kde je narušený jednoduchý vzorec (napr. súčet stĺpca) a má označiť, čo je
                        potrebné opraviť.
                      </li>
                      <li>
                        Dostane opis podozrivého e-mailu (napr. falošná banka) a má určiť, ako má správne zareagovať,
                        aby neohrozil firmu.
                      </li>
                    </ol>
                  </div>

                  {/* 2) IT SCHOPNOSTI */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">2) IT SCHOPNOSTI</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Test IT schopností je určený pre pozície, kde kandidát pracuje so systémami, aplikáciami alebo
                      rieši jednoduché technické problémy. Pomáha odlíšiť ľudí, ktorí vedia IT používať iba „pasívne",
                      od tých, ktorí dokážu cítiť logiku systémov a riešiť problémy samostatne.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>orientácia v IT prostredí (systémy, prístupy, nastavenia)</li>
                      <li>základné logické myslenie pri riešení technických problémov</li>
                      <li>
                        schopnosť zvoliť správny postup pri bežných IT situáciách (zabudnuté heslo, nefunkčná aplikácia,
                        aktualizácie)
                      </li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát rieši situáciu, v ktorej sa nevie prihlásiť do systému – má určiť najlogickejší prvý
                        krok (napr. skontrolovať pripojenie, heslo, Caps Lock, IT helpdesk).
                      </li>
                      <li>
                        Vidí popis jednoduchého interného systému a má identifikovať, čo spôsobí konkrétnu chybu (napr.
                        duplicitný záznam, zle vyplnené pole).
                      </li>
                      <li>
                        V modelovej situácii musí určiť, kedy je vhodné reštartovať zariadenie, kedy kontaktovať IT
                        oddelenie a kedy je problém na strane používateľa.
                      </li>
                    </ol>
                  </div>

                  {/* 3) JAZYKOVÉ ZRUČNOSTI */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">3) JAZYKOVÉ ZRUČNOSTI</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Jazykový test overuje, či kandidát dokáže jazyk, ktorý uvádza v životopise, reálne používať v
                      práci – pri čítaní e-mailov, dokumentov, interných pokynov alebo jednoduchých hovoroch. Firma sa
                      tak vyhne situácii, keď kandidát deklaruje úroveň „B2/C1", ale nerozumie základným inštrukciám.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>porozumenie písanému textu v cudzom jazyku</li>
                      <li>schopnosť pracovať s pracovnými inštrukciami a e-mailovou komunikáciou</li>
                      <li>gramatická a lexikálna úroveň v bežných pracovných situáciách</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane krátky e-mail v cudzom jazyku (napr. angličtina) a má určiť, čo od neho
                        odosielateľ naozaj požaduje.
                      </li>
                      <li>
                        Vidí niekoľko možností prekladu konkrétnej pracovnej vety (napr. v objednávke alebo zmluve) a
                        vyberá tú, ktorá najlepšie vystihuje význam.
                      </li>
                      <li>
                        Test obsahuje krátky pracovný inzerát alebo internú smernicu a kandidát odpovedá na otázky,
                        ktoré preveria, či textu porozumel správne.
                      </li>
                    </ol>
                  </div>

                  {/* 4) PRACOVNÉ ZRUČNOSTI */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">4) PRACOVNÉ ZRUČNOSTI</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Test pracovných zručností overuje praktický „sedliacky rozum" v kontexte práce – organizáciu dňa,
                      prácu s informáciami, základnú komunikáciu so zákazníkom či kolegami. Firma vďaka nemu vidí, či
                      kandidát zvládne typické situácie na danej pozícii bez neustáleho dohľadu.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>organizácia práce a nastavovanie priorít</li>
                      <li>riešenie jednoduchých konfliktov alebo nejasností</li>
                      <li>bežná pracovná komunikácia (interná aj smerom ku klientom)</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane zoznam úloh na deň (telefonáty, e-maily, úlohy od šéfa) a rozhoduje, v akom
                        poradí je najvhodnejšie ich vybaviť.
                      </li>
                      <li>
                        V scenári nespokojného zákazníka má vybrať taký postup, ktorý zachová profesionalitu a zároveň
                        nezablokuje celý proces.
                      </li>
                      <li>
                        Pri nejasnom zadaní od kolegu alebo manažéra volí medzi viacerými možnosťami – pýtať sa,
                        odhadnúť, odložiť alebo rovno začať – a testuje sa jeho praktický prístup.
                      </li>
                    </ol>
                  </div>

                  {/* 5) SJT ZÁKLADNÝ */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">5) SJT ZÁKLADNÝ</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Základný SJT (Situational Judgement Test) simuluje bežné pracovné situácie – nedorozumenia,
                      konflikty, časový tlak, spoluprácu. Firma vďaka nemu vidí, aký štýl správania kandidát v takýchto
                      situáciách preferuje – či rieši veci otvorene, uhýba, pomáha iným alebo zvykne problematické veci
                      ignorovať.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>štýl komunikácie (priama, nepriama, úhybná)</li>
                      <li>prístup ku konfliktom (konfrontácia, kompromis, únik)</li>
                      <li>ochota prevziať zodpovednosť a spolupracovať</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kolega opakovane nedodrží termín a kandidát rozhoduje, či ho bude kryť, otvorene to riešiť alebo
                        eskalovať na manažéra.
                      </li>
                      <li>
                        V tíme vznikne konflikt medzi dvoma ľuďmi a kandidát si volí, ako by do situácie vstúpil
                        (ignorovať, sprostredkovať, postaviť sa za jedného z nich).
                      </li>
                      <li>
                        Zákazník je nespravodlivo agresívny – kandidát vyberá spôsob, ako reagovať profesionálne, ale
                        bez zbytočného ponižovania seba alebo firmy.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div>
                <h4>POKROČILÉ TESTY (8)</h4>
                <div className="space-y-4">
                  {/* 6) SJT KOGNITÍVNY */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">6) SJT KOGNITÍVNY</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Kognitívny SJT sa zameriava na praktické uvažovanie – ako kandidát vyhodnocuje situácie, kombinuje
                      informácie a volí efektívne riešenia. Firmám pomáha odhaliť, kto dokáže v praxi dobre premýšľať, a
                      nie len teoreticky odpovedať.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>schopnosť vyhodnotiť dôsledky rozhodnutí</li>
                      <li>nastavenie priorít v limitovanom čase</li>
                      <li>praktická logika pri riešení problémov</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane situáciu, v ktorej má naraz tri úlohy, ale čas len na dve – rozhoduje, ktorú
                        vyriešiť neskôr a prečo.
                      </li>
                      <li>
                        Vidí viac spôsobov, ako „uhasiť problém" s klientom, a vyberá ten, ktorý najlepšie kombinuje
                        spokojnosť klienta a efektivitu.
                      </li>
                      <li>
                        V scenári, kde sa objaví chyba v reporte, si kandidát volí postup – priznať, zakryť, opraviť
                        potichu, či riešiť systémovo.
                      </li>
                    </ol>
                  </div>

                  {/* 7) VERBÁLNE ZRUČNOSTI */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">7) VERBÁLNE ZRUČNOSTI</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Verbálny test je dôležitý pre pozície, kde človek pracuje s textami – e-maily, reporty, manuály,
                      interné smernice. Firma získa obraz o tom, či kandidát vie čítať „medzi riadkami", pochopiť hlavné
                      posolstvo a zachytiť logické súvislosti.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>porozumenie významu textu</li>
                      <li>schopnosť rozlíšiť hlavné a vedľajšie informácie</li>
                      <li>logika argumentácie a kritické myslenie</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane krátky pracovný článok alebo interné oznámenie a má označiť, čo je jeho hlavná
                        myšlienka.
                      </li>
                      <li>Z viacerých parafráz vyberá tú, ktorá najpresnejšie vystihuje pôvodný text.</li>
                      <li>V argumentačnom texte hľadá tvrdenie, ktoré nezodpovedá tomu, čo je skutočne napísané.</li>
                    </ol>
                  </div>

                  {/* 8) PLÁNOVANIE A ORGANIZÁCIA */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">8) PLÁNOVANIE A ORGANIZÁCIA PRÁCE</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Test plánovania ukazuje, ako kandidát pracuje s časom, úlohami a neočakávanými zmenami. Firma
                      vďaka nemu vie, či nový človek dokáže udržať poriadok v úlohách, zvláda tlak termínov a nezabúda
                      na dôležité veci.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>nastavovanie priorít</li>
                      <li>reakcia na nečakané zmeny v pláne</li>
                      <li>schopnosť rozdeliť veľkú úlohu na menšie kroky</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane plán dňa so stretnutiami, telefonátmi a úlohami – má zvoliť, čo presunúť, ak
                        príde urgentná požiadavka.
                      </li>
                      <li>
                        Rieši situáciu, kde dva dôležité termíny kolidujú – vyberá, s kým komunikovať a čo navrhnúť.
                      </li>
                      <li>
                        V príklade väčšieho projektu rozdeľuje úlohy na menšie kroky a vyberá z navrhovaných plánov ten,
                        ktorý je realistický.
                      </li>
                    </ol>
                  </div>

                  {/* 9) ZADÁVANIE DÁT */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">9) ZADÁVANIE DÁT</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Test zadávania dát je vhodný pre administratívne, skladové, účtovné a backoffice pozície. Ukazuje,
                      či kandidát dokáže pracovať presne, všímavo a bez častých chýb pri prepisovaní alebo kontrole
                      údajov.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>presnosť pri prepise</li>
                      <li>všímavosť voči detailom</li>
                      <li>schopnosť zachytiť nezrovnalosť v údajoch</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Kandidát porovnáva dve veľmi podobné objednávky a má označiť, v čom sa líšia.</li>
                      <li>Vidí tabuľku so zoznamom faktúr, kde jedna položka nesedí s popisom – musí ju nájsť.</li>
                      <li>
                        V kratšom texte hľadá preklep alebo nesprávne číslo (napr. IČO, číslo účtu, variabilný symbol).
                      </li>
                    </ol>
                  </div>

                  {/* 10) BOZP */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">10) BOZP A BEZPEČNÉ SPRÁVANIE</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      BOZP test pomáha firmám znížiť riziko úrazov a incidentov. Ukazuje, ako kandidát chápe
                      bezpečnostné pravidlá, či vie odhadnúť riziko a ako reaguje v situáciách, kde ide o bezpečnosť
                      jeho aj ostatných.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>pochopenie základných bezpečnostných zásad</li>
                      <li>rozhodovanie v rizikových situáciách</li>
                      <li>prístup k ochranným pomôckam, hláseniu chýb a incidentov</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane situáciu, kde kolega porušuje pravidlá (napr. nemá prilbu) a rozhoduje, ako
                        zareagovať.
                      </li>
                      <li>
                        V scenári úniku kvapaliny volí správny postup (zabezpečiť priestor, informovať, nepokračovať v
                        práci).
                      </li>
                      <li>
                        Pri práci so strojom alebo nástrojom vyberá opatrenia, ktoré minimalizujú riziko zranenia.
                      </li>
                    </ol>
                  </div>

                  {/* 11) WORK SAMPLE */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">11) WORK SAMPLE – PRACOVNÉ SITUÁCIE</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Work sample test simuluje miniatúrne úlohy z reálnej práce – komunikáciu so zákazníkom, prácu s
                      objednávkou, riešenie problému v procese. Firma tak vidí, ako kandidát premýšľa v praxi, nie len v
                      teórii.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>schopnosť rozhodovať sa v konkrétnych situáciách</li>
                      <li>kombinácia logiky, komunikácie a orientácie na výsledok</li>
                      <li>praktická uplatniteľnosť kandidáta na danom type práce</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát rieši reklamáciu zákazníka, kde firma pochybila – vyberá postup, ktorý je férový a
                        zároveň udržateľný.
                      </li>
                      <li>
                        V scenári oneskorenej dodávky rozhoduje, akú komunikáciu zvoliť smerom ku klientovi a do
                        interného tímu.
                      </li>
                      <li>
                        Pri nezrovnalosti v objednávke a faktúre vyberá, čo overiť skôr a ako o tom informovať
                        ostatných.
                      </li>
                    </ol>
                  </div>

                  {/* 12) LOGICKO-NUMERICKÝ */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">12) LOGICKO-NUMERICKÝ TEST</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Logicko-numerický test overuje, ako kandidát pracuje s číslami, pomermi a slovnými logickými
                      úlohami. Je vhodný pre pozície, kde sa rozhoduje na základe údajov, reportov alebo výpočtov.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>pochopenie jednoduchých aj zložitejších číselných vzťahov</li>
                      <li>schopnosť odhadnúť dopad zmien na výsledky</li>
                      <li>logické myslenie pri práci s údajmi</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>
                        Kandidát dostane slovný popis grafu (napr. vývoj predaja) a odpovedá na otázky o trendoch a
                        zmenách.
                      </li>
                      <li>Rieši úlohu s prepočtom zliav, marže alebo množstva, ak sa zmení jedna z premenných.</li>
                      <li>Z niekoľkých tvrdení o číslach vyberá to, ktoré logicky vyplýva z uvedených údajov.</li>
                    </ol>
                  </div>

                  {/* 13) POZORNOSŤ K DETAILOM */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-semibold text-base mb-2">13) POZORNOSŤ K DETAILOM</h5>
                    <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                    <p className="mb-3">
                      Test pozornosti k detailom je kľúčový pre pozície, kde aj malá chyba môže mať veľký dopad –
                      financie, administratíva, zákaznícky servis, logistika. Ukazuje, či kandidát vníma drobné rozdiely
                      a nezrovnalosti.
                    </p>
                    <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>schopnosť všimnúť si chyby v texte alebo číslach</li>
                      <li>konzistentnosť v kontrole údajov</li>
                      <li>trpezlivosť pri práci s opakujúcimi sa dátami</li>
                    </ul>
                    <p className="font-medium text-muted-foreground mb-2">Praktické príklady z praxe:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Kandidát porovnáva dve verzie zmluvy a hľadá rozdiel v jednom z článkov.</li>
                      <li>Kontroluje zoznam položiek, kde jedno číslo nezodpovedá logike zvyšku.</li>
                      <li>
                        V prehľade objednávok identifikuje položku, ktorá nesedí s cenovou alebo množstevnou logikou.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Prečo by firma mala tieto testy zadávať */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3">Prečo by firma mala tieto testy zadávať?</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>testy šetria čas – kandidát príde už s výsledkami</li>
                  <li>firma má objektívne dáta, nie len subjektívny pocit z pohovoru</li>
                  <li>vďaka testom lepšie odlíši kvalitných kandidátov od tých, ktorí sa len „vedia predať"</li>
                  <li>minimalizuje riziko nesprávneho náboru, ktorý stojí čas, peniaze a energiu tímu</li>
                  <li>má jednotný, férový a opakovateľný spôsob hodnotenia naprieč uchádzačmi</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.retention} onOpenChange={() => toggleSection("retention")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>8 retenčných testov</CardTitle>
                    <CardDescription>Pre zamestnancov - angažovanosť, motivácia, riziko odchodu</CardDescription>
                  </div>
                </div>
                {openSections.retention ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                {/* 1) ANGAŽOVANOSŤ */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">1) ANGAŽOVANOSŤ</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test meria, ako veľmi je človek prirodzene vtiahnutý do práce, ako často ide nad rámec povinností a
                    čo ho motivuje zostať dlhodobo aktívny. Firma vďaka nemu vie, či kandidát prichádza s energiou,
                    iniciatívou a ochotou robiť veci kvalitne.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>prirodzená miera vnútornej motivácie</li>
                    <li>ochota prevziať iniciatívu</li>
                    <li>stabilita výkonu pri bežnej záťaži</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Kandidát má opísať, ako reaguje, keď má náročnejší deň – či sa „prepne" do akcie, alebo sa skôr
                      odpojí.
                    </li>
                    <li>V situácii, kde tím mešká s termínom, volí medzi pomocou, čakaním alebo pasivitou.</li>
                    <li>
                      Pri úlohách bez okamžitej spätnej väzby určuje, či si udrží tempo alebo potrebuje externú
                      motiváciu.
                    </li>
                  </ol>
                </div>

                {/* 2) MOTIVÁTORY */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">2) MOTIVÁTORY</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Motivátory odhaľujú, čo človeka skutočne poháňa v práci – stabilita, peniaze, tím, rast, istota,
                    zmysel, autonómia alebo dobrý šéf. Firma získa jasný prehľad o tom, aké prostredie kandidát
                    potrebuje, aby dlhodobo fungoval dobre.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>osobné hodnoty a preferencie</li>
                    <li>čo kandidáta motivuje alebo demotivuje</li>
                    <li>aké prostredie podporuje jeho výkon</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Kandidát vyberá medzi stabilným platom a rýchlym rastom zodpovednosti – ukazuje jeho preferenciu.
                    </li>
                    <li>
                      Pri hodnotení tímovej atmosféry určuje, či potrebuje blízkosť kolegov alebo radšej pokoj a
                      samostatnosť.
                    </li>
                    <li>Rozhoduje, či je preňho dôležitejší dobrý šéf alebo jasné procesy.</li>
                  </ol>
                </div>

                {/* 3) RETENČNÉ RIZIKO */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">3) RETENČNÉ RIZIKO</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test meria pravdepodobnosť, že človek bude v blízkej budúcnosti uvažovať o zmene práce. Firma tak
                    odhalí riziká skôr, než sa prejavia v odchode zamestnanca.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>spokojnosť s aktuálnym typom práce</li>
                    <li>ochota zostať pri problémoch</li>
                    <li>reakcia na zmeny a frustráciu</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Kandidát má určiť, ako by reagoval, ak by tri mesiace po sebe zažíval chaos v tíme.</li>
                    <li>V situácii zmeny manažéra volí, či by čakal, odchádzal alebo vyjednával.</li>
                    <li>
                      Pri opakovaných drobných konfliktoch s tímom hodnotí, či by ich riešil alebo by hľadal novú prácu.
                    </li>
                  </ol>
                </div>

                {/* 4) STRES & VYHORENIE */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">4) STRES & VYHORENIE</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test zisťuje, ako človek zvláda pracovný tlak, ako rýchlo regeneruje a či má tendenciu k dlhodobému
                    vyčerpaniu. Firma získa prehľad o tom, aké tempo je pre zamestnanca udržateľné.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>odolnosť voči stresu</li>
                    <li>schopnosť oddeliť prácu od súkromia</li>
                    <li>riziko vyhorenia pri dlhodobom tlaku</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Kandidát rieši situáciu, kde pracuje bez prestávky 3 dni po sebe a hodnotí, čo potrebuje na
                      regeneráciu.
                    </li>
                    <li>
                      V príklade s urgentnými úlohami volí medzi prioritizáciou, delegovaním alebo ignorovaním hraníc.
                    </li>
                    <li>V situácii dlhodobého chaosu rozhoduje, či vydrží alebo potrebuje zmenu.</li>
                  </ol>
                </div>

                {/* 5) KARIÉRNY RAST */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">5) KARIÉRNY RAST</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test zisťuje, či kandidát potrebuje jasné možnosti postupu, či hľadá zmenu roly, rast, školenia
                    alebo odborné výzvy. Firma vďaka nemu vie, čo môže zamestnanca udrať.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>očakávania ohľadom rastu</li>
                    <li>potreba výziev a nových kompetencií</li>
                    <li>dôležitosť rozvoja pre spokojnosť</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Kandidát hodnotí, ako veľmi je preňho dôležité pravidelné školenie.</li>
                    <li>Rieši situáciu stagnácie v roli a volí reakciu.</li>
                    <li>Pri ponuke bočného posunu určuje, či ho to motivuje alebo demotivuje.</li>
                  </ol>
                </div>

                {/* 6) VZŤAH S MANAŽÉROM */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">6) VZŤAH S MANAŽÉROM</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test odhaľuje, aký typ vedenia kandidát potrebuje – mieru slobody, spätnej väzby, férovosti a
                    jasnosti. Firma tak vie, s akým manažérskym štýlom bude kandidát fungovať bez konfliktov.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>dôležitosť podpory zo strany nadriadeného</li>
                    <li>citlivosť na nespravodlivosť a chaos</li>
                    <li>preferovaný spôsob vedenia</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Kandidát má určiť reakciu na manažéra, ktorý nedáva spätnú väzbu.</li>
                    <li>V situácii nejasného zadania hodnotí, čo od manažéra potrebuje.</li>
                    <li>Pri nespravodlivom rozdelení úloh vyberá postup, ktorý by zvolil.</li>
                  </ol>
                </div>

                {/* 7) KULTÚRNY FIT */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">7) KULTÚRNY FIT</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test zisťuje, v akom type firemnej kultúry sa človek cíti prirodzene – štruktúra vs. flexibilita,
                    rýchlosť zmien, spôsob komunikácie, úroveň autonómie.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>preferencia stabilného vs. dynamického prostredia</li>
                    <li>reakcia na zmeny</li>
                    <li>miera potreby štruktúry a pravidiel</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Kandidát hodnotí, či mu vyhovuje rýchlo rastúca firma.</li>
                    <li>Pri nejasných procesoch určuje, či adaptuje alebo odmieta.</li>
                    <li>V scenári autonómnej roly volí medzi samostatnosťou a potrebou vedenia.</li>
                  </ol>
                </div>

                {/* 8) KOMUNIKAČNÁ KLÍMA */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-base mb-2">8) KOMUNIKAČNÁ KLÍMA</h5>
                  <p className="font-medium text-muted-foreground mb-2">Na čo test slúži:</p>
                  <p className="mb-3">
                    Test meria, či človek potrebuje otvorenú komunikáciu, bezpečné prostredie a možnosť hovoriť problémy
                    nahlas. Firma tak odhalí, ako bude zamestnanec reagovať v tíme s rôznou mierou psychologickej
                    bezpečnosti.
                  </p>
                  <p className="font-medium text-muted-foreground mb-2">Čo sa testom meria:</p>
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    <li>potreba férovosti a priamosti</li>
                    <li>reakcia na konflikty</li>
                    <li>schopnosť otvorene komunikovať problémy</li>
                  </ul>
                  <p className="font-medium text-muted-foreground mb-2">Praktické príklady:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Kandidát rieši situáciu, kde tím zametá problémy pod koberec.</li>
                    <li>Hodnotí reakciu na kolegu, ktorý sa bojí povedať chybu.</li>
                    <li>Volí postup pri nepríjemnom rozhovore, kde treba otvorene pomenovať riziko.</li>
                  </ol>
                </div>
              </div>

              {/* Ako firmy používajú retenčné testy */}
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3">Ako firmy používajú retenčné testy?</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>na zníženie fluktuácie</li>
                  <li>identifikáciu rizikových zamestnancov skôr, než odídu</li>
                  <li>manažérsku diagnostiku tímu</li>
                  <li>onboarding – rozpoznanie potrieb nového človeka</li>
                  <li>nastavovanie kariérneho rastu, rozvoja a podpory</li>
                  <li>preventívne sledovanie rizika vyhorenia</li>
                </ul>
                <p className="mt-3 text-sm font-medium">
                  Retenčné testy sú vhodné pre vlastných zamestnancov aj pre kandidátov pred nástupom.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.howItWorks} onOpenChange={() => toggleSection("howItWorks")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Ako funguje aplikácia</CardTitle>
                    <CardDescription>
                      Kompletný návod pre firmy - čo platforma robí, ako funguje, čo sa platí
                    </CardDescription>
                  </div>
                </div>
                {openSections.howItWorks ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              {/* Sekcia 1 */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mt-0">1. ČO JE SOMVIAC Z POHĽADU FIRMY</h3>
                <p className="mb-3">SOMVIAC je online platforma, ktorá firmám pomáha:</p>
                <ul className="space-y-1 mb-4">
                  <li>vyhľadať kandidátov podľa overených zručností a výsledkov testov</li>
                  <li>otestovať uchádzačov aj vlastných zamestnancov</li>
                  <li>sledovať riziko odchodu, motiváciu a angažovanosť</li>
                  <li>robiť rýchlejšie a presnejšie rozhodnutia pri nábore a rozvoji</li>
                </ul>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="font-semibold text-red-700 mb-2">SOMVIAC NIE JE:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• agentúra dočasného zamestnávania</li>
                      <li>• klasická personálna agentúra</li>
                      <li>• služba, ktorá si berie percentá z príjmu človeka</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-700 mb-2">SOMVIAC JE:</p>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• testovací a diagnostický nástroj</li>
                      <li>• databáza profilov s výsledkami testov</li>
                      <li>• online systém pre HR, manažérov a recruiterov</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-700 mb-2">Dva hlavné produktové balíky:</p>
                  <ol className="text-sm text-blue-600 space-y-1">
                    <li>
                      1) <strong>RETENČNÉ TESTY</strong> – pre vlastných zamestnancov (retencia, motivácia, stres,
                      kultúra…)
                    </li>
                    <li>
                      2) <strong>CV + OVEROVACIE TESTY</strong> – pre kandidátov (digitálne zručnosti, jazyk, logika,
                      SJT, atď.)
                    </li>
                  </ol>
                </div>
              </div>

              {/* Sekcia 2 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">2. ZÁKLADNÝ PRINCÍP FUNKČNOSTI</h3>

                <div className="space-y-4 mt-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">2.1. Kandidát ako profil v databáze</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Kandidát si vytvorí profil a CV</li>
                      <li>• Môže (ale nemusí) absolvovať základné a pokročilé testy</li>
                      <li>• Testy sa ukladajú do jeho profilu</li>
                      <li>
                        • Profil je v databáze anonymizovaný – firma nevidí meno, kontakt, iba zručnosti a výsledky
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">2.2. Firma ako používateľ platformy</h4>
                    <p className="text-sm mt-2">Firma má vlastný firemný účet (HR, manažéri, recruiter). Firma môže:</p>
                    <ul className="text-sm space-y-1 mt-1">
                      <li>• vyhľadávať kandidátov podľa zručností a výsledkov testov</li>
                      <li>• priraďovať kandidátom testy</li>
                      <li>• testovať vlastných zamestnancov retenčnými testami</li>
                      <li>• pozerať si prehľadné reporty</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">2.3. Základné rozhranie pre firmu</h4>
                    <p className="text-sm mt-2">Hlavné sekcie:</p>
                    <ol className="text-sm space-y-1 mt-1">
                      <li>1) Kandidáti (externí uchádzači)</li>
                      <li>2) Zamestnanci (interné testovanie)</li>
                      <li>3) Testy (výber testov, priraďovanie)</li>
                      <li>4) Výsledky (prehľady testov, reporty)</li>
                      <li>5) Fakturácia / kredity (nákup a prehľad využitia)</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Sekcia 3 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">3. AKO TO FUNGUJE PRE FIRMU – KROK ZA KROKOM</h3>

                <div className="space-y-4 mt-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold">3.1. Registrácia firmy</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Firma si vytvorí firemný účet (názov, IČO, fakturačné údaje, kontaktná osoba)</li>
                      <li>• Potvrdí obchodné podmienky a zásady ochrany údajov</li>
                      <li>• Po registrácii má prístup do firemného dashboardu</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold">3.2. Výber produktu: Kandidáti vs. Zamestnanci</h4>
                    <p className="text-sm mt-2">Firma sa môže rozhodnúť:</p>
                    <ul className="text-sm space-y-1 mt-1">
                      <li>A) využívať platformu pre nábor kandidátov</li>
                      <li>B) využívať retenčné testy pre vlastných zamestnancov</li>
                      <li>C) kombinovať obidve možnosti</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold">3.3. Práca s kandidátmi (externý nábor)</h4>
                    <ol className="text-sm space-y-2 mt-2">
                      <li>1) Firma vojde do sekcie „Kandidáti"</li>
                      <li>2) Nastaví filtre: zručnosti, výsledky konkrétnych testov, jazykové kombinácie, seniorita</li>
                      <li>
                        3) Systém zobrazí zoznam anonymných profilov (kandidát_001, kandidát_002…) s kľúčovými
                        zručnosťami a výsledkami testov
                      </li>
                      <li>
                        4) Firma si môže vybrať: kandidáta osloviť, priradiť mu ďalšie testy, pridať si ho do „krátkeho
                        zoznamu"
                      </li>
                      <li>
                        5) Kontaktné údaje kandidáta sa odkryjú až keď firma požiada o prepojenie a kandidát odsúhlasí
                        zdieľanie údajov
                      </li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold">3.4. Priraďovanie testov kandidátom</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Firma si v sekcii „Testy" vyberie, ktoré testy chce kandidátovi priradiť</li>
                      <li>• Môže vybrať: základné testy, pokročilé testy, retenčné testy</li>
                      <li>• Kandidát dostane notifikáciu (email / v účte)</li>
                      <li>• Po dokončení testu sa výsledky objavia v firemnom účte</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sekcia 4 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">4. RETENČNÉ TESTY – PRE VLASTNÝCH ZAMESTNANCOV</h3>

                <div className="space-y-4 mt-3">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700">4.1. Čo firma získava retenčnými testami</h4>
                    <p className="text-sm mt-2">Prehľad o tom:</p>
                    <ul className="text-sm space-y-1 mt-1 text-purple-600">
                      <li>• kto je dlhodobo motivovaný a angažovaný</li>
                      <li>• kde hrozí vyššie riziko odchodu</li>
                      <li>• kde sú problémy v kultúre, komunikácii alebo vo vzťahu s manažérom</li>
                      <li>• v ktorých tímoch je zvýšený stres a riziko vyhorenia</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700">4.2. Ako firma použije retenčné testy</h4>
                    <ol className="text-sm space-y-1 mt-2 text-purple-600">
                      <li>1) Firma v sekcii „Zamestnanci" nahrá zoznam vlastných ľudí (meno, e-mail, rola, tím)</li>
                      <li>2) Vyberie, ktoré retenčné testy chce použiť</li>
                      <li>3) Systém vygeneruje personalizované odkazy na testy</li>
                      <li>4) Zamestnanci vyplnia testy online</li>
                      <li>5) Výsledky sa zobrazia v prehľadnom reporte</li>
                    </ol>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700">4.3. Ako firma pracuje s výsledkami</h4>
                    <p className="text-sm mt-2">
                      Firma vidí: súhrnné slovné hodnotenia, prehľad rizikových oblastí, odporúčania pre manažérov.
                    </p>
                    <p className="text-sm mt-2">
                      Dáta sa využívajú: pri one-to-one rozhovoroch, pri nastavovaní rozvojových plánov, pri plánovaní
                      zmien v tímoch, pri manažérskych rozhodnutiach.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sekcia 5 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">5. PLATBY A CENOVÝ MODEL</h3>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-3">
                  <h4 className="font-semibold text-amber-700">
                    5.1. Základný princíp – žiadne provízie, iba index ceny
                  </h4>
                  <ul className="text-sm space-y-1 mt-2 text-amber-700">
                    <li>• firma platí za používanie testov a funkcionalít</li>
                    <li>• neplatí sa žiadny podiel z príjmu zamestnanca</li>
                    <li>• neplatí sa za „úspešné prijatie"</li>
                    <li>• všetko je viazané na jasný cenník a index ceny</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700">Za čo sa PLATÍ:</h4>
                    <ul className="text-sm space-y-1 mt-2 text-green-600">
                      <li>• priradenie testov kandidátom</li>
                      <li>• využitie retenčných testov pre zamestnancov</li>
                      <li>• prémiové reporty a analytické výstupy</li>
                      <li>• odomknutie kontaktu kandidáta</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-700">Firma NEPLATÍ:</h4>
                    <ul className="text-sm space-y-1 mt-2 text-red-600">
                      <li>• žiadny podiel z príjmu zamestnanca</li>
                      <li>• žiadne poplatky pri uzatvorení pracovnej zmluvy</li>
                      <li>• žiadne „success fee" za prijatie</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sekcia 6 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">6. ZMLUVA A PRÁVNY RÁMEC</h3>

                <div className="space-y-4 mt-3">
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold">6.1. Kedy vzniká zmluvný vzťah</h4>
                    <p className="text-sm mt-2">Zmluvný vzťah medzi firmou a SOMVIAC vzniká:</p>
                    <ul className="text-sm space-y-1 mt-1">
                      <li>• registráciou firmy a odsúhlasením obchodných podmienok</li>
                      <li>• aktiváciou balíka služieb (nákup kreditov / licencie)</li>
                      <li>• potvrdením fakturačných údajov</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold">6.2. Čo je predmetom zmluvy</h4>
                    <p className="text-sm mt-2">
                      <strong>Je to:</strong> poskytnutie prístupu do online platformy, možnosť využívať testy a
                      testovacie moduly, prístup k reportom a diagnostickým výstupom.
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Nie je to:</strong> zmluva o sprostredkovaní práce, zmluva o dočasnom prideľovaní
                      pracovníkov.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sekcia 7 */}
              <div>
                <h3 className="text-lg font-semibold text-primary">7. OCHRANA ÚDAJOV A ANONYMIZÁCIA</h3>

                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700">7.1. Kandidáti</h4>
                    <ul className="text-sm space-y-1 mt-2 text-blue-600">
                      <li>• Kandidáti sú v databáze vedení pod anonymizovaným identifikátorom</li>
                      <li>• Firma vidí: zručnosti, testy, slovné výsledky, vhodnosť pre rolu</li>
                      <li>• Až po súhlase kandidáta sa zobrazia: meno, kontakt, detailný profil</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700">7.2. Zamestnanci</h4>
                    <ul className="text-sm space-y-1 mt-2 text-blue-600">
                      <li>• Pri internom testovaní má firma prístup k individuálnym výsledkom podľa nastavenia</li>
                      <li>• Systém umožňuje anonymizované sumáre na úrovni tímov</li>
                      <li>• Rešpektovanie lokálnych pravidiel ochrany súkromia</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
