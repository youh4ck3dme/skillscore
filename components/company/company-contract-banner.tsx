"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, FileText, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import { CompanyContractModal } from "./company-contract-modal"

interface CompanyContractBannerProps {
  isContractSigned: boolean
  companyData?: {
    company_name?: string
    contact_person?: string
    email?: string
    phone?: string
    address?: string
    ico?: string
    dic?: string
  }
  onContractSigned: () => void
  onOpenCompanyInfo: () => void // New prop to open company info edit mode
}

export function CompanyContractBanner({
  isContractSigned,
  companyData,
  onContractSigned,
  onOpenCompanyInfo,
}: CompanyContractBannerProps) {
  const [showModal, setShowModal] = useState(false)
  const [localSigned, setLocalSigned] = useState(false)

  const effectivelySigned = isContractSigned || localSigned

  // Required: company_name, address, ico, dic, contact_person, email
  const isCompanyInfoComplete = Boolean(
    companyData?.company_name &&
      companyData?.address &&
      companyData?.ico &&
      companyData?.dic &&
      companyData?.contact_person &&
      companyData?.email,
  )

  const handleSign = async (data: any) => {
    try {
      const response = await fetch("/api/company/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractData: data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to sign contract")
      }

      setLocalSigned(true)
      onContractSigned()
      setShowModal(false)
    } catch (error) {
      console.error("Error signing contract:", error)
      throw error
    }
  }

  if (effectivelySigned) {
    return null
  }

  if (!isCompanyInfoComplete) {
    return (
      <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
        <Card className="mb-6 border-amber-300 bg-amber-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-amber-100 rounded-full">
                  <ClipboardList className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">Krok 1: Vyplňte informácie o firme</p>
                  <p className="text-sm text-amber-700">
                    Pre podpis zmluvy potrebujeme: názov firmy, sídlo, IČO, DIČ, zodpovednú osobu a email.
                  </p>
                </div>
              </div>
              <Button
                onClick={onOpenCompanyInfo}
                className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Vyplniť údaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
        <Card className="mb-6 border-amber-300 bg-amber-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-amber-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">Krok 2: Podpíšte zmluvu</p>
                  <p className="text-sm text-amber-700">
                    Pre aktiváciu účtu a možnosť kontaktovať kandidátov musíte podpísať rámcovú zmluvu.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
              >
                <FileText className="h-4 w-4 mr-2" />
                Podpísať zmluvu
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <CompanyContractModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSign={handleSign}
        companyData={companyData}
      />
    </>
  )
}
