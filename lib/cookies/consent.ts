// Cookie consent management utility
// Handles storing and retrieving user cookie preferences in compliance with GDPR

export type CookieConsent = {
  necessary: boolean // Always true, cannot be disabled
  functional: boolean // Session management, authentication
  analytics: boolean // Usage statistics
  marketing: boolean // Marketing and advertising
  timestamp: number
}

const CONSENT_STORAGE_KEY = "somviac_cookie_consent"
const CONSENT_VERSION = "1.0"

// Default consent - only necessary cookies
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
}

/**
 * Get current cookie consent from localStorage
 * Returns null if user hasn't given consent yet
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Validate structure
    if (
      typeof parsed.necessary === "boolean" &&
      typeof parsed.functional === "boolean" &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean" &&
      typeof parsed.timestamp === "number"
    ) {
      return parsed as CookieConsent
    }

    return null
  } catch (error) {
    console.error("[Cookie Consent] Error reading consent:", error)
    return null
  }
}

/**
 * Save cookie consent to localStorage
 */
export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return

  try {
    const toStore = {
      ...consent,
      necessary: true, // Always true
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    }

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(toStore))

    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent("cookieConsentChanged", { detail: toStore }))
  } catch (error) {
    console.error("[Cookie Consent] Error saving consent:", error)
  }
}

/**
 * Clear cookie consent (for testing or user request)
 */
export function clearCookieConsent(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent("cookieConsentChanged", { detail: null }))
  } catch (error) {
    console.error("[Cookie Consent] Error clearing consent:", error)
  }
}

/**
 * Check if user has given consent for specific cookie type
 */
export function hasConsent(type: keyof CookieConsent): boolean {
  const consent = getCookieConsent()

  // If no consent given, only necessary cookies allowed
  if (!consent) {
    return type === "necessary"
  }

  return consent[type] === true
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  return getCookieConsent() === null
}
