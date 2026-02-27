"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RecruiterContractSigning } from "./recruiter-contract-signing"

interface RecruiterDashboardGuardProps {
  children: React.ReactNode
  recruiterId: string
  recruiterName?: string
  recruiterEmail?: string
}

export function RecruiterDashboardGuard({
  children,
  recruiterId,
  recruiterName,
  recruiterEmail,
}: RecruiterDashboardGuardProps) {
  const [contractSigned, setContractSigned] = useState<boolean | null>(null)
  const [showContractModal, setShowContractModal] = useState(false)

  useEffect(() => {
    checkContractStatus()
  }, [recruiterId])

  const checkContractStatus = async () => {
    try {
      const response = await fetch(`/api/legal/recruiter-contract-status?recruiterId=${recruiterId}`)
      const data = await response.json()

      if (data.contractSigned) {
        setContractSigned(true)
      } else {
        setContractSigned(false)
        setShowContractModal(true)
      }
    } catch (error) {
      console.error("Error checking contract status:", error)
      setContractSigned(false)
      setShowContractModal(true)
    }
  }

  const handleContractSigned = () => {
    setContractSigned(true)
    setShowContractModal(false)
  }

  // Show loading while checking contract status
  if (contractSigned === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kontrolujem stav zmluvy...</p>
        </div>
      </div>
    )
  }

  // Show contract signing modal if not signed
  if (!contractSigned) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="bg-yellow-100 p-6 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">Zmluva o spolupráci</h2>
              <p className="text-yellow-700">
                Pred prvou akciou na dashboarde musíte jednorazovo podpísať zmluvu o spolupráci s SOMVIAC.
              </p>
            </div>
          </div>
        </div>

        <RecruiterContractSigning
          isOpen={showContractModal}
          onClose={() => {}} // Cannot close without signing
          onContractSigned={handleContractSigned}
          recruiterName={recruiterName}
          recruiterEmail={recruiterEmail}
        />
      </>
    )
  }

  // Show dashboard if contract is signed
  return <>{children}</>
}
