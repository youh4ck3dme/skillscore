"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function CookiePolicy() {
  const router = useRouter()
  
  return (
    <Card className="mx-auto w-full max-w-4xl">
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
        <CardTitle className="text-2xl font-bold text-primary">Cookie Policy (Zásady používania cookies)</CardTitle>
        <div className="rounded-lg bg-muted p-4">
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
              <h2 className="mb-3 text-xl font-semibold text-primary">1. Úvod</h2>
              <p className="mb-4">
                Tento dokument vysvetľuje, ako náš portál SOMVIAC (ďalej len "my", "náš" alebo "platforma") používa
                cookies a podobné technológie na vašom zariadení pri návšteve našej webovej stránky www.somviac.com.
                Používanie cookies je v súlade s Nariadením (EÚ) 2016/679 (GDPR) a ďalšími relevantnými právnymi
                predpismi SR a EÚ.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">2. Čo sú cookies?</h2>
              <p className="mb-4">
                Cookies sú malé textové súbory, ktoré sa ukladajú do vášho prehliadača pri návšteve webovej stránky.
                Obsahujú identifikačné informácie a umožňujú webovej stránke rozpoznať vaše zariadenie pri opätovnej
                návšteve. Cookies môžu byť "trvalé" (ostávajú až do ich vymazania alebo expirácie) alebo "session"
                (vymazané po zatvorení prehliadača).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">3. Aké cookies používame</h2>
              <p className="mb-4">Na našej platforme používame nasledujúce kategórie cookies:</p>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">3.1 Nevyhnutné cookies (Strictly Necessary)</h3>
                  <p className="mb-2">
                    Tieto cookies sú potrebné pre základnú funkcionalitu platformy a nemožno ich vypnúť. Bez týchto
                    cookies by platforma nemohla fungovať správne.
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>
                      <strong>Autentifikačné cookies</strong> - Uchovávajú informácie o prihlásení používateľa (Supabase
                      auth-token)
                    </li>
                    <li>
                      <strong>Bezpečnostné cookies</strong> - Zabezpečujú ochranu pred CSRF útokmi a inými
                      bezpečnostnými hrozbami
                    </li>
                    <li>
                      <strong>Cookie consent</strong> - Ukladajú vaše preferencie ohľadom cookies
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Právny základ: Oprávnený záujem (čl. 6 ods. 1 písm. f GDPR) - nevyhnutné pre poskytovanie služieb
                  </p>
                  <p className="text-sm text-muted-foreground">Doba uchovávania: Session alebo max. 30 dní</p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">3.2 Funkčné cookies (Functional)</h3>
                  <p className="mb-2">
                    Tieto cookies umožňujú rozšírené funkcie a personalizáciu platformy podľa vašich preferencií.
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>
                      <strong>Jazykové preferencie</strong> - Zapamätajú si váš zvolený jazyk (SK, EN, DE)
                    </li>
                    <li>
                      <strong>UI nastavenia</strong> - Dark/light mode, veľkosť písma a ďalšie užívateľské preferencie
                    </li>
                    <li>
                      <strong>Session storage</strong> - Dočasné uloženie údajov formulárov (aby ste nepriš li o
                      rozpísané údaje)
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Právny základ: Súhlas (čl. 6 ods. 1 písm. a GDPR)
                  </p>
                  <p className="text-sm text-muted-foreground">Doba uchovávania: Max. 12 mesiacov</p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">3.3 Analytické cookies (Analytics)</h3>
                  <p className="mb-2">
                    Tieto cookies nám pomáhajú pochopiť, ako používatelia interagujú s platformou, aby sme mohli
                    zlepšovať naše služby.
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>
                      <strong>Vercel Analytics</strong> - Zbiera anonymné štatistiky o návštevnosti stránky
                    </li>
                    <li>
                      <strong>Vlastná analytika</strong> - Sleduje použitie funkcií platformy (napr. počet vytvorených
                      CV, úspešnosť testov)
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Právny základ: Súhlas (čl. 6 ods. 1 písm. a GDPR)
                  </p>
                  <p className="text-sm text-muted-foreground">Doba uchovávania: Max. 24 mesiacov</p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">3.4 Marketingové cookies (Marketing)</h3>
                  <p className="mb-2">
                    Tieto cookies sa používajú na zobrazenie relevantných reklám a sledovanie efektivity marketingových
                    kampaní.
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>
                      <strong>Reklamné siete</strong> - Umožňujú zobrazenie personalizovaných reklám na iných stránkach
                    </li>
                    <li>
                      <strong>Conversion tracking</strong> - Sledujú, či reklamy vedú k registrácii alebo nákupu
                      (Stripe)
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Právny základ: Súhlas (čl. 6 ods. 1 písm. a GDPR)
                  </p>
                  <p className="text-sm text-muted-foreground">Doba uchovávania: Max. 12 mesiacov</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">4. Tretie strany</h2>
              <p className="mb-4">Naša platforma využíva služby tretích strán, ktoré môžu ukladať vlastné cookies:</p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong>Supabase</strong> - Poskytovateľ databázy a autentifikácie (auth-token cookie)
                </li>
                <li>
                  <strong>Stripe</strong> - Platobný procesor pre nákup coinov (Stripe session cookies)
                </li>
                <li>
                  <strong>Vercel</strong> - Hosting a analytika (Analytics cookies)
                </li>
              </ul>
              <p className="mt-4">
                Tieto tretie strany majú vlastné cookie policies, ktoré sú dostupné na ich webových stránkach.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">5. Ako spravovať cookies</h2>
              <p className="mb-4">Máte plnú kontrolu nad svojimi cookie preferenciami:</p>

              <div className="space-y-3">
                <div>
                  <h3 className="mb-1 font-semibold">5.1 Cez naše Cookie nastavenia</h3>
                  <p>
                    Pri prvej návšteve sa zobrazí cookie banner, kde môžete vybrať svoje preferencie. Kedykoľvek ich
                    môžete zmeniť otvorením cookie nastavení (v pätičke stránky).
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">5.2 Cez nastavenia prehliadača</h3>
                  <p className="mb-2">Väčšina moderných prehliadačov umožňuje blokovať alebo vymazať cookies:</p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>Chrome: Nastavenia → Súkromie a zabezpečenie → Cookies</li>
                    <li>Firefox: Nastavenia → Súkromie a zabezpečenie → Cookies</li>
                    <li>Safari: Predvoľby → Súkromie → Správa údajov webových stránok</li>
                    <li>Edge: Nastavenia → Cookies a povolenia lokalít</li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upozornenie: Vypnutím nevyhnutných cookies môžete stratiť prístup k niektorým funkciám platformy.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">6. Vaše práva</h2>
              <p className="mb-4">V súlade s GDPR máte nasledujúce práva:</p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong>Právo na prístup</strong> - Požiadať o kópiu údajov uložených v cookies
                </li>
                <li>
                  <strong>Právo na vymazanie</strong> - Požiadať o vymazanie vašich cookie údajov
                </li>
                <li>
                  <strong>Právo namietať</strong> - Odmietnuť použitie analytických a marketingových cookies
                </li>
                <li>
                  <strong>Právo odvolať súhlas</strong> - Kedykoľvek zmeniť svoje cookie preferencie
                </li>
                <li>
                  <strong>Právo podať sťažnosť</strong> - Kontaktovať Úrad na ochranu osobných údajov SR
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">7. Kontakt</h2>
              <p className="mb-4">
                Ak máte otázky týkajúce sa našej Cookie Policy alebo chcete uplatniť svoje práva, kontaktujte nás:
              </p>
              <div className="rounded-lg bg-muted p-4">
                <p>
                  <strong>E-mail:</strong> oskar.nagy@gmail.com
                </p>
                <p>
                  <strong>Telefón:</strong> 0902 120 258
                </p>
                <p>
                  <strong>Poštová adresa:</strong> Bajzova 1, 821 08 Bratislava
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-primary">8. Aktualizácie</h2>
              <p className="mb-2">
                Túto Cookie Policy môžeme čas od času aktualizovať. Dátum poslednej aktualizácie je uvedený nižšie.
                Odporúčame vám pravidelne kontrolovať túto stránku pre aktuálne informácie.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Posledná aktualizácia:</strong> 12. januára 2025
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Verzia:</strong> 1.0
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
