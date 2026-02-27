"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, X, Loader2 } from "lucide-react"

interface CompanySignedContractViewProps {
  onClose: () => void
}

export function CompanySignedContractView({ onClose }: CompanySignedContractViewProps) {
  const [contractData, setContractData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch("/api/company/contract")
        if (response.ok) {
          const data = await response.json()
          setContractData(data)
        }
      } catch (error) {
        console.error("Error fetching contract:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContract()
  }, [])

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          <span className="ml-2">Načítavam zmluvu...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-teal-600" />
          Podpísaná zmluva
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Podpísané dňa:</span>{" "}
              {contractData?.signed_at ? new Date(contractData.signed_at).toLocaleDateString("sk-SK") : "-"}
            </div>
            <div>
              <span className="text-gray-500">Firma:</span> {contractData?.contract_data?.company_name || "-"}
            </div>
            <div>
              <span className="text-gray-500">Zastúpená:</span> {contractData?.contract_data?.contact_person || "-"}
            </div>
            <div>
              <span className="text-gray-500">IČO:</span> {contractData?.contract_data?.ico || "-"}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <pre className="whitespace-pre-wrap text-sm font-sans">
            {contractData?.contract_text || "Zmluva nie je dostupná"}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
