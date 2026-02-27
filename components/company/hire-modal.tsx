"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Calculator, Calendar, Coins, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

// Data z CENA kalkulačky
const PRICING_DATA = {
  Slovensko: {
    "Account manažér": {
      Akvizícia: { junior: 900, standard: 1260, senior: 1620 },
      "Udržanie klientov": { junior: 810, standard: 1134, senior: 1458 },
      "Rozvoj obchodu": { junior: 990, standard: 1386, senior: 1782 },
    },
    "IT Developer": {
      Frontend: { junior: 1350, standard: 1890, senior: 2430 },
      Backend: { junior: 1440, standard: 2016, senior: 2592 },
      Fullstack: { junior: 1530, standard: 2142, senior: 2754 },
      DevOps: { junior: 1620, standard: 2268, senior: 2916 },
      Mobile: { junior: 1485, standard: 2079, senior: 2673 },
    },
    Účtovník: {
      "Mzdové účtovníctvo": { junior: 720, standard: 1008, senior: 1296 },
      "Podvojné účtovníctvo": { junior: 810, standard: 1134, senior: 1458 },
      "Daňové poradenstvo": { junior: 900, standard: 1260, senior: 1620 },
    },
    "Projektový manažér": {
      "IT projekty": { junior: 1080, standard: 1512, senior: 1944 },
      "Stavebné projekty": { junior: 990, standard: 1386, senior: 1782 },
      "Marketing projekty": { junior: 900, standard: 1260, senior: 1620 },
    },
    Skladník: {
      "Príjem tovaru": { junior: 540, standard: 756, senior: 972 },
      "Výdaj tovaru": { junior: 540, standard: 756, senior: 972 },
      Inventúra: { junior: 630, standard: 882, senior: 1134 },
    },
    Elektrikár: {
      Silnoprúd: { junior: 810, standard: 1134, senior: 1458 },
      Slaboprúd: { junior: 720, standard: 1008, senior: 1296 },
      Údržba: { junior: 675, standard: 945, senior: 1215 },
    },
    Zvárač: {
      "MIG/MAG": { junior: 900, standard: 1260, senior: 1620 },
      TIG: { junior: 990, standard: 1386, senior: 1782 },
      Elektródové: { junior: 810, standard: 1134, senior: 1458 },
    },
    Kuchár: {
      "Studená kuchyňa": { junior: 540, standard: 756, senior: 972 },
      "Teplá kuchyňa": { junior: 630, standard: 882, senior: 1134 },
      Šéfkuchár: { junior: 810, standard: 1134, senior: 1458 },
    },
    Čašník: {
      Reštaurácia: { junior: 450, standard: 630, senior: 810 },
      Hotel: { junior: 495, standard: 693, senior: 891 },
      Kaviareň: { junior: 405, standard: 567, senior: 729 },
    },
    Vodič: {
      "Osobná doprava": { junior: 630, standard: 882, senior: 1134 },
      "Nákladná doprava": { junior: 810, standard: 1134, senior: 1458 },
      Autobus: { junior: 720, standard: 1008, senior: 1296 },
    },
  },
  Česko: {
    "Account manažér": {
      Akvizícia: { junior: 990, standard: 1386, senior: 1782 },
      "Udržanie klientov": { junior: 891, standard: 1247, senior: 1604 },
      "Rozvoj obchodu": { junior: 1089, standard: 1525, senior: 1960 },
    },
    "IT Developer": {
      Frontend: { junior: 1485, standard: 2079, senior: 2673 },
      Backend: { junior: 1584, standard: 2218, senior: 2851 },
      Fullstack: { junior: 1683, standard: 2356, senior: 3029 },
      DevOps: { junior: 1782, standard: 2495, senior: 3208 },
      Mobile: { junior: 1634, standard: 2287, senior: 2940 },
    },
    Účtovník: {
      "Mzdové účtovníctvo": { junior: 792, standard: 1109, senior: 1426 },
      "Podvojné účtovníctvo": { junior: 891, standard: 1247, senior: 1604 },
      "Daňové poradenstvo": { junior: 990, standard: 1386, senior: 1782 },
    },
    "Projektový manažér": {
      "IT projekty": { junior: 1188, standard: 1663, senior: 2138 },
      "Stavebné projekty": { junior: 1089, standard: 1525, senior: 1960 },
      "Marketing projekty": { junior: 990, standard: 1386, senior: 1782 },
    },
    Skladník: {
      "Príjem tovaru": { junior: 594, standard: 832, senior: 1069 },
      "Výdaj tovaru": { junior: 594, standard: 832, senior: 1069 },
      Inventúra: { junior: 693, standard: 970, senior: 1247 },
    },
    Elektrikár: {
      Silnoprúd: { junior: 891, standard: 1247, senior: 1604 },
      Slaboprúd: { junior: 792, standard: 1109, senior: 1426 },
      Údržba: { junior: 743, standard: 1040, senior: 1337 },
    },
    Zvárač: {
      "MIG/MAG": { junior: 990, standard: 1386, senior: 1782 },
      TIG: { junior: 1089, standard: 1525, senior: 1960 },
      Elektródové: { junior: 891, standard: 1247, senior: 1604 },
    },
    Kuchár: {
      "Studená kuchyňa": { junior: 594, standard: 832, senior: 1069 },
      "Teplá kuchyňa": { junior: 693, standard: 970, senior: 1247 },
      Šéfkuchár: { junior: 891, standard: 1247, senior: 1604 },
    },
    Čašník: {
      Reštaurácia: { junior: 495, standard: 693, senior: 891 },
      Hotel: { junior: 545, standard: 762, senior: 980 },
      Kaviareň: { junior: 446, standard: 624, senior: 802 },
    },
    Vodič: {
      "Osobná doprava": { junior: 693, standard: 970, senior: 1247 },
      "Nákladná doprava": { junior: 891, standard: 1247, senior: 1604 },
      Autobus: { junior: 792, standard: 1109, senior: 1426 },
    },
  },
  Nemecko: {
    "Account manažér": {
      Akvizícia: { junior: 1800, standard: 2520, senior: 3240 },
      "Udržanie klientov": { junior: 1620, standard: 2268, senior: 2916 },
      "Rozvoj obchodu": { junior: 1980, standard: 2772, senior: 3564 },
    },
    "IT Developer": {
      Frontend: { junior: 2700, standard: 3780, senior: 4860 },
      Backend: { junior: 2880, standard: 4032, senior: 5184 },
      Fullstack: { junior: 3060, standard: 4284, senior: 5508 },
      DevOps: { junior: 3240, standard: 4536, senior: 5832 },
      Mobile: { junior: 2970, standard: 4158, senior: 5346 },
    },
    Účtovník: {
      "Mzdové účtovníctvo": { junior: 1440, standard: 2016, senior: 2592 },
      "Podvojné účtovníctvo": { junior: 1620, standard: 2268, senior: 2916 },
      "Daňové poradenstvo": { junior: 1800, standard: 2520, senior: 3240 },
    },
    "Projektový manažér": {
      "IT projekty": { junior: 2160, standard: 3024, senior: 3888 },
      "Stavebné projekty": { junior: 1980, standard: 2772, senior: 3564 },
      "Marketing projekty": { junior: 1800, standard: 2520, senior: 3240 },
    },
    Skladník: {
      "Príjem tovaru": { junior: 1080, standard: 1512, senior: 1944 },
      "Výdaj tovaru": { junior: 1080, standard: 1512, senior: 1944 },
      Inventúra: { junior: 1260, standard: 1764, senior: 2268 },
    },
    Elektrikár: {
      Silnoprúd: { junior: 1620, standard: 2268, senior: 2916 },
      Slaboprúd: { junior: 1440, standard: 2016, senior: 2592 },
      Údržba: { junior: 1350, standard: 1890, senior: 2430 },
    },
    Zvárač: {
      "MIG/MAG": { junior: 1800, standard: 2520, senior: 3240 },
      TIG: { junior: 1980, standard: 2772, senior: 3564 },
      Elektródové: { junior: 1620, standard: 2268, senior: 2916 },
    },
    Kuchár: {
      "Studená kuchyňa": { junior: 1080, standard: 1512, senior: 1944 },
      "Teplá kuchyňa": { junior: 1260, standard: 1764, senior: 2268 },
      Šéfkuchár: { junior: 1620, standard: 2268, senior: 2916 },
    },
    Čašník: {
      Reštaurácia: { junior: 900, standard: 1260, senior: 1620 },
      Hotel: { junior: 990, standard: 1386, senior: 1782 },
      Kaviareň: { junior: 810, standard: 1134, senior: 1458 },
    },
    Vodič: {
      "Osobná doprava": { junior: 1260, standard: 1764, senior: 2268 },
      "Nákladná doprava": { junior: 1620, standard: 2268, senior: 2916 },
      Autobus: { junior: 1440, standard: 2016, senior: 2592 },
    },
  },
  Rakúsko: {
    "Account manažér": {
      Akvizícia: { junior: 1710, standard: 2394, senior: 3078 },
      "Udržanie klientov": { junior: 1539, standard: 2155, senior: 2770 },
      "Rozvoj obchodu": { junior: 1881, standard: 2633, senior: 3386 },
    },
    "IT Developer": {
      Frontend: { junior: 2565, standard: 3591, senior: 4617 },
      Backend: { junior: 2736, standard: 3830, senior: 4925 },
      Fullstack: { junior: 2907, standard: 4070, senior: 5233 },
      DevOps: { junior: 3078, standard: 4309, senior: 5540 },
      Mobile: { junior: 2822, standard: 3950, senior: 5079 },
    },
    Účtovník: {
      "Mzdové účtovníctvo": { junior: 1368, standard: 1915, senior: 2462 },
      "Podvojné účtovníctvo": { junior: 1539, standard: 2155, senior: 2770 },
      "Daňové poradenstvo": { junior: 1710, standard: 2394, senior: 3078 },
    },
    "Projektový manažér": {
      "IT projekty": { junior: 2052, standard: 2873, senior: 3694 },
      "Stavebné projekty": { junior: 1881, standard: 2633, senior: 3386 },
      "Marketing projekty": { junior: 1710, standard: 2394, senior: 3078 },
    },
    Skladník: {
      "Príjem tovaru": { junior: 1026, standard: 1436, senior: 1847 },
      "Výdaj tovaru": { junior: 1026, standard: 1436, senior: 1847 },
      Inventúra: { junior: 1197, standard: 1676, senior: 2155 },
    },
    Elektrikár: {
      Silnoprúd: { junior: 1539, standard: 2155, senior: 2770 },
      Slaboprúd: { junior: 1368, standard: 1915, senior: 2462 },
      Údržba: { junior: 1283, standard: 1796, senior: 2309 },
    },
    Zvárač: {
      "MIG/MAG": { junior: 1710, standard: 2394, senior: 3078 },
      TIG: { junior: 1881, standard: 2633, senior: 3386 },
      Elektródové: { junior: 1539, standard: 2155, senior: 2770 },
    },
    Kuchár: {
      "Studená kuchyňa": { junior: 1026, standard: 1436, senior: 1847 },
      "Teplá kuchyňa": { junior: 1197, standard: 1676, senior: 2155 },
      Šéfkuchár: { junior: 1539, standard: 2155, senior: 2770 },
    },
    Čašník: {
      Reštaurácia: { junior: 855, standard: 1197, senior: 1539 },
      Hotel: { junior: 941, standard: 1317, senior: 1693 },
      Kaviareň: { junior: 770, standard: 1077, senior: 1385 },
    },
    Vodič: {
      "Osobná doprava": { junior: 1197, standard: 1676, senior: 2155 },
      "Nákladná doprava": { junior: 1539, standard: 2155, senior: 2770 },
      Autobus: { junior: 1368, standard: 1915, senior: 2462 },
    },
  },
}

