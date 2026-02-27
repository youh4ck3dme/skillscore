"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, AlertTriangle, CheckCircle } from "lucide-react"
import { getJobPricingIndex, getAvailableProfessions, getAvailableJobTypes } from "@/lib/european-pricing"

interface ContactRevealModalProps {
  isOpen: boolean
  onClose: () => void
  candidate: any
  companyCoins: number
  onRevealSuccess: (email: string, revealData: any) => void
}

export function ContactRevealModal({
  isOpen,
  onClose,
  candidate,
  companyCoins,
  onRevealSuccess,
}: ContactRevealModalProps) {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedProfession, setSelectedProfession] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealedEmail, setRevealedEmail] = useState("")

  // Get pricing index based on selections
  const monthlyPayment =
    selectedCountry && selectedProfession ? getJobPricingIndex(selectedCountry, selectedProfession, selectedJobType) : 0

  const requiredCoins = Math.ceil(monthlyPayment * 0.5) // 50% of monthly payment
  const hasEnoughCoins = companyCoins >= requiredCoins

  const availableProfessions = selectedCountry ? getAvailableProfessions(selectedCountry) : []
  const availableJobTypes =
    selectedCountry && selectedProfession ? getAvailableJobTypes(selectedCountry, selectedProfession) : []

  const handleRevealContact = async () => {
    if (!hasEnoughCoins || !selectedCountry || !selectedProfession) return

    setIsRevealing(true)
    try {
      const response = await fetch("/api/candidates/reveal-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          country: selectedCountry,
          profession: selectedProfession,
          jobType: selectedJobType,
          monthlyPayment,
          requiredCoins,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRevealedEmail(data.email)

        const revealData = {
          country: selectedCountry,
          occupation: selectedProfession,
          workType: selectedJobType || "Standard",
          monthlyPayment,
        }

        onRevealSuccess(data.email, revealData)
      } else {
        throw new Error("Failed to reveal contact")
      }
    } catch (error) {
      console.error("Error revealing contact:", error)
    } finally {
      setIsRevealing(false)
    }
  }

  if (revealedEmail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-xs sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              Kontakt odkrytý
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Email kandidáta:</strong> {revealedEmail}
              </AlertDescription>
            </Alert>

            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Krajina:</strong> {selectedCountry}
              </p>
              <p>
                <strong>Pozícia:</strong> {selectedProfession}
              </p>
              {selectedJobType && (
                <p>
                  <strong>Typ práce:</strong> {selectedJobType}
                </p>
              )}
              <p>
                <strong>Mesačná platba:</strong> {monthlyPayment}€
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              Zavrieť
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-md lg:max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Odkryť kontakt na kandidáta</DialogTitle>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Kandidát: {candidate.first_name} {candidate.last_name}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              Pre odkrytie kontaktu musíte vybrať krajinu a pozíciu, na ktorú kandidáta chcete zamestnať. Cena sa
              vypočíta na základe európskeho indexu platov.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Krajina zamestnania</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte krajinu" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="Austria">Rakúsko</SelectItem>
                  <SelectItem value="Belgium">Belgicko</SelectItem>
                  <SelectItem value="Bulgaria">Bulharsko</SelectItem>
                  <SelectItem value="Croatia">Chorvátsko</SelectItem>
                  <SelectItem value="Cyprus">Cyprus</SelectItem>
                  <SelectItem value="Czech Republic">Česko</SelectItem>
                  <SelectItem value="Denmark">Dánsko</SelectItem>
                  <SelectItem value="Estonia">Estónsko</SelectItem>
                  <SelectItem value="Finland">Fínsko</SelectItem>
                  <SelectItem value="France">Francúzsko</SelectItem>
                  <SelectItem value="Germany">Nemecko</SelectItem>
                  <SelectItem value="Greece">Grécko</SelectItem>
                  <SelectItem value="Hungary">Maďarsko</SelectItem>
                  <SelectItem value="Ireland">Írsko</SelectItem>
                  <SelectItem value="Italy">Taliansko</SelectItem>
                  <SelectItem value="Latvia">Lotyšsko</SelectItem>
                  <SelectItem value="Lithuania">Litva</SelectItem>
                  <SelectItem value="Luxembourg">Luxembursko</SelectItem>
                  <SelectItem value="Malta">Malta</SelectItem>
                  <SelectItem value="Netherlands">Holandsko</SelectItem>
                  <SelectItem value="Poland">Poľsko</SelectItem>
                  <SelectItem value="Portugal">Portugalsko</SelectItem>
                  <SelectItem value="Romania">Rumunsko</SelectItem>
                  <SelectItem value="Slovakia">Slovensko</SelectItem>
                  <SelectItem value="Slovenia">Slovinsko</SelectItem>
                  <SelectItem value="Spain">Španielsko</SelectItem>
                  <SelectItem value="Sweden">Švédsko</SelectItem>
                  <SelectItem value="Norway">Nórsko</SelectItem>
                  <SelectItem value="Iceland">Island</SelectItem>
                  <SelectItem value="Liechtenstein">Lichtenštajnsko</SelectItem>
                  <SelectItem value="Switzerland">Švajčiarsko</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Pozícia</label>
              <Select value={selectedProfession} onValueChange={setSelectedProfession} disabled={!selectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedCountry ? "Vyberte pozíciu" : "Najprv vyberte krajinu"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableProfessions.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      {profession}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {availableJobTypes.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Typ práce (voliteľné)</label>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ práce" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {availableJobTypes.map((jobType) => (
                      <SelectItem key={jobType} value={jobType}>
                        {jobType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {monthlyPayment > 0 && (
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mesačná platba (5% z mzdy):</span>
                <span className="font-medium">{monthlyPayment}€</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cena za odkrytie kontaktu:</span>
                <div className="flex items-center gap-1">
                  <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                  <span className="font-medium">{requiredCoins}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Vaše dostupné coiny:</span>
                <span>{companyCoins}</span>
              </div>
              {!hasEnoughCoins && (
                <div className="text-xs text-destructive">
                  Nedostatok coinov (potrebujete {requiredCoins - companyCoins} coinov navyše)
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
              Zrušiť
            </Button>
            <Button
              onClick={handleRevealContact}
              disabled={!selectedCountry || !selectedProfession || !hasEnoughCoins || isRevealing}
              className="w-full sm:w-auto"
            >
              {isRevealing ? "Odkrývam..." : `Odkryť za ${requiredCoins} coinov`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
