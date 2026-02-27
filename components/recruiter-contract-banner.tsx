"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"
import { RecruiterContractModal } from "./recruiter-contract-modal"
import { SignedContractView } from "./signed-contract-view"

interface RecruiterContractBannerProps {
  isContractSigned: boolean
  recruiterName?: string
  onContractSigned: () => void
}

export function RecruiterContractBanner({
  isContractSigned,
  recruiterName,
  onContractSigned,
}: RecruiterContractBannerProps) {
  const [showModal, setShowModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [localSigned, setLocalSigned] = useState(false)

  const effectivelySigned = isContractSigned || localSigned

  const handleSign = async (data: any) => {
    try {
      const response = await fetch("/api/recruiter/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractData: data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error("Failed to sign contract")
      }

      const result = await response.json()

      setLocalSigned(true)
      onContractSigned()
      setShowModal(false)
    } catch (error) {
      console.error("Error signing contract:", error)
      throw error
    }
  }

  if (effectivelySigned) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full sm:w-auto border-green-500 bg-green-50 hover:bg-green-100 text-green-800"
        >
          <FileText className="h-4 w-4 mr-2" />
          Zmluva podpísaná
          {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>

        {isExpanded && <SignedContractView onClose={() => setIsExpanded(false)} />}
      </div>
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
                  <p className="font-semibold text-amber-800">Vyžaduje sa podpis zmluvy</p>
                  <p className="text-sm text-amber-700">
                    Pre aktiváciu účtu a možnosť pozývať kandidátov musíte podpísať zmluvu o spolupráci.
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

      <RecruiterContractModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSign={handleSign}
        recruiterName={recruiterName}
      />
    </>
  )
}
