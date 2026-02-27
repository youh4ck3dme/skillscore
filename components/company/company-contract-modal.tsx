"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle, Building2, User, Mail, Phone, MapPin, Hash } from "lucide-react"

interface CompanyContractModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (data: any) => Promise<void>
  companyData?: {
    company_name?: string
    contact_person?: string
    email?: string
    phone?: string
    address?: string
    ico?: string
    dic?: string
  }
}

export function CompanyContractModal({ isOpen, onClose, onSign, companyData }: CompanyContractModalProps) {
  const [step, setStep] = useState<"contract" | "success">("contract")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const currentDate = new Date().toLocaleDateString("sk-SK")

  // Generate the full contract text with company data
  const generateContractText = () => {
    return `RÁMCOVÁ ZMLUVA O VYUŽÍVANÍ PLATFORMY SOMVIAC
(verzia s coin systémom a Index cenou, bez zmienky o mzde)

uzatvorená podľa § 269 ods. 2 Obchodného zákonníka

============================================================
Článok 1 – ZMLUVNÉ STRANY
============================================================

1.1 Poskytovateľ (Prevádzkovateľ platformy)
SOMVIAC
Oskar Nagy
Bajzova 1, 821 08 Bratislava
IČO: 57226202
Tel: 0902 120 258
Email: oskar.nagy@gmail.com
(ďalej len „Poskytovateľ")

1.2 Odberateľ (Firma)
Obchodné meno: ${companyData?.company_name || "_______________"}
Sídlo: ${companyData?.address || "_______________"}
IČO: ${companyData?.ico || "_______________"}
DIČ/IČ DPH: ${companyData?.dic || "_______________"}
Zastúpená: ${companyData?.contact_person || "_______________"}
Email: ${companyData?.email || "_______________"}
Telefón: ${companyData?.phone || "_______________"}
(ďalej len „Firma")

Poskytovateľ a Firma spolu aj ako „Zmluvné strany".

============================================================
Článok 2 – CHARAKTER SLUŽBY
============================================================

2.1 Poskytovateľ vyhlasuje a Firma berie na vedomie, že:
a) SOMVIAC je online platforma a testovací/filtračný nástroj,
b) Poskytovateľ NIE je agentúra dočasného zamestnávania,
c) Poskytovateľ neposkytuje sprostredkovanie zamestnania za úhradu v zmysle osobitných predpisov,
d) Poplatky (ak existujú) sú výlučne za služby platformy a administratívnu/technickú podporu.

2.2 Táto zmluva nijakým spôsobom neupravuje pracovnoprávne ani obdobné zmluvné vzťahy medzi Firmou a kandidátmi. Poskytovateľ nevstupuje do týchto vzťahov, nekoná v mene kandidátov a nezodpovedá za obsah dohôd medzi Firmou a kandidátmi.

============================================================
Článok 3 – PREDMET ZMLUVY
============================================================

3.1 Predmetom tejto zmluvy je úprava podmienok, za ktorých Poskytovateľ umožní Firme využívať platformu SOMVIAC najmä na:
a) vyhľadávanie kandidátov v anonymizovanej databáze,
b) sprístupnenie kontaktných údajov vybraných kandidátov („Odkrytie kontaktu"),
c) objednávanie testov a testovacích balíkov pre kandidátov a/alebo zamestnancov Firmy,
d) využívanie retenčných testov pre vlastných zamestnancov,
e) prístup k reportom a analytickým výstupom.

3.2 Táto zmluva je rámcová. Konkrétne jednotlivé plnenia (Odkrytie kontaktu, testy, retenčné balíky, moduly) sa realizujú formou online úkonov v rozhraní platformy SOMVIAC podľa aktuálneho cenníka a Index ceny.

3.3 Podrobnosti o technickom fungovaní platformy a pravidlách používania sú uvedené vo Všeobecných obchodných podmienkach (VOP) a v zásadách ochrany osobných údajov Poskytovateľa, ktoré sú neoddeliteľnou súčasťou tejto zmluvy.

============================================================
Článok 4 – COIN SYSTÉM A INDEX CENA
============================================================

4.1 Platforma používa interný kreditný systém („coiny"). 1 coin spravidla zodpovedá 1 EUR, pokiaľ cenník neustanovuje inak.

4.2 Firma si dobíja coiny:
a) jednorazovým nákupom kreditov (predplatený balík),
b) alebo iným dohodnutým spôsobom podľa individuálnej cenovej dohody.

4.3 „Index cena" je súhrnná cena za využitie kontaktu na kandidáta podľa platného cenníka Poskytovateľa. Konkrétna výška Index ceny je vždy uvedená v cenníku alebo individuálnej ponuke.

4.4 Coony slúžia:
a) na úhradu testov a retenčných balíkov,
b) ako garancia schopnosti Firmy uhrádzať Index cenu v prípade zamestnania kandidáta podľa článku 6 a 7.

============================================================
Článok 5 – ODKRYTIE KONTAKTU NA KANDIDÁTA
============================================================

5.1 Profily kandidátov sú Firme najskôr zobrazované anonymizovane (bez mena a priameho kontaktu). Odkrytie kontaktu znamená sprístupnenie:
a) e-mailovej adresy kandidáta, alebo
b) telefónneho čísla kandidáta,
podľa toho, čo kandidát v platforme zvolil.

5.2 Firma neplatí samostatný poplatok za samotné Odkrytie kontaktu. Odkrytie kontaktu je však podmienené minimálnym zostatkom coinov na účte Firmy podľa bodu 5.3.

5.3 Podmienka minimálneho zostatku coinov:
a) Firma môže mať odkrytých 1–15 kontaktov kandidátov len vtedy, ak má na účte minimálne 100 coinov.
b) Pri 16–30 odkrytých kontaktoch musí mať na účte minimálne 200 coinov.
c) Pri 31–45 odkrytých kontaktoch minimálne 300 coinov.
d) Rovnaká logika platí aj ďalej – za každých začatých 15 odkrytých kontaktov musí mať Firma na účte minimálne 100 coinov.

5.4 Ak Firma nespĺňa podmienku minimálneho zostatku podľa bodu 5.3, systém jej technicky neumožní Odkrytie kontaktu.

5.5 Pri Odkrytí kontaktu sa coiny z účtu Firmy neodpočítavajú. Coony plnia funkciu finančnej garancie pri prípadnom neskoršom zamestnaní kandidáta podľa článku 6 a 7.

============================================================
Článok 6 – OZNAČENIE „ZAMESTNAŤ KANDIDÁTA"
============================================================

6.1 Ak Firma po výbere kandidáta dospeje k rozhodnutiu uzavrieť s kandidátom pracovnoprávny, dohodársky, živnostenský alebo iný obdobný zmluvný vzťah (ďalej len „Spolupráca"), zaväzuje sa:
a) kliknúť v profile kandidáta v platforme SOMVIAC na tlačidlo „Zamestnať kandidáta",
b) uviesť dátum začiatku Spolupráce (dátum nástupu),
c) uviesť deň v mesiaci, ktorý zodpovedá pravidelnému výplatnému cyklu kandidáta (ďalej len „Deň vyplatenia").

6.2 Kliknutím na „Zamestnať kandidáta":
a) vzniká Poskytovateľovi nárok na úhradu Index ceny za využitie kontaktu, v rozsahu podľa článku 7,
b) z účtu Firmy sa v tomto momente neodpočítavajú žiadne coiny,
c) kontroluje sa iba splnenie podmienky minimálneho zostatku podľa bodu 6.3.

6.3 Podmienka minimálneho zostatku pri označení „Zamestnať kandidáta":
Firma sa zaväzuje, že v momente kliknutia na „Zamestnať kandidáta" bude mať na účte coinov minimálne 50 % z celkovej Index ceny kandidáta podľa cenníka. Bez splnenia tejto podmienky systém úkon „Zamestnať kandidáta" nedokončí.

============================================================
Článok 7 – SPLÁCANIE INDEX CENY A MAXIMÁLNE OBDOBIE
============================================================

7.1 Index cena sa uhrádza v mesačných splátkach („Mesačná index platba") najviac počas obdobia 6 po sebe idúcich mesiacov od dátumu nástupu kandidáta, a to nasledovne:

7.2 Vznik nároku na Mesačnú index platbu:
a) prvý nárok na Mesačnú index platbu vzniká až po tom, čo kandidát odpracuje prvé celé dohodnuté obdobie do Dňa vyplatenia,
b) ak kandidát ukončí Spoluprácu pred prvým Dňom vyplatenia, nevzniká nárok na žiadnu Mesačnú index platbu,
c) ďalšie Mesačné index platby vznikajú vždy len spätne za obdobia, ktoré kandidát reálne odpracoval až do príslušného Dňa vyplatenia,
d) nárok na Mesačné index platby môže vzniknúť najviac 6-krát po sebe (maximálne 6 mesiacov od dátumu nástupu).

7.3 Splatnosť a odpočítanie coinov:
a) každá Mesačná index platba je splatná 10 dní po príslušnom Dni vyplatenia,
b) v tento deň systém skontroluje zostatok coinov na účte Firmy,
c) ak je zostatok dostatočný, automaticky odpočíta príslušný počet coinov za danú Mesačnú index platbu,
d) ak zostatok nie je dostatočný, platba sa neuskutoční, avšak peňažný nárok Poskytovateľa na úhradu danej Mesačnej index platby trvá a môže byť fakturovaný.

7.4 Notifikácie:
a) 5 dní pred plánovaným odpočítaním coinov za Mesačnú index platbu dostane Firma upozornenie,
b) ak v deň splatnosti nie je zostatok coinov dostatočný, systém zasiela Firme opakované denné upozornenia na potrebu dobitia coinov až do uhradenia danej Mesačnej index platby.

7.5 Po uplynutí maximálneho obdobia 6 mesiacov od nástupu kandidáta už Poskytovateľ nemá nárok na ďalšie Mesačné index platby, bez ohľadu na to, či Spolupráca s kandidátom trvá dlhšie.

============================================================
Článok 8 – NEZAMESTNANIE KANDIDÁTA
============================================================

8.1 Ak Firma kandidáta, ktorého kontakt odkryla, nikdy neoznačí v systéme ako „Zamestnať kandidáta" a zároveň s ním reálne neuzavrie žiadnu Spoluprácu, nevzniká Poskytovateľovi žiadny nárok na úhradu Index ceny.

8.2 Ak však Firma reálne uzavrie s kandidátom Spoluprácu, ale neoznačí ho v systéme ako „Zamestnať kandidáta", považuje sa to za porušenie tejto zmluvy a článku 9 (zákaz obchádzania platformy).

============================================================
Článok 9 – ZÁKAZ OBCHÁDZANIA PLATFORMY A ZMLUVNÁ POKUTA
============================================================

9.1 Firma sa zaväzuje, že nebude obchádzať platformu SOMVIAC, najmä nie tak, že:
a) použije kontaktné údaje kandidáta získané z platformy a uzavrie s kandidátom Spoluprácu mimo oficiálneho označenia „Zamestnať kandidáta" v systéme,
b) vedome neoznačí v systéme zamestnanie kandidáta, napriek tomu, že s ním uzavrela Spoluprácu,
c) poskytne kontaktné údaje kandidáta tretej osobe (iná firma, agentúra) za účelom uzavretia Spolupráce mimo platformy SOMVIAC.

9.2 Za každé porušenie povinností podľa bodu 9.1 sa Firma zaväzuje uhradiť Poskytovateľovi zmluvnú pokutu vo výške 3 000 EUR za každého dotknutého kandidáta.

9.3 Uhradením zmluvnej pokuty nie je dotknutý nárok Poskytovateľa na náhradu škody v plnom rozsahu.

9.4 Poskytovateľ je oprávnený v prípade závažného alebo opakovaného porušenia článku 9:
a) obmedziť alebo zablokovať prístup Firmy do platformy,
b) odstúpiť od tejto zmluvy s okamžitou účinnosťou.

============================================================
Článok 10 – TESTOVACIE SLUŽBY A RETENČNÉ TESTY
============================================================

10.1 Firma môže prostredníctvom platformy objednávať testy pre kandidátov a svojich zamestnancov, vrátane retenčných testov.

10.2 Cena jednotlivých testov a balíkov je stanovená v cenníku Poskytovateľa. Pred potvrdením objednávky je vždy zobrazená v coinoch alebo v EUR.

10.3 Test sa považuje za objednaný a záväzný v momente potvrdenia objednávky v rozhraní platformy a overenia dostatočného kreditného krytia.

10.4 Po spustení testu je poplatok za test nevratný, pokiaľ sa Zmluvné strany nedohodnú inak.

10.5 Výsledky testov majú informatívny a orientačný charakter a slúžia ako podklad pre rozhodovanie Firmy. Poskytovateľ nezodpovedá za rozhodnutia Firmy ani výsledok Spolupráce.

============================================================
Článok 11 – PLATOBNÉ PODMIENKY
============================================================

11.1 Poskytovateľ vystavuje faktúry v EUR na fakturačné údaje Firmy. Štandardná splatnosť je 14 dní, ak sa Zmluvné strany nedohodnú inak.

11.2 V prípade omeškania s úhradou je Poskytovateľ oprávnený:
a) účtovať zákonné úroky z omeškania,
b) požadovať zmluvnú pokutu, ak je osobitne dohodnutá vo VOP alebo cenovej dohode,
c) dočasne obmedziť prístup Firmy k spoplatneným funkciám platformy,
d) pozastaviť sprístupňovanie nových kontaktov a testovacích balíkov až do uhradenia dlhu.

============================================================
Článok 12 – DOBA TRVANIA A UKONČENIE ZMLUVY
============================================================

12.1 Zmluva sa uzatvára na dobu neurčitú a nadobúda účinnosť dňom jej podpisu oboma Zmluvnými stranami, prípadne potvrdením v online rozhraní platformy.

12.2 Ktorákoľvek Zmluvná strana môže zmluvu vypovedať s výpovednou lehotou 1 mesiac, ktorá začína plynúť prvým dňom mesiaca nasledujúceho po doručení výpovede druhej strane.

12.3 Ukončenie zmluvy nemá vplyv na:
a) povinnosť Firmy uhradiť už vzniknuté Mesačné index platby,
b) nárok Poskytovateľa na zaplatenie zmluvných pokút podľa článku 9.

============================================================
Článok 13 – ZÁVEREČNÉ USTANOVENIA
============================================================

13.1 Právne vzťahy neupravené touto zmluvou sa riadia právnym poriadkom Slovenskej republiky.

13.2 Ak sa niektoré ustanovenie tejto zmluvy stane neplatným alebo neúčinným, ostatné ustanovenia ostávajú nedotknuté a Zmluvné strany ho nahradia ustanovením s významom čo najbližším pôvodnému.

13.3 Zmluva je vyhotovená elektronicky a nadobúda platnosť elektronickým podpisom.

V Bratislave dňa ${currentDate}

Za Poskytovateľa:
Oskar Nagy
SOMVIAC

Za Firmu:
${companyData?.contact_person || "_______________"}
${companyData?.company_name || "_______________"}`
  }

  const handleSign = async () => {
    if (!acceptedTerms) return
    setIsSubmitting(true)
    try {
      const contractText = generateContractText()
      await onSign({
        company_name: companyData?.company_name,
        contact_person: companyData?.contact_person,
        email: companyData?.email,
        phone: companyData?.phone,
        address: companyData?.address,
        ico: companyData?.ico,
        dic: companyData?.dic,
        signed_at: new Date().toISOString(),
        contract_text: contractText,
      })
      setStep("success")
    } catch (error) {
      console.error("Error signing contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("contract")
      setAcceptedTerms(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl mx-2 sm:mx-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {step === "contract" && (
          <>
            <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b bg-background shrink-0">
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-5 w-5 text-teal-600 shrink-0" />
                <span className="leading-tight">Rámcová zmluva o využívaní platformy SOMVIAC</span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm mt-1">
                Prečítajte si zmluvu a potvrďte súhlas. Údaje boli doplnené z profilu firmy.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              <div className="bg-gradient-to-br from-teal-50 to-gray-50 rounded-xl p-3 sm:p-4 mb-4 border border-teal-100">
                <h4 className="font-semibold text-sm text-teal-800 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Údaje firmy zo zmluvy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Firma */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Firma</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.company_name || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Zodpovedná osoba */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <User className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Zodpovedná osoba</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.contact_person || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <Mail className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Email</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.email || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Telefón */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <Phone className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Telefón</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.phone || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Sídlo - full width */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Sídlo</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.address || "-"}
                      </span>
                    </div>
                  </div>

                  {/* IČO */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <Hash className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">IČO</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.ico || "-"}
                      </span>
                    </div>
                  </div>

                  {/* DIČ */}
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                    <Hash className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">DIČ</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {companyData?.dic || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b">
                  <span className="text-xs font-medium text-gray-500">Text zmluvy</span>
                </div>
                <ScrollArea className="h-[250px] sm:h-[300px]">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm font-sans p-3 sm:p-4 text-gray-700 leading-relaxed">
                    {generateContractText()}
                  </pre>
                </ScrollArea>
              </div>
            </div>

            <div className="shrink-0 border-t bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 space-y-3">
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5 shrink-0"
                />
                <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed text-gray-600 cursor-pointer">
                  Prečítal/a som si zmluvu a súhlasím so všetkými podmienkami využívania platformy SOMVIAC. Potvrdzujem,
                  že všetky uvedené údaje sú pravdivé a som oprávnený/á podpísať túto zmluvu v mene firmy.
                </Label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
                  Zrušiť
                </Button>
                <Button
                  onClick={handleSign}
                  disabled={!acceptedTerms || isSubmitting}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                >
                  {isSubmitting ? "Podpisujem..." : "Podpísať zmluvu"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 sm:py-12 px-4 sm:px-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Zmluva úspešne podpísaná!</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Váš účet firmy je teraz plne aktívny. Môžete začať vyhľadávať a kontaktovať kandidátov.
            </p>
            <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
              Pokračovať na dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
