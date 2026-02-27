"use client"

import { useState } from "react"
import { ContactRevealContract } from "./contact-reveal-contract"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, FileText, CheckCircle } from "lucide-react"

interface ContactRevealFlowProps {
  candidateId: string
  candidateAnonymousId: string
  contactPrice: number
  availableCredits: number
  onContactRevealed: (contactData: any) => void
}

interface ContractData {
  companyName: string
  ico: string
  address: string
  representative: string
  email: string
  phone: string
  signatureDate: string
  signaturePlace: string
}

export function ContactRevealFlow({
  candidateId,
  candidateAnonymousId,
  contactPrice,
  availableCredits,
  onContactRevealed,
}: ContactRevealFlowProps) {
  const [step, setStep] = useState<"check" | "contract" | "reveal">("check")
  const [contractSigned, setContractSigned] = useState(false)
  const [contractData, setContractData] = useState<ContractData | null>(null)

  const totalPrice = contactPrice * 6 // 6 months maximum
  const creditRequired = 50 // Fixed 50 coins minimum requirement
  const hasEnoughCredits = availableCredits >= creditRequired

  const handleContractAccept = async (data: ContractData) => {
    try {
      // Save contract to database
      const response = await fetch("/api/contracts/contact-reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          contractData: data,
          contactPrice,
          totalPrice,
          creditRequired,
        }),
      })

      if (response.ok) {
        setContractData(data)
        setContractSigned(true)
        setStep("reveal")
      }
    } catch (error) {
      console.error("Error saving contract:", error)
    }
  }

  const handleRevealContact = async () => {
    try {
      // Reveal contact and deduct credits
      const response = await fetch("/api/candidates/reveal-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          contractId: contractData?.companyName, // or proper contract ID
        }),
      })

      if (response.ok) {
        const contactData = await response.json()
        onContactRevealed(contactData)
      }
    } catch (error) {
      console.error("Error revealing contact:", error)
    }
  }

  if (step === "check") {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600" />
            Odhalenie kontaktu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {candidateAnonymousId}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cena kontaktu:</span>
              <Badge variant="secondary">
                <Coins className="h-3 w-3 mr-1" />
                {contactPrice} coinov/mesiac
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Celková cena (6 mes.):</span>
              <Badge variant="secondary">
                <Coins className="h-3 w-3 mr-1" />
                {totalPrice} coinov
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Minimálny kredit:</span>
              <Badge variant={hasEnoughCredits ? "default" : "destructive"}>
                <Coins className="h-3 w-3 mr-1" />
                {creditRequired} coinov
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Váš kredit:</span>
              <Badge variant={hasEnoughCredits ? "default" : "outline"}>
                <Coins className="h-3 w-3 mr-1" />
                {availableCredits} coinov
              </Badge>
            </div>
          </div>

          {!hasEnoughCredits && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">Nemáte dostatok kreditov. Potrebujete minimálne 50 coinov na účte.</p>
            </div>
          )}

          {hasEnoughCredits && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Kontrolujeme iba dostupnosť 50 coinov. Žiadne coiny nebudú odpočítané pri kontakte.
              </p>
            </div>
          )}

          <Button
            onClick={() => setStep("contract")}
            disabled={!hasEnoughCredits}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Pokračovať na zmluvu
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "reveal") {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Zmluva podpísaná
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {candidateAnonymousId}
            </Badge>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              Zmluva bola úspešne podpísaná. Teraz môžete odhaliť kontakt na kandidáta.
            </p>
          </div>

          <Button onClick={handleRevealContact} className="w-full bg-teal-600 hover:bg-teal-700">
            Odhaliť kontakt
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <ContactRevealContract
      isOpen={step === "contract"}
      onClose={() => setStep("check")}
      onAccept={handleContractAccept}
      candidateId={candidateId}
      contactPrice={contactPrice}
    />
  )
}
