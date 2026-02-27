"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, FileText, Calendar, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface SignedContractViewProps {
  onClose: () => void
}

interface ContractData {
  fullName: string
  birthDate: string
  address: string
  ico: string
  dic: string
  bankAccount: string
  phone: string
  email: string
}

export function SignedContractView({ onClose }: SignedContractViewProps) {
  const [contractData, setContractData] = useState<{
    contract_signed_at: string | null
    contract_data: ContractData | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch("/api/recruiter/contract")
        if (response.ok) {
          const data = await response.json()
          setContractData(data)
        }
      } catch (error) {
        console.error("Error fetching contract:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContract()
  }, [])

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center text-muted-foreground">Načítavam zmluvu...</CardContent>
      </Card>
    )
  }

  if (!contractData?.contract_data) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center text-muted-foreground">Údaje o zmluve nie sú k dispozícii.</CardContent>
      </Card>
    )
  }

  const data = contractData.contract_data
  const signedDate = contractData.contract_signed_at
    ? new Date(contractData.contract_signed_at).toLocaleDateString("sk-SK")
    : "Neznámy"

  const contractText = `
ZMLUVA O SPOLUPRÁCI

uzatvorená podľa § 269 ods. 2 Obchodného zákonníka

medzi:

Objednávateľ:
SOMVIAC s.r.o.
Sídlo: [Adresa spoločnosti]
IČO: [IČO]
DIČ: [DIČ]
Zastúpený: [Meno konateľa]

a

Poskytovateľ (Recruiter):
Meno a priezvisko: ${data.fullName}
Dátum narodenia: ${data.birthDate || "Nevyplnené"}
Trvalé bydlisko: ${data.address}
IČO: ${data.ico || "Nevyplnené (fyzická osoba)"}
DIČ: ${data.dic || "Nevyplnené"}
Bankový účet: ${data.bankAccount}
Telefón: ${data.phone}
E-mail: ${data.email}

Článok I. - Predmet zmluvy

1.1 Predmetom tejto zmluvy je spolupráca medzi Objednávateľom a Poskytovateľom v oblasti sprostredkovania zamestnancov prostredníctvom platformy SOMVIAC.

1.2 Poskytovateľ sa zaväzuje aktívne vyhľadávať a pozývať vhodných kandidátov na registráciu do platformy SOMVIAC.

Článok II. - Odmena

2.1 Za úspešné sprostredkovanie kandidáta, ktorý nastúpi do zamestnania, prináleží Poskytovateľovi provízia vo výške 3% z ročného hrubého platu kandidáta.

2.2 Provízia je splatná po uplynutí skúšobnej doby kandidáta v novom zamestnaní.

2.3 Výplata provízie prebieha na bankový účet uvedený v tejto zmluve.

Článok III. - Povinnosti Poskytovateľa

3.1 Poskytovateľ sa zaväzuje:
- Pozývať len reálnych kandidátov s ich súhlasom
- Neposkytovať nepravdivé informácie o platforme
- Dodržiavať GDPR a ochranu osobných údajov
- Nepoškodzovať dobré meno platformy SOMVIAC

Článok IV. - Trvanie zmluvy

4.1 Táto zmluva sa uzatvára na dobu neurčitú.

4.2 Každá zo strán môže zmluvu vypovedať s 30-dňovou výpovednou lehotou.

Článok V. - Záverečné ustanovenia

5.1 Táto zmluva nadobúda platnosť a účinnosť dňom elektronického podpisu oboma stranami.

5.2 Zmeny a doplnky tejto zmluvy sú platné len v písomnej forme.

Dátum podpisu: ${signedDate}
`

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mt-4 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Vaša podpísaná zmluva
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Podpísaná</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{signedDate}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/30">
            <pre className="whitespace-pre-wrap text-sm font-sans">{contractText}</pre>
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Zavrieť
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
