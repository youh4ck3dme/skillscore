"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, FileText, Users, Euro } from "lucide-react"

interface RecruiterContractSigningProps {
  isOpen: boolean
  onClose: () => void
  onContractSigned: () => void
  recruiterName?: string
  recruiterEmail?: string
}

export function RecruiterContractSigning({
  isOpen,
  onClose,
  onContractSigned,
  recruiterName = "",
  recruiterEmail = "",
}: RecruiterContractSigningProps) {
  const [formData, setFormData] = useState({
    name: recruiterName,
    ico: "",
    address: "",
    iban: "",
    email: recruiterEmail,
    phone: "",
    place: "",
    date: new Date().toLocaleDateString("sk-SK"),
  })
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return

    setIsSubmitting(true)

    try {
      // Save contract signing to database
      const response = await fetch("/api/legal/sign-recruiter-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          signedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        onContractSigned()
        onClose()
      }
    } catch (error) {
      console.error("Error signing contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zmluva o spolupráci - Rekrúter
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Content */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Pred prvou akciou na dashboarde</h3>
              <p className="text-sm text-blue-700">Musíte jednorazovo podpísať zmluvu o spolupráci s SOMVIAC.</p>
            </div>

            <ScrollArea className="h-96 border rounded-lg p-4">
              <div className="space-y-4 text-sm">
                <div className="bg-teal-50 p-3 rounded border-l-4 border-teal-500">
                  <h4 className="font-semibold text-teal-900">Kľúčové body zmluvy:</h4>
                  <ul className="mt-2 space-y-1 text-teal-800">
                    <li className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      <strong>20% provízia</strong> z fixnej Index ceny SOMVIAC za vašich kandidátov (max 6 mesiacov)
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <strong>2% override</strong> z fixnej Index provízie podrekrúterov (neobmedzený počet úrovní)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <strong>5000€ pokuta</strong> za obchádzanie platformy
                    </li>
                    <li className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      <strong>50€ minimálna výplata</strong> (nižšie sumy sa prenášajú na ďalší mesiac)
                    </li>
                  </ul>
                </div>

                <div className="prose prose-sm">
                  <h3 className="text-teal-600 border-b border-teal-200 pb-2">ZMLUVA O SPOLUPRÁCI – REKRÚTER</h3>

                  <div className="bg-gray-50 p-3 rounded text-xs">
                    uzatvorená podľa § 269 ods. 2 Obchodného zákonníka (SR) – nejde o zmluvu podľa zákona o agentúrach
                    dočasného zamestnávania
                  </div>

                  <h4 className="text-teal-700 mt-4">Článok I – Zmluvné strany a definície</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>
                      <strong>SOMVIAC (Objednávateľ):</strong> Oskar Nagy, Bajzova 1, 821 08 Bratislava, IČO: 57226202
                    </p>
                    <p>
                      <strong>Rekrúter (Dodávateľ):</strong> Údaje vyplníte v formulári
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <strong>Definície:</strong>
                    <br />
                    <em>Kandidát</em> – osoba zaradená do databázy SOMVIAC
                    <br />
                    <em>Kontakt</em> – sprístupnenie osobných údajov kandidáta Firme
                    <br />
                    <em>Index provízia SOMVIAC</em> – fixná mesačná platba firmy za Kontakt podľa cenníka (nie percento
                    zo mzdy), vypočítaná kalkulačkou na základe krajiny, pozície, druhu práce a rokov praxe, platná
                    počas zamestnania najviac 6 mesiacov
                  </div>

                  <h4 className="text-teal-700">Článok II – Predmet zmluvy</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Rekrúter vyhľadáva a odporúča kandidátov pre databázu SOMVIAC pozvaním alebo vytvorením profilu s
                      ich súhlasom.
                    </li>
                    <li>SOMVIAC zabezpečí vedenie účtu rekrútera a výpočet/prehľad provízií.</li>
                  </ol>

                  <h4 className="text-teal-700">Článok III – Provízia rekrútera a výplata</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      <strong>Základ provízie:</strong> 20% z fixnej Index provízie SOMVIAC za priamo privedeného
                      kandidáta (nie percento zo mzdy)
                    </li>
                    <li>
                      <strong>Časový režim:</strong> Mesačne počas zamestnania, najviac 6 po sebe idúcich mesiacov
                    </li>
                    <li>
                      <strong>Podmienka úhrady:</strong> Len za mesiace, za ktoré SOMVIAC reálne obdržal fixnú mesačnú
                      províziu od firmy
                    </li>
                    <li>
                      <strong>Override z podrekrútera:</strong> 2% z fixnej Index provízie podrekrútera (odpočíta sa z
                      jeho provízie)
                    </li>
                    <li>
                      <strong>Výplatné podmienky:</strong> Do 15. dňa nasledujúceho mesiaca
                    </li>
                    <li>
                      <strong>Minimálna suma:</strong> 50 EUR; nižšie sumy sa prenášajú
                    </li>
                  </ol>

                  <h4 className="text-teal-700">Článok IV – Povinnosti rekrútera</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Získať preukázateľný súhlas kandidáta so spracovaním údajov</li>
                    <li>Uvádzať pravdivé a aktuálne informácie o kandidátoch</li>
                    <li>Dodržiavať GDPR, VOP a pokyny SOMVIAC</li>
                  </ol>

                  <h4 className="text-teal-700">Článok V – Zákaz obchádzania a sankcie</h4>
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p>
                      <strong>Zmluvná pokuta 5000€</strong> za každé obchádzanie SOMVIAC pri uzatváraní dohôd s firmami.
                    </p>
                  </div>

                  <h4 className="text-teal-700">Článok VI – Dôvernosť a ochrana údajov</h4>
                  <p>Zachovávanie mlčanlivosti o všetkých skutočnostiach aj po ukončení zmluvy.</p>

                  <h4 className="text-teal-700">Článok VII – Trvanie a ukončenie</h4>
                  <p>Zmluva na dobu neurčitú, výpoveď s 15-dňovou lehotou.</p>

                  <h4 className="text-teal-700">Článok VIII – Rozhodné právo</h4>
                  <p>Právny poriadok SR, spory pred súdom v Bratislave.</p>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Signing Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Údaje pre podpísanie zmluvy</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Meno/Názov *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ico">IČO (ak má)</Label>
                <Input
                  id="ico"
                  value={formData.ico}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ico: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="address">Sídlo/Bydlisko *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="iban">Bankové spojenie/IBAN *</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData((prev) => ({ ...prev, iban: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefón *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="place">Miesto podpísania *</Label>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => setFormData((prev) => ({ ...prev, place: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Dátum</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 p-4 bg-yellow-50 rounded-lg">
                <Checkbox id="agree" checked={agreed} onCheckedChange={setAgreed} />
                <Label htmlFor="agree" className="text-sm leading-relaxed">
                  Súhlasím s podmienkami zmluvy o spolupráci a elektronicky ju podpisujem. Beriem na vedomie províziu
                  20% z fixnej Index ceny SOMVIAC (nie percento zo mzdy), override 2%, zákaz obchádzania s pokutou 5000€
                  a všetky ostatné podmienky zmluvy.
                </Label>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Zrušiť
                </Button>
                <Button type="submit" disabled={!agreed || isSubmitting} className="flex-1">
                  {isSubmitting ? "Podpisujem..." : "Elektronicky podpísať zmluvu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
