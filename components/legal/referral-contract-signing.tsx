"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, FileText, Users, Euro } from "lucide-react"

interface ReferralContractSigningProps {
  onContractSigned: () => void
}

export function ReferralContractSigning({ onContractSigned }: ReferralContractSigningProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    address: "",
    bankAccount: "",
    emailPhone: "",
  })
  const [contractAccepted, setContractAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contractAccepted) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/legal/sign-referral-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          signedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        onContractSigned()
      }
    } catch (error) {
      console.error("Error signing referral contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zmluva o odmeňovaní za odporúčanie
          </CardTitle>
          <CardDescription>
            Pre generovanie referral linkov musíte podpísať zmluvu o odmeňovaní za odporúčanie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Odmena</span>
                </div>
                <p className="text-sm text-muted-foreground">10% z SOMVIAC provízie za prvé 2 mesiace zamestnania</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Odporúčania</span>
                </div>
                <p className="text-sm text-muted-foreground">Kandidáti aj firmy cez unikátny referral link</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Pokuta</span>
                </div>
                <p className="text-sm text-muted-foreground">500€ za obchádzanie platformy</p>
              </CardContent>
            </Card>
          </div>

          {/* Contract Details Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Zobraziť celú zmluvu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Zmluva o odmeňovaní za odporúčanie (FO)</DialogTitle>
                <DialogDescription>
                  Kompletný text zmluvy o odmeňovaní za odporúčanie pre fyzické osoby
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok I – Zmluvné strany a definície</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>
                        <strong>SOMVIAC (Objednávateľ):</strong> Oskar Nagy, Bajzova 1, 821 08 Bratislava, IČO: 57226202
                      </p>
                      <p>
                        <strong>Odporúčateľ (Fyzická osoba):</strong> Údaje vyplníte v formulári nižšie
                      </p>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>Definície:</strong>
                      <br />
                      <em>Odporúčaný kontakt</em> – kandidát alebo firma odporučená do SOMVIAC
                      <br />
                      <em>Kontakt</em> – sprístupnenie osobných údajov kandidáta firme
                      <br />
                      <em>Provízia SOMVIAC</em> – mesačná platba firmy za kontakt (max 6 mesiacov)
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok II – Predmet zmluvy</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        Odporúčateľ sa zaväzuje odporučiť SOMVIAC kandidátov a/alebo firmy prostredníctvom unikátneho
                        odporúčacieho odkazu
                      </li>
                      <li>SOMVIAC sa zaväzuje viesť evidenciu odporúčaní a vyplácať odmenu</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok III – Odmena Odporúčateľa</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        <strong>Výška odmeny:</strong> 10% z Provízie SOMVIAC za každé úspešné odporúčanie
                      </li>
                      <li>
                        <strong>Časový rozsah:</strong> Odmena za prvé 2 mesiace zamestnania (10% za 1. mesiac + 10% za
                        2. mesiac)
                      </li>
                      <li>
                        <strong>Podmienka úhrady:</strong> Nárok vzniká len ak SOMVIAC reálne obdržal províziu od firmy
                      </li>
                      <li>
                        <strong>Kolízie:</strong> Pri viacerých odporúčateľoch sa odmena prizná prvému (first-touch
                        princíp)
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok IV – Výplata odmeny</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Výplaty mesačne do 15. dňa nasledujúceho mesiaca</li>
                      <li>Bankovým prevodom na IBAN Odporúčateľa</li>
                      <li>Odporúčateľ zodpovedá za daňové povinnosti podľa SR</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok V – Povinnosti a obmedzenia</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Poskytovanie pravdivých informácií</li>
                      <li>Zdržanie sa konania v rozpore so zákonom</li>
                      <li>Zákaz vystupovania v mene SOMVIAC</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok VI – Dôvernosť a ochrana údajov</h3>
                    <p>Zachovanie mlčanlivosti o všetkých informáciách a dodržiavanie GDPR</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok VII – Zákaz obchádzania a sankcie</h3>
                    <p>
                      <strong>Zmluvná pokuta 500€</strong> za obchádzanie platformy alebo porušenie zmluvy
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok VIII – Trvanie a ukončenie</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Zmluva na dobu neurčitú</li>
                      <li>Výpoveď s 15-dňovou lehotou</li>
                      <li>Okamžité odstúpenie pri hrubom porušení</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-teal-600 mb-2">Článok IX – Rozhodné právo a spory</h3>
                    <p>Slovenské právo, súdy v Bratislave</p>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Contract Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Meno a priezvisko *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Dátum narodenia *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Bydlisko *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Ulica, číslo, PSČ, mesto"
                required
              />
            </div>

            <div>
              <Label htmlFor="bankAccount">Bankové spojenie/IBAN *</Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount}
                onChange={(e) => setFormData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                placeholder="SK..."
                required
              />
            </div>

            <div>
              <Label htmlFor="emailPhone">E-mail/Telefón *</Label>
              <Input
                id="emailPhone"
                value={formData.emailPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, emailPhone: e.target.value }))}
                placeholder="email@example.com / +421..."
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="contract-accept" checked={contractAccepted} onCheckedChange={setContractAccepted} />
              <Label htmlFor="contract-accept" className="text-sm">
                Súhlasím so zmluvou o odmeňovaní za odporúčanie a zaväzujem sa dodržiavať všetky jej podmienky *
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={!contractAccepted || isSubmitting}>
              {isSubmitting ? "Podpisujem zmluvu..." : "Podpísať zmluvu a aktivovať referral linky"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
