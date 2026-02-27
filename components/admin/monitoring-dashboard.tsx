"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { errorHandler, performanceMonitor } from "@/lib/monitoring/error-handler"
import { useToast } from "@/hooks/use-toast"

interface ErrorReport {
  id: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  context: any
  resolved: boolean
}

export function MonitoringDashboard() {
  const [errors, setErrors] = useState<ErrorReport[]>([])
  const [stats, setStats] = useState<any>(null)
  const [performanceStats, setPerformanceStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadMonitoringData()
    const interval = setInterval(loadMonitoringData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadMonitoringData = async () => {
    try {
      // Get error statistics
      const errorStats = errorHandler.getErrorStats()
      const recentErrors = errorHandler.getRecentErrors(20)
      const perfStats = performanceMonitor.getStats()

      setStats(errorStats)
      setErrors(recentErrors)
      setPerformanceStats(perfStats)
    } catch (error) {
      console.error("Failed to load monitoring data:", error)
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať monitoring dáta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resolveError = async (errorId: string) => {
    try {
      errorHandler.resolveError(errorId)
      setErrors((prev) => prev.map((error) => (error.id === errorId ? { ...error, resolved: true } : error)))
      toast({
        title: "Úspech",
        description: "Chyba bola označená ako vyriešená",
      })
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vyriešiť chybu",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Kritická"
      case "high":
        return "Vysoká"
      case "medium":
        return "Stredná"
      case "low":
        return "Nízka"
      default:
        return severity
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítavam monitoring dáta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Monitoring & Chyby</h2>
          <p className="text-muted-foreground">Prehľad systémových chýb a výkonu</p>
        </div>
        <Button onClick={loadMonitoringData} variant="outline">
          Obnoviť dáta
        </Button>
      </div>

      {/* Error Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Celkové chyby</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Všetky zaznamenané chyby</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posledných 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last24h || 0}</div>
            <p className="text-xs text-muted-foreground">Chyby za posledný deň</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kritické chyby</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.bySeverity?.critical || 0}</div>
            <p className="text-xs text-muted-foreground">Vyžadujú okamžitú pozornosť</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nevyriešené</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.unresolved || 0}</div>
            <p className="text-xs text-muted-foreground">Čakajú na vyriešenie</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Chyby</TabsTrigger>
          <TabsTrigger value="performance">Výkon</TabsTrigger>
          <TabsTrigger value="health">Stav systému</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posledné chyby</CardTitle>
              <CardDescription>Najnovšie zaznamenané chyby v systéme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Žiadne chyby neboli zaznamenané</p>
                ) : (
                  errors.map((error) => (
                    <div key={error.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(error.severity)}>{getSeverityLabel(error.severity)}</Badge>
                          {error.resolved && (
                            <Badge variant="outline" className="text-green-600">
                              Vyriešené
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="font-medium">{error.message}</div>

                      {error.context && Object.keys(error.context).length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Kontext:</strong> {error.context.component && `Komponent: ${error.context.component}`}
                          {error.context.userId && `, Používateľ: ${error.context.userId}`}
                          {error.context.action && `, Akcia: ${error.context.action}`}
                        </div>
                      )}

                      {!error.resolved && (
                        <div className="pt-2">
                          <Button size="sm" variant="outline" onClick={() => resolveError(error.id)}>
                            Označiť ako vyriešené
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Výkonové metriky</CardTitle>
              <CardDescription>Štatistiky výkonu aplikácie za posledných 24 hodín</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceStats?.byOperation?.length > 0 ? (
                <div className="space-y-4">
                  {performanceStats.byOperation.map((metric: any) => (
                    <div key={metric.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{metric.name}</h4>
                        <Badge variant="outline">{metric.count} volaní</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Priemer</div>
                          <div className="font-medium">{Math.round(metric.avg)}ms</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Minimum</div>
                          <div className="font-medium">{Math.round(metric.min)}ms</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">P95</div>
                          <div className="font-medium">{Math.round(metric.p95)}ms</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Maximum</div>
                          <div className="font-medium">{Math.round(metric.max)}ms</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Žiadne výkonové metriky nie sú k dispozícii</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stav systému</CardTitle>
              <CardDescription>Aktuálny stav jednotlivých služieb</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Monitoring stavu systému bude implementovaný v ďalšej verzii. Momentálne sú dostupné len chyby a
                    výkonové metriky.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
