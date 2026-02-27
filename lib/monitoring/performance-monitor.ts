"use client"

import React from "react"

// Performance monitoring utilities
interface PerformanceMetric {
  name: string
  value: number
  timestamp: Date
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Record a performance metric
  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      metadata,
    }

    this.metrics.unshift(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(0, this.maxMetrics)
    }

    // Log slow operations
    if (this.isSlowOperation(name, value)) {
      console.warn(`[PERFORMANCE] Slow operation detected: ${name} took ${value}ms`, metadata)
    }
  }

  // Time a function execution
  async timeFunction<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration, metadata)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(name, duration, { ...metadata, error: true })
      throw error
    }
  }

  // Get performance statistics
  getStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const recentMetrics = this.metrics.filter((m) => m.timestamp >= last24h)

    const metricsByName = recentMetrics.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = []
        }
        acc[metric.name].push(metric.value)
        return acc
      },
      {} as Record<string, number[]>,
    )

    const stats = Object.entries(metricsByName).map(([name, values]) => ({
      name,
      count: values.length,
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      p95: this.percentile(values, 95),
      p99: this.percentile(values, 99),
    }))

    return {
      totalMetrics: this.metrics.length,
      last24h: recentMetrics.length,
      byOperation: stats,
    }
  }

  private isSlowOperation(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      api_request: 2000,
      database_query: 1000,
      test_execution: 5000,
      file_upload: 3000,
      email_send: 2000,
      default: 1500,
    }

    const threshold = thresholds[name] || thresholds.default
    return value > threshold
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index] || 0
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()

// Convenience functions
export function recordMetric(name: string, value: number, metadata?: Record<string, any>) {
  performanceMonitor.recordMetric(name, value, metadata)
}

export function timeFunction<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) {
  return performanceMonitor.timeFunction(name, fn, metadata)
}

// React hook for timing component renders
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      recordMetric(`component_render_${componentName}`, duration)
    }
  }, [componentName])
}
