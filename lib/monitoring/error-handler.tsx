"use client"

import React from "react"

// Centralized error handling and monitoring system
export interface ErrorContext {
  userId?: string
  userRole?: string
  action?: string
  component?: string
  metadata?: Record<string, any>
}

export interface ErrorReport {
  id: string
  timestamp: Date
  message: string
  stack?: string
  context: ErrorContext
  severity: "low" | "medium" | "high" | "critical"
  resolved: boolean
}

class ErrorHandler {
  private static instance: ErrorHandler
  private errors: ErrorReport[] = []
  private maxErrors = 1000 // Keep last 1000 errors in memory

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Log error with context
  logError(error: Error | string, context: ErrorContext = {}, severity: ErrorReport["severity"] = "medium") {
    const errorReport: ErrorReport = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" ? error.stack : undefined,
      context,
      severity,
      resolved: false,
    }

    // Add to memory store
    this.errors.unshift(errorReport)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Console logging with structured format
    const logLevel = severity === "critical" ? "error" : severity === "high" ? "error" : "warn"
    console[logLevel](`[SOMVIAC-${severity.toUpperCase()}]`, {
      id: errorReport.id,
      message: errorReport.message,
      context: errorReport.context,
      timestamp: errorReport.timestamp.toISOString(),
      stack: errorReport.stack,
    })

    // Send to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoring(errorReport)
    }

    return errorReport.id
  }

  // Get recent errors
  getRecentErrors(limit = 50): ErrorReport[] {
    return this.errors.slice(0, limit)
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorReport["severity"]): ErrorReport[] {
    return this.errors.filter((error) => error.severity === severity)
  }

  // Mark error as resolved
  resolveError(errorId: string) {
    const error = this.errors.find((e) => e.id === errorId)
    if (error) {
      error.resolved = true
    }
  }

  // Get error statistics
  getErrorStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    const recent24h = this.errors.filter((e) => e.timestamp >= last24h)
    const recentHour = this.errors.filter((e) => e.timestamp >= lastHour)

    return {
      total: this.errors.length,
      last24h: recent24h.length,
      lastHour: recentHour.length,
      bySeverity: {
        critical: this.errors.filter((e) => e.severity === "critical").length,
        high: this.errors.filter((e) => e.severity === "high").length,
        medium: this.errors.filter((e) => e.severity === "medium").length,
        low: this.errors.filter((e) => e.severity === "low").length,
      },
      unresolved: this.errors.filter((e) => !e.resolved).length,
    }
  }

  private async sendToMonitoring(errorReport: ErrorReport) {
    try {
      // In a real implementation, this would send to services like:
      // - Sentry
      // - LogRocket
      // - DataDog
      // - Custom monitoring endpoint

      await fetch("/api/monitoring/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorReport),
      })
    } catch (monitoringError) {
      console.error("[MONITORING] Failed to send error report:", monitoringError)
    }
  }
}

// Convenience functions
export const errorHandler = ErrorHandler.getInstance()

export function logError(error: Error | string, context?: ErrorContext, severity?: ErrorReport["severity"]) {
  return errorHandler.logError(error, context, severity)
}

export function logCriticalError(error: Error | string, context?: ErrorContext) {
  return errorHandler.logError(error, context, "critical")
}

export function logWarning(error: Error | string, context?: ErrorContext) {
  return errorHandler.logError(error, context, "low")
}

// React Error Boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: Error; reset: () => void }>,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logCriticalError(error, {
      component: "ErrorBoundary",
      action: "componentDidCatch",
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-destructive text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Niečo sa pokazilo</h2>
        <p className="text-muted-foreground mb-6">Vyskytla sa neočakávaná chyba. Náš tím bol automaticky upozornený.</p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Skúsiť znovu
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Obnoviť stránku
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Technické detaily (len pre vývojárov)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-32">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

export const performanceMonitor = {
  mark: (name: string) => {
    if (typeof performance !== "undefined") {
      performance.mark(name)
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof performance !== "undefined") {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name)[0]
        if (measure) {
          console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`)
        }
      } catch (error) {
        console.warn("[Performance] Failed to measure:", error)
      }
    }
  },
  clearMarks: () => {
    if (typeof performance !== "undefined") {
      performance.clearMarks()
      performance.clearMeasures()
    }
  },
}
