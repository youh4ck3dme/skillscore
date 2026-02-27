"use client"

import { CandidateGDPRNew } from "@/components/legal/candidate-gdpr-new"
import { useRouter } from "next/navigation"

export default function GDPRPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <CandidateGDPRNew />
    </div>
  )
}
