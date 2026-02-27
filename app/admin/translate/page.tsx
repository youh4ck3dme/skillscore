"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TableStatus {
  table: string
  total: number
  needsTranslation: number
  done: number
}

export default function TranslatePage() {
  const [status, setStatus] = useState<TableStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/translate-questions")
      const data = await res.json()
      setStatus(data.status || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const translateTable = async (tableName: string) => {
    setTranslating(tableName)
    setLog((prev) => [...prev, `Starting translation for ${tableName}...`])

    let done = false
    let totalProcessed = 0

    while (!done) {
      try {
        const res = await fetch("/api/admin/translate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: tableName, batchSize: 2 }),
        })

        const data = await res.json()

        if (data.error) {
          setLog((prev) => [...prev, `Error: ${data.error}`])
          break
        }

        if (data.done) {
          setLog((prev) => [...prev, `Completed ${tableName}! Total: ${totalProcessed}`])
          done = true
        } else {
          totalProcessed += data.processed
          setLog((prev) => [...prev, `Processed ${data.processed} (total: ${totalProcessed})`])

          if (data.errors?.length > 0) {
            setLog((prev) => [...prev, ...data.errors.map((e: string) => `  Error: ${e}`)])
          }

          // Refresh status
          await fetchStatus()

          await new Promise((r) => setTimeout(r, 3000))
        }
      } catch (e: any) {
        setLog((prev) => [...prev, `Network error: ${e.message}`])
        break
      }
    }

    setTranslating(null)
    await fetchStatus()
  }

  const translateAll = async () => {
    const tables = [
      "assessment_questions",
      "assessment_answer_options",
      "test_questions",
      "it_skills_questions",
      "work_skills_questions",
      "test_numlog",
    ]

    for (const table of tables) {
      const tableStatus = status.find((s) => s.table === table)
      if (tableStatus && tableStatus.needsTranslation > 0) {
        await translateTable(table)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading status...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Translation Admin</h1>

      <div className="grid gap-4 mb-8">
        {status.map((s) => (
          <Card key={s.table}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{s.table}</CardTitle>
                <Badge variant={s.needsTranslation === 0 ? "default" : "secondary"}>
                  {s.needsTranslation === 0 ? "DONE" : `${s.needsTranslation} remaining`}
                </Badge>
              </div>
              <CardDescription>
                {s.done} / {s.total} translated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(s.done / s.total) * 100} className="mb-2" />
              <Button
                size="sm"
                onClick={() => translateTable(s.table)}
                disabled={translating !== null || s.needsTranslation === 0}
              >
                {translating === s.table ? "Translating..." : "Translate"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Button onClick={translateAll} disabled={translating !== null} size="lg">
          Translate All Missing
        </Button>
        <Button onClick={fetchStatus} variant="outline">
          Refresh Status
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {log.length === 0 ? (
              <p className="text-muted-foreground">No activity yet...</p>
            ) : (
              log.map((line, i) => (
                <div key={i} className="py-0.5">
                  {line}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
