"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

const testUsers = [
  { email: "admin@somviac.sk", password: "password123", type: "admin" },
  { email: "company@somviac.sk", password: "password123", type: "company" },
  { email: "recruiter@somviac.sk", password: "password123", type: "recruiter" },
  { email: "candidate@somviac.sk", password: "password123", type: "candidate" },
]

export default function CreateTestUsersPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [results, setResults] = useState<Array<{ email: string; success: boolean; message: string }>>([])

  const createTestUsers = async () => {
    setIsCreating(true)
    setResults([])
    const supabase = createClient()

    const newResults = []

    for (const user of testUsers) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard/${user.type}`,
            data: {
              user_type: user.type,
            },
          },
        })

        if (error) {
          newResults.push({
            email: user.email,
            success: false,
            message: error.message,
          })
        } else {
          newResults.push({
            email: user.email,
            success: true,
            message: "User created successfully",
          })
        }
      } catch (error) {
        newResults.push({
          email: user.email,
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    setResults(newResults)
    setIsCreating(false)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Vytvoriť testovacích používateľov</CardTitle>
              <CardDescription>
                Vytvorí testovacích používateľov pre všetky typy účtov (admin, company, recruiter, candidate)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Testovacie účty:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {testUsers.map((user) => (
                      <li key={user.email}>
                        <strong>{user.email}</strong> / {user.password} ({user.type})
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={createTestUsers} disabled={isCreating} className="w-full">
                  {isCreating ? "Vytvárajú sa používatelia..." : "Vytvoriť testovacích používateľov"}
                </Button>

                {results.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Výsledky:</h3>
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border p-3 ${
                          result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <p className={`text-sm font-medium ${result.success ? "text-green-900" : "text-red-900"}`}>
                              {result.email}
                            </p>
                            <p className={`text-xs ${result.success ? "text-green-700" : "text-red-700"}`}>
                              {result.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
