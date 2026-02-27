"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info, Users, Coins, Briefcase, TrendingUp, Eye, Shield, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function RecruiterInfoExpandable() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-teal-600" />
            SOMVIAC – Informácie pre recruiterov
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-teal-600">
            {isExpanded ? (
              <>
                Skryť <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Zobraziť viac <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4">
          Ako funguje aplikácia, čo robí recruiter, čo dostáva, ako sa účtuje
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Sekcia 1: Čo je recruiter */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Čo je recruiter v platforme SOMVIAC
                </h3>
                <div className="ml-7 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Recruiter na platforme SOMVIAC:</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• vyhľadáva a pozýva kandidátov do systému</li>
                    <li>• pomáha kandidátom dostať sa k príležitostiam vo firmách</li>
                    <li>• má prehľad o stave svojich kandidátov v každom kroku</li>
                  </ul>
                  <p className="mt-3">
                    <strong>Recruiter NIE JE:</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• sprostredkovateľ zamestnania</li>
                    <li>• agentúra dočasného zamestnávania</li>
                    <li>• osoba, ktorá inkasuje províziu z príjmu alebo z pracovného vzťahu človeka</li>
                  </ul>
                  <p className="mt-3 text-xs italic">
                    Recruiter pracuje iba so systémom kontaktov a Index cenou: platforma technicky spojí kandidáta s
                    firmou, ak Firma využije kontakt recruitera, vzniká nárok na podiel.
                  </p>
                </div>
              </div>

              {/* Sekcia 2: Čo robí recruiter */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                  Čo robí recruiter v platforme
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li>
                    <strong>2.1. Pozýva kandidátov do SOMVIAC</strong> - cez pozývací link, QR kód, alebo zadaním
                    e-mailu kandidáta
                  </li>
                  <li>
                    <strong>2.2. Pomáha kandidátom dokončiť profil a testy</strong> - môže odporučiť doplnenie
                    základných testov, zvyšuje tým šancu kandidáta
                  </li>
                  <li>
                    <strong>2.3. Má LIVE prehľad o stave kandidátov</strong> - či je aktívny, má testy splnené, firma
                    prejavila záujem, kontakt odkrytý, kandidát zamestnaný
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground ml-7 italic">
                  Platforma je 100 % transparentná – recruiter vždy vidí realitu.
                </p>
              </div>

              {/* Sekcia 3: Odmeňovanie */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-teal-600" />
                  Odmeňovanie recruitera
                </h3>
                <div className="bg-white rounded-lg p-4 border border-teal-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">80%</p>
                      <p className="text-xs text-muted-foreground">z Index ceny</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">6x</p>
                      <p className="text-xs text-muted-foreground">max mesačných odmien</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">0€</p>
                      <p className="text-xs text-muted-foreground">žiadne náklady</p>
                    </div>
                  </div>
                </div>
                <div className="ml-7 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Kedy vzniká nárok na odmenu:</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• Firma odkryla kontakt kandidáta recruitera</li>
                    <li>• Firma označí kandidáta ako „zamestnaného" v systéme</li>
                    <li>• Firma začne platiť Mesačnú Index platbu</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Výplata:</strong> SOMVIAC vypláca recruiterovi jeho podiel len vtedy, keď Firma zaplatila
                    príslušnú Mesačnú Index platbu.
                  </p>
                </div>
              </div>

              {/* Sekcia 4: Čo vidí recruiter */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-600" />
                  Čo vidí recruiter v rozhraní
                </h3>
                <div className="flex flex-wrap gap-2 ml-7">
                  {[
                    { label: "Nový profil", color: "bg-gray-100 text-gray-700" },
                    { label: "Testy prebiehajú", color: "bg-blue-100 text-blue-700" },
                    { label: "Vo výbere", color: "bg-purple-100 text-purple-700" },
                    { label: "Kontakt odkrytý firmou", color: "bg-amber-100 text-amber-700" },
                    { label: "Zamestnaný", color: "bg-green-100 text-green-700" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${step.color}`}>{step.label}</span>
                      {i < 4 && <span className="mx-1 text-gray-400">→</span>}
                    </div>
                  ))}
                </div>
                <div className="ml-7 mt-3 bg-gray-50 rounded-lg p-3 border text-sm">
                  <p className="font-medium mb-2">Príklad v UI:</p>
                  <p className="text-muted-foreground">
                    <strong>Kandidát:</strong> Ján Novák
                    <br />
                    <strong>Index cena:</strong> 300 coinov
                    <br />
                    <strong>Podiel recruitera:</strong> 240 coinov (80%)
                    <br />
                    <strong>Vyplatené:</strong> 40 coinov
                    <br />
                    <strong>Očakávané:</strong> 200 coinov (5 mesiacov)
                  </p>
                  <p className="mt-2 text-xs italic">Zero bullshit. Všetko je jasné.</p>
                </div>
              </div>

              {/* Sekcia 5: Zodpovednosť */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-600" />
                  Zodpovednosť a právny rámec
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li>
                    • <strong>Recruiter nijako neovplyvňuje rozhodovanie firmy</strong> - Firma si vyberá, či kandidáta
                    zamestná
                  </li>
                  <li>
                    • <strong>Platforma nedovoľuje obchádzanie</strong> - ak Firma obíde systém, SOMVIAC vymáha zmluvnú
                    pokutu, recruiter nesie 0% zodpovednosti
                  </li>
                  <li>
                    • <strong>Recruiter môže mať vlastnú sieť</strong> - môže pozývať aj iných recruiterov, pri ich
                    aktivitách môže mať motivačné bonusy
                  </li>
                </ul>
              </div>

              {/* Sekcia 6: Hodnoty a benefity */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-teal-600" />
                  Hodnoty a benefity platformy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                    <p className="font-medium text-sm">Talent {">"} papier</p>
                    <p className="text-xs text-muted-foreground">
                      Recruiter pomáha ľuďom ukázať reálne zručnosti, testy potvrdzujú CV
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                    <p className="font-medium text-sm">Rýchlejšia cesta</p>
                    <p className="text-xs text-muted-foreground">Hotové testy = firmy rozhodujú rýchlejšie</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                    <p className="font-medium text-sm">40% zisku späť</p>
                    <p className="text-xs text-muted-foreground">Kandidáti získavajú vzdelávanie a testy späť</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                    <p className="font-medium text-sm">Férové prostredie</p>
                    <p className="text-xs text-muted-foreground">Žiadne skryté pravidlá, všetko transparentné</p>
                  </div>
                </div>
              </div>

              {/* Sekcia 7: Prečo sa oplatí */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  Prečo sa oplatí robiť recruiting cez SOMVIAC
                </h3>
                <div className="ml-7 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Žiadne náklady",
                    "Žiadne riziko",
                    "Reálne prepojenia",
                    "Bez papierovačiek",
                    "Priama odmena",
                    "Všetko pod kontrolou",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground ml-7 italic mt-2">
                  Všetko je tak jednoduché, ako len môže byť.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