const COUNTRIES = Object.keys(PRICING_DATA)

interface HireModalProps {
  isOpen: boolean
  onClose: () => void
  candidateId: string
  companyId: string
  onSuccess?: () => void
}

export function HireModal({ isOpen, onClose, candidateId, companyId, onSuccess }: HireModalProps) {
  const [country, setCountry] = useState("")
  const [profession, setProfession] = useState("")
  const [workType, setWorkType] = useState("")
  const [experienceYears, setExperienceYears] = useState<number>(0)
  const [monthsCount, setMonthsCount] = useState<number>(1)
  const [paymentDay, setPaymentDay] = useState<number>(15)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyCoins, setCompanyCoins] = useState<number>(0)
  const [loadingCoins, setLoadingCoins] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadCoins = async () => {
      if (!isOpen || !companyId) return

      setLoadingCoins(true)
      try {
        // Try user_balances first
        const { data: balanceData } = await supabase
          .from("user_balances")
          .select("coin_balance")
          .eq("user_id", companyId)
          .single()

        if (balanceData?.coin_balance !== undefined) {
          setCompanyCoins(balanceData.coin_balance)
        } else {
          // Fallback to coin_wallets
          const { data: walletData } = await supabase
            .from("coin_wallets")
            .select("balance")
            .eq("user_id", companyId)
            .single()

          setCompanyCoins(walletData?.balance || 0)
        }
      } catch (err) {
        console.error("Error loading coins:", err)
        setCompanyCoins(0)
      } finally {
        setLoadingCoins(false)
      }
    }

    loadCoins()
  }, [isOpen, companyId, supabase])

  // Derived values
  const professions = country ? Object.keys(PRICING_DATA[country as keyof typeof PRICING_DATA] || {}) : []
  const workTypes =
    country && profession
      ? Object.keys((PRICING_DATA[country as keyof typeof PRICING_DATA] as any)?.[profession] || {})
      : []

  const seniority = experienceYears <= 2 ? "junior" : experienceYears <= 5 ? "standard" : "senior"
  const seniorityLabel =
    seniority === "junior"
      ? "Junior (0-2 roky)"
      : seniority === "standard"
        ? "Štandard (2-5 rokov)"
        : "Senior (5+ rokov)"

  const monthlyPrice =
    country && profession && workType
      ? (PRICING_DATA[country as keyof typeof PRICING_DATA] as any)?.[profession]?.[workType]?.[seniority] || 0
      : 0

  const totalPrice = monthlyPrice * monthsCount
  const hasEnoughCoins = companyCoins >= monthlyPrice // Minimálne prvá platba

  // Reset dependent fields when parent changes
  useEffect(() => {
    setProfession("")
    setWorkType("")
  }, [country])

  useEffect(() => {
    setWorkType("")
  }, [profession])

  useEffect(() => {
    if (isOpen) {
      setCountry("")
      setProfession("")
      setWorkType("")
      setExperienceYears(0)
      setMonthsCount(1)
      setPaymentDay(15)
      setError("")
    }
  }, [isOpen])

  const handleHire = async () => {
    if (!country || !profession || !workType || monthlyPrice === 0) {
      setError("Vyplňte všetky polia")
      return
    }

    if (!hasEnoughCoins) {
      setError("Nedostatok coinov pre prvú platbu")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/company/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          companyId,
          country,
          profession,
          workType,
          seniority,
          experienceYears,
          monthsCount,
          monthlyPrice,
          totalPrice,
          paymentDay,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Chyba pri vytváraní objednávky")
      }

      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-teal-600" />
            Zamestnať kandidáta #{candidateId}
          </DialogTitle>
          <DialogDescription>Vyberte parametre pre výpočet ceny zamestnania</DialogDescription>
        </DialogHeader>

        {loadingCoins ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="ml-2">Načítavam...</span>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Krajina */}
            <div className="space-y-2">
              <Label>Krajina *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte krajinu" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Povolanie */}
            <div className="space-y-2">
              <Label>Povolanie *</Label>
              <Select value={profession} onValueChange={setProfession} disabled={!country}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte povolanie" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Druh práce */}
            <div className="space-y-2">
              <Label>Druh práce *</Label>
              <Select value={workType} onValueChange={setWorkType} disabled={!profession}>
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

            {/* Roky skúseností */}
            <div className="space-y-2">
              <Label>Roky skúseností *</Label>
              <Select value={experienceYears.toString()} onValueChange={(v) => setExperienceYears(Number.parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte roky" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y} {y === 1 ? "rok" : y < 5 ? "roky" : "rokov"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Seniorita: {seniorityLabel}</p>
            </div>

            {/* Počet mesiacov */}
            <div className="space-y-2">
              <Label>Počet mesiacov (max. 6) *</Label>
              <Select value={monthsCount.toString()} onValueChange={(v) => setMonthsCount(Number.parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {m} {m === 1 ? "mesiac" : m < 5 ? "mesiace" : "mesiacov"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deň výplaty */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deň výplaty (mesačne) *
              </Label>
              <Select value={paymentDay.toString()} onValueChange={(v) => setPaymentDay(Number.parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 15, 20, 25, 28].map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      {d}. deň v mesiaci
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                5 dní pred týmto termínom sa vytvorí nárok na strhnutie coinov. Ak nebude dostatok, príde notifikácia.
              </p>
            </div>

            {/* Cenový prehľad */}
            {monthlyPrice > 0 && (
              <Card className="bg-teal-50 border-teal-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mesačná cena:</span>
                      <span className="font-semibold text-lg">{monthlyPrice.toLocaleString()} coinov</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Počet mesiacov:</span>
                      <span>{monthsCount}</span>
                    </div>
                    <hr className="border-teal-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Celková cena:</span>
                      <span className="font-bold text-xl text-teal-700">{totalPrice.toLocaleString()} coinov</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        Váš zostatok:
                      </span>
                      <span className={companyCoins >= monthlyPrice ? "text-green-600" : "text-red-600"}>
                        {companyCoins.toLocaleString()} coinov
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning ak nedostatok coinov */}
            {monthlyPrice > 0 && !hasEnoughCoins && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nemáte dostatok coinov pre prvú mesačnú platbu ({monthlyPrice.toLocaleString()} coinov). Dobite si
                  účet v sekcii Cenník.
                </AlertDescription>
              </Alert>
            )}

            {/* Info o deaktivácii */}
            <Alert>
              <AlertDescription className="text-sm">
                Po zamestnání bude kandidát dočasne stiahnutý z trhu po dobu {monthsCount}{" "}
                {monthsCount === 1 ? "mesiaca" : monthsCount < 5 ? "mesiacov" : "mesiacov"}. Platby budú strhávané
                mesačne.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Zrušiť
          </Button>
          <Button
            onClick={handleHire}
            disabled={isLoading || !monthlyPrice || !hasEnoughCoins || loadingCoins}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Spracovávam...
              </>
            ) : (
              <>Zamestnať za {monthlyPrice > 0 ? monthlyPrice.toLocaleString() : 0} coinov/mesiac</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
