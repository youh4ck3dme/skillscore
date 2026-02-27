"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo, useEffect } from "react"
import { usePricingData } from "@/lib/pricing-data-loader"
import { MapPin, Briefcase, Clock, Calendar, Euro, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface HireCandidateDialogProps {
  candidate: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onHireComplete?: () => void
}

export function HireCandidateDialog({ candidate, open, onOpenChange, onHireComplete }: HireCandidateDialogProps) {
  const { isLoading, getCountries, getPositions, getWorkTypes, getPricingEntry, getSeniority } = usePricingData()

  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [selectedWorkType, setSelectedWorkType] = useState("")
  const [years, setYears] = useState("")
  const [months, setMonths] = useState("6")
  const [paymentDay, setPaymentDay] = useState("15")
  const [submitting, setSubmitting] = useState(false)

  const supabase = createClient()

  const countries = useMemo(() => getCountries(), [])
  const positions = useMemo(() => getPositions(selectedCountry), [selectedCountry])
  const workTypes = useMemo(() => getWorkTypes(selectedCountry, selectedPosition), [selectedCountry, selectedPosition])

  const calculation = useMemo(() => {
    if (!selectedCountry || !selectedPosition || !selectedWorkType) return null

    const entry = getPricingEntry(selectedCountry, selectedPosition, selectedWorkType)
    if (!entry) return null

    const yearsNum = years ? Number.parseInt(years) : null
    const seniority = getSeniority(yearsNum)
    const monthlyPrice = entry[seniority.key]

    const monthsNum = Math.min(Number.parseInt(months) || 6, 6)
    const totalPrice = monthlyPrice * monthsNum

    return { seniority: seniority.level, monthlyPrice, totalPrice, months: monthsNum, seniorityKey: seniority.key }
  }, [selectedCountry, selectedPosition, selectedWorkType, years, months])

  useEffect(() => {
    if (open && candidate) {
      // Try to pre-fill country and position from candidate data
      if (candidate.residence_country_id) {
        setSelectedCountry(candidate.residence_country_id)
      }
      if (candidate.desired_positions?.[0]) {
        setSelectedPosition(candidate.desired_positions[0])
      }
      if (candidate.work_experience_years) {
        setYears(candidate.work_experience_years.toString())
      }
    }
  }, [open, candidate])

  const handleHire = async () => {
    if (!calculation) {
      toast.error("Vyplňte všetky povinné polia")
      return
    }

    if (!paymentDay || Number(paymentDay) < 1 || Number(paymentDay) > 28) {
      toast.error("Deň výplaty musí byť medzi 1-28")
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch("/api/company/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          country: selectedCountry,
          profession: selectedPosition,
          workType: selectedWorkType,
          seniority: calculation.seniorityKey,
          experienceYears: years ? Number(years) : null,
          monthsCount: calculation.months,
          monthlyPrice: calculation.monthlyPrice,
          totalPrice: calculation.totalPrice,
          paymentDay: Number(paymentDay),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Chyba pri najímaní kandidáta")
        return
      }

      toast.success(data.message || "Kandidát úspešne najatý!")
      onHireComplete?.()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error hiring candidate:", error)
      toast.error("Chyba pri najímaní kandidáta")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Najať kandidáta: {candidate?.anonymous_id || "N/A"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Vypočítajte si províziu a nastavte detaily zamestnania. Prvá platba bude strhnutá okamžite, ďalšie platby
            budú podľa vášho plánu.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Dôležité:</strong> Cena je indexová, nezávislá od mzdy kandidáta. Prvá platba bude strhnutá ihneď,
              ďalšie platby 5 dní po dni výplaty kandidáta.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Načítavam cenník...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-1 text-teal-700">
                    <MapPin className="h-4 w-4" />
                    Krajina *
                  </Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={(v) => {
                      setSelectedCountry(v)
                      setSelectedPosition("")
                      setSelectedWorkType("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte krajinu" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-1 text-teal-700">
                    <Briefcase className="h-4 w-4" />
                    Povolanie *
                  </Label>
                  <Select
                    value={selectedPosition}
                    onValueChange={(v) => {
                      setSelectedPosition(v)
                      setSelectedWorkType("")
                    }}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte povolanie" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-teal-700">Druh práce *</Label>
                  <Select value={selectedWorkType} onValueChange={setSelectedWorkType} disabled={!selectedPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte druh práce" />
                    </SelectTrigger>
                    <SelectContent>
                      {workTypes.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-1 text-teal-700">
                    <Clock className="h-4 w-4" />
                    Roky praxe (nepovinné)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="napr. 3"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">0-2: Junior | 2-5: Štandard | 5+: Senior</p>
                </div>

                <div>
                  <Label className="flex items-center gap-1 text-teal-700">
                    <Calendar className="h-4 w-4" />
                    Počet mesiacov (max 6) *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={months}
                    onChange={(e) => setMonths(Math.min(Number.parseInt(e.target.value) || 1, 6).toString())}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-1 text-teal-700">
                    <Euro className="h-4 w-4" />
                    Deň výplaty kandidáta (1-28) *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="28"
                    placeholder="napr. 15"
                    value={paymentDay}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (val >= 1 && val <= 28) setPaymentDay(e.target.value)
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Vaše platby budú 5 dní po tomto dátume</p>
                </div>
              </div>

              {calculation && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="p-3 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Seniorita</p>
                    <p className="text-lg font-semibold">{calculation.seniority}</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Mesačná cena</p>
                    <p className="text-lg font-semibold text-primary">{calculation.monthlyPrice} €</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Počet mesiacov</p>
                    <p className="text-lg font-semibold">{calculation.months}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                    <p className="text-sm text-muted-foreground">Celková cena</p>
                    <p className="text-xl font-bold text-primary">{calculation.totalPrice} €</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  <strong>Poznámka:</strong> Kandidát bude vyradený z databázy po potvrdení najímania. Prvá platba{" "}
                  <strong>{calculation?.monthlyPrice || 0} coinov</strong> bude strhnutá okamžite.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Zrušiť
          </Button>
          <Button onClick={handleHire} disabled={!calculation || submitting || isLoading}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Najímam...
              </>
            ) : (
              <>
                <Euro className="h-4 w-4 mr-2" />
                Potvrdiť najatie ({calculation?.monthlyPrice || 0} coins)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
