"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, Users, User, CheckCircle, XCircle } from "lucide-react"

interface InvitationData {
  id: string
  invited_email: string
  invited_type: "recruiter" | "candidate"
  invited_by_name: string
  personal_message?: string
  status: string
  expires_at: string
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const invitationCode = params.code as string

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations/validate/${invitationCode}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Invalid invitation")
        }

        setInvitation(data.invitation)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invitation")
      } finally {
        setLoading(false)
      }
    }

    if (invitationCode) {
      fetchInvitation()
    }
  }, [invitationCode])

  const handleAcceptInvitation = () => {
    if (!invitation) return

    const registrationUrl = `/auth/register?invitation=${invitationCode}&type=${invitation.invited_type}&email=${encodeURIComponent(invitation.invited_email)}`
    router.push(registrationUrl)
  }

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Načítavam pozvánku...</span>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-red-600">Neplatná pozvánka</CardTitle>
            <CardDescription>{error || "Pozvánka nebola nájdená alebo vypršala."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Späť na hlavnú stránku
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(invitation.expires_at) < new Date()
  const isAccepted = invitation.status === "accepted"

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {invitation.invited_type === "recruiter" ? (
            <Users className="w-12 h-12 text-teal-600 mx-auto mb-2" />
          ) : (
            <User className="w-12 h-12 text-teal-600 mx-auto mb-2" />
          )}
          <CardTitle>
            Pozvánka na registráciu
            {invitation.invited_type === "recruiter" ? " - Recruiter" : " - Kandidát"}
          </CardTitle>
          <CardDescription>{invitation.invited_by_name} vás pozval do SOMVIAC systému</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation.personal_message && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 italic">"{invitation.personal_message}"</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>
              <strong>Email:</strong> {invitation.invited_email}
            </p>
            <p>
              <strong>Typ účtu:</strong> {invitation.invited_type === "recruiter" ? "Recruiter" : "Kandidát"}
            </p>
            <p>
              <strong>Platnosť do:</strong> {new Date(invitation.expires_at).toLocaleDateString("sk-SK")}
            </p>
          </div>

          {isAccepted ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Pozvánka už bola prijatá</span>
            </div>
          ) : isExpired ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">Pozvánka vypršala</span>
            </div>
          ) : (
            <Button onClick={handleAcceptInvitation} className="w-full bg-teal-600 hover:bg-teal-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Prijať pozvánku a registrovať sa
            </Button>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={() => router.push("/")} className="text-sm">
              Späť na hlavnú stránku
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
