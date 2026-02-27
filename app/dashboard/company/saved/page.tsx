"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AnonymousProfileCard } from "@/components/anonymous-profile-card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { Bookmark, ArrowLeft } from "lucide-react"

export default function SavedCandidatesPage() {
  const [savedCandidates, setSavedCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchSavedCandidates()
  }, [])

  const fetchSavedCandidates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/candidates/save")
      if (response.ok) {
        const data = await response.json()
        setSavedCandidates(data.candidates || [])
      } else {
        console.error("[v0] Failed to fetch saved candidates")
      }
    } catch (error) {
      console.error("[v0] Error fetching saved candidates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToggle = () => {
    fetchSavedCandidates()
  }

  return (
    <DashboardLayout requireVerification={false}>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link
                href="/dashboard/company"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Späť na dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="h-8 w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Uložení kandidáti</h1>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg">Kandidáti, ktorých ste si uložili na neskôr</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Vaši uložení kandidáti</CardTitle>
                  <CardDescription className="text-sm">
                    {savedCandidates.length > 0
                      ? `Máte ${savedCandidates.length} uložených kandidátov`
                      : "Zatiaľ nemáte žiadnych uložených kandidátov"}
                  </CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/company">Vyhľadať kandidátov</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Načítavam uložených kandidátov...</p>
                </div>
              ) : savedCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {savedCandidates.map((candidate) => (
                    <div key={candidate.id} className="relative">
                      <AnonymousProfileCard
                        profile={candidate}
                        isOwn={false}
                        viewerType="company"
                        companyCoins={0}
                        onSaveToggle={handleSaveToggle}
                      />
                      {candidate.notes && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Poznámka:</span> {candidate.notes}
                          </p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Uložené: {new Date(candidate.savedAt).toLocaleDateString("sk-SK")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium mb-2">Žiadni uložení kandidáti</p>
                  <p className="text-sm sm:text-base mb-6">
                    Začnite vyhľadávať kandidátov a uložte si tých zaujímavých na neskôr
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/company">Vyhľadať kandidátov</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  )
}
