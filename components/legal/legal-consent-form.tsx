"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CandidateAGB } from "./candidate-agb"
import { CandidateGDPR } from "./candidate-gdpr"
import { RecruiterAGB } from "./recruiter-agb"
import { RecruiterGDPR } from "./recruiter-gdpr"
import { CompanyAGB } from "./company-agb"
import { CompanyContract } from "./company-contract"

interface LegalConsentFormProps {
  onConsentsChange: (consents: { agb: boolean; gdpr: boolean; contract?: boolean }) => void
  userType: "candidate" | "company" | "recruiter"
}

export function LegalConsentForm({ onConsentsChange, userType }: LegalConsentFormProps) {
  const [agbConsent, setAgbConsent] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [contractConsent, setContractConsent] = useState(false)

  const handleAgbChange = (checked: boolean) => {
    setAgbConsent(checked)
    onConsentsChange({
      agb: checked,
      gdpr: gdprConsent,
      contract: userType === "company" ? contractConsent : undefined,
    })
  }

  const handleGdprChange = (checked: boolean) => {
    setGdprConsent(checked)
    onConsentsChange({
      agb: agbConsent,
      gdpr: checked,
      contract: userType === "company" ? contractConsent : undefined,
    })
  }

  const handleContractChange = (checked: boolean) => {
    setContractConsent(checked)
    onConsentsChange({
      agb: agbConsent,
      gdpr: gdprConsent,
      contract: checked,
    })
  }

  const isCandidate = userType === "candidate"
  const isRecruiter = userType === "recruiter"
  const isCompany = userType === "company"

  const userTypeLabel = isCandidate ? "kandidátov" : isRecruiter ? "rekrúterov" : "firmy"

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold">Právne dokumenty a súhlasy</h3>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox id="agb-consent" checked={agbConsent} onCheckedChange={handleAgbChange} className="mt-1" />
          <div className="flex-1">
            <label htmlFor="agb-consent" className="text-sm font-medium cursor-pointer">
              Súhlasím s{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-primary underline">
                    Všeobecnými obchodnými podmienkami
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Všeobecné obchodné podmienky</DialogTitle>
                  </DialogHeader>
                  {isCandidate && <CandidateAGB />}
                  {isRecruiter && <RecruiterAGB open={true} onOpenChange={() => {}} />}
                  {isCompany && <CompanyAGB open={true} onOpenChange={() => {}} />}
                </DialogContent>
              </Dialog>{" "}
              pre {userTypeLabel}
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              {isCandidate && "Obsahuje pravidlá používania platformy, anonymita systém, testovanie, referral program"}
              {isRecruiter && "Obsahuje provízny systém (20% mesačne), hierarchiu rekrúterov, pozývanie kandidátov"}
              {isCompany && "Obsahuje coin systém, cenník pozícií, kreditovú podmienku (50%), mesačné platby"}
            </p>
          </div>
        </div>

        {!isCompany && (
          <div className="flex items-start space-x-3">
            <Checkbox id="gdpr-consent" checked={gdprConsent} onCheckedChange={handleGdprChange} className="mt-1" />
            <div className="flex-1">
              <label htmlFor="gdpr-consent" className="text-sm font-medium cursor-pointer">
                Súhlasím so{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-primary underline">
                      Zásadami ochrany osobných údajov
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Zásady ochrany osobných údajov</DialogTitle>
                    </DialogHeader>
                    {isCandidate && <CandidateGDPR />}
                    {isRecruiter && <RecruiterGDPR open={true} onOpenChange={() => {}} />}
                  </DialogContent>
                </Dialog>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Informácie o spracovaní vašich osobných údajov podľa GDPR
              </p>
            </div>
          </div>
        )}

        {isCompany && (
          <>
            <div className="flex items-start space-x-3">
              <Checkbox id="gdpr-consent" checked={gdprConsent} onCheckedChange={handleGdprChange} className="mt-1" />
              <div className="flex-1">
                <label htmlFor="gdpr-consent" className="text-sm font-medium cursor-pointer">
                  Súhlasím s ochranou osobných údajov podľa GDPR
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Zaväzujem sa používať získané osobné údaje kandidátov len na účely náboru v súlade s GDPR
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="contract-consent"
                checked={contractConsent}
                onCheckedChange={handleContractChange}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="contract-consent" className="text-sm font-medium cursor-pointer">
                  Súhlasím so{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-primary underline">
                        Zmluvou o sprostredkovaní kontaktu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Zmluva o sprostredkovaní kontaktu</DialogTitle>
                      </DialogHeader>
                      <CompanyContract open={true} onOpenChange={() => {}} />
                    </DialogContent>
                  </Dialog>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Formálna zmluva s pokutou 5000€ za obchádzanie, mesačné platby max 6 mesiacov
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {(!agbConsent || !gdprConsent || (isCompany && !contractConsent)) && (
        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
          {isCompany
            ? "Pre dokončenie registrácie musíte súhlasiť so všetkými troma dokumentmi."
            : "Pre dokončenie registrácie musíte súhlasiť s oboma dokumentmi."}
        </div>
      )}
    </div>
  )
}
