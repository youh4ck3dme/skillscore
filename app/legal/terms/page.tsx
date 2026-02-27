"use client"

import { CandidateTermsNew } from "@/components/legal/candidate-terms-new"
import { useRouter } from "next/navigation"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <CandidateTermsNew />
    </div>
  )
}
