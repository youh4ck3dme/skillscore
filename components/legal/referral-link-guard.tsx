"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ReferralContractSigning } from "./referral-contract-signing"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, Loader2 } from "lucide-react"

interface ReferralLinkGuardProps {
  children: React.ReactNode
}

export function ReferralLinkGuard({ children }: ReferralLinkGuardProps) {
  const [contractSigned, setContractSigned] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkContractStatus()
  }, [])

  const checkContractStatus = async () => {
    try {
      const response = await fetch("/api/legal/referral-contract-status")
      const data = await response.json()
      setContractSigned(data.contractSigned)
    } catch (error) {
      console.error("Error checking referral contract status:", error)
      setContractSigned(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContractSigned = () => {
    setContractSigned(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Kontrolujem stav zmluvy...</span>
        </div>
      </div>
    )
  }

  if (!contractSigned) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Referral linky nie sú dostupné
            </CardTitle>
            <CardDescription>
              Pre generovanie referral linkov musíte najprv podpísať zmluvu o odmeňovaní za odporúčanie
            </CardDescription>
          </CardHeader>
        </Card>
        <ReferralContractSigning onContractSigned={handleContractSigned} />
      </div>
    )
  }

  return <>{children}</>
}
