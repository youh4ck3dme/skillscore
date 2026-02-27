"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedCandidates = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/admin/seed-candidates", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Seed failed")
      }

      setResult({ success: data.created, failed: data.failed })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin - Vytvorenie testovacích kandidátov</CardTitle>
          <CardDescription>
            Klikni na tlačidlo a vytvorí sa 40 testovacích kandidátov s vyplnenými CV (20 IT/office + 20 remeslá)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleSeedCandidates} disabled={loading} size="lg" className="w-full">
            {loading ? "Vytváranie kandidátov..." : "Vytvoriť 40 testovacích kandidátov"}
          </Button>

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">✓ Hotovo!</p>
              <p className="text-green-700">
                Vytvorených: {result.success} kandidátov
                {result.failed > 0 && <span className="text-orange-600"> ({result.failed} zlyhalo)</span>}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">× Chyba</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IT/Office profily (20):</strong> Full-Stack Developer, Frontend Developer, Backend Developer,
              DevOps, QA, UX/UI Designer, Project Manager, Data Analyst, atď.
            </p>
            <p>
              <strong>Remeselnícke profily (20):</strong> Elektrikár, Murár, Stolár, Zvárač, Inštalatér, Zámočník,
              Maliar, Klampiar, Tesár, Mechanik, atď.
            </p>
            <p className="text-xs">Všetky profily majú vyplnené CV, jazyky, skúsenosti, platy a dostupnosť.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
