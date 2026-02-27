"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import useSWR from "swr"
import { Trash2, Mail, User, Users, Clock, CheckCircle, XCircle, Copy } from 'lucide-react'
import { useT } from "@/lib/i18n/hooks"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InvitationsPage() {
  const t = useT()

  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "expired">("pending")
  const { data, error, mutate } = useSWR("/api/recruiter/invitations", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  })

  const invitations = data?.invitations || []
  const loading = !data && !error

  const filteredInvitations = invitations.filter((inv: any) => {
    if (filter === "all") return true
    return inv.status === filter
  })

  const handleDelete = async (id: string) => {
    if (!confirm(t("recruiterInvitations.deleteConfirm"))) return

    try {
      const response = await fetch(`/api/recruiter/invitations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete invitation")
      }

      mutate()
      alert(t("recruiterInvitations.deleteSuccess"))
    } catch (error) {
      console.error("Error deleting invitation:", error)
      alert(t("recruiterInvitations.deleteError"))
    }
  }

  const copyLink = (code: string, type: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const url = `${baseUrl}/invite/${code}?type=${type}`
    navigator.clipboard.writeText(url)
    alert(t("recruiterInvitations.actions.linkCopied"))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            {t("recruiterInvitations.status.pending")}
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("recruiterInvitations.status.accepted")}
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
            <XCircle className="w-3 h-3 mr-1" />
            {t("recruiterInvitations.status.expired")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout requireVerification={false}>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/dashboard/recruiter"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("recruiterInvitations.nav.backToDashboard")}
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t("recruiterInvitations.title")}</h1>
            <p className="text-muted-foreground">{t("recruiterInvitations.subtitle")}</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              {t("recruiterInvitations.filters.all")} ({invitations.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              {t("recruiterInvitations.filters.pending")} (
              {invitations.filter((i: any) => i.status === "pending").length})
            </Button>
            <Button
              variant={filter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("accepted")}
            >
              {t("recruiterInvitations.filters.accepted")} (
              {invitations.filter((i: any) => i.status === "accepted").length})
            </Button>
            <Button
              variant={filter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("expired")}
            >
              {t("recruiterInvitations.filters.expired")} (
              {invitations.filter((i: any) => i.status === "expired").length})
            </Button>
          </div>

          {/* Invitations List */}
          {loading && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t("recruiterInvitations.loading")}
              </CardContent>
            </Card>
          )}

          {!loading && filteredInvitations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("recruiterInvitations.empty")}</p>
              </CardContent>
            </Card>
          )}

          {!loading && filteredInvitations.length > 0 && (
            <div className="space-y-4">
              {filteredInvitations.map((invitation: any) => (
                <Card key={invitation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {invitation.invited_type === "candidate" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                          {invitation.invited_email}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {t("recruiterInvitations.invitedAs")}{" "}
                          <strong>
                            {invitation.invited_type === "candidate"
                              ? t("recruiterInvitations.types.candidate")
                              : t("recruiterInvitations.types.recruiter")}
                          </strong>
                          {" • "}
                          {t("recruiterInvitations.sent")} {new Date(invitation.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">{getStatusBadge(invitation.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(invitation.invitation_code, invitation.invited_type)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {t("recruiterInvitations.actions.copyLink")}
                      </Button>
                      {invitation.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete(invitation.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("recruiterInvitations.actions.delete")}
                        </Button>
                      )}
                    </div>
                    {invitation.personal_message && (
                      <div className="mt-3 p-3 bg-muted rounded text-sm">
                        <p className="font-semibold text-xs text-muted-foreground mb-1">
                          {t("recruiterInvitations.personalMessage")}
                        </p>
                        <p>{invitation.personal_message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}
