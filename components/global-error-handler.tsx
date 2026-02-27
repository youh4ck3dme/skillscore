"use client"

import { useEffect } from "react"

if (typeof window !== "undefined") {
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Ignore Supabase AbortError - these are expected when components unmount
    const reason = event.reason
    const isAbortError =
      reason?.name === "AbortError" ||
      reason?.constructor?.name === "AbortError" ||
      (typeof reason === "object" && reason !== null && "name" in reason && reason.name === "AbortError") ||
      (typeof reason?.message === "string" &&
        (reason.message.includes("aborted") ||
          reason.message.includes("signal is aborted") ||
          reason.message.includes("AbortError")))

    if (isAbortError) {
      console.log("[v0] Suppressed expected AbortError from Supabase auth cleanup")
      event.preventDefault() // Critical: prevent default error reporting
      return
    }

    // Log other unhandled rejections normally
    console.error("[v0] Unhandled promise rejection:", reason)
  }

  // Remove any existing handler first
  window.removeEventListener("unhandledrejection", handleUnhandledRejection)
  // Add handler immediately
  window.addEventListener("unhandledrejection", handleUnhandledRejection)
}

export function GlobalErrorHandler() {
  // Keep useEffect as backup to ensure handler persists
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const isAbortError =
        reason?.name === "AbortError" ||
        reason?.constructor?.name === "AbortError" ||
        (typeof reason === "object" && reason !== null && "name" in reason && reason.name === "AbortError") ||
        (typeof reason?.message === "string" &&
          (reason.message.includes("aborted") ||
            reason.message.includes("signal is aborted") ||
            reason.message.includes("AbortError")))

      if (isAbortError) {
        console.log("[v0] Suppressed expected AbortError from Supabase auth cleanup")
        event.preventDefault()
        return
      }

      console.error("[v0] Unhandled promise rejection:", reason)
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
