/**
 * Supabase Error Handler - Wraps Supabase calls to suppress AbortErrors
 *
 * AbortError occurs when:
 * - Component unmounts during pending auth/data requests
 * - Browser cancels request during navigation
 *
 * These are expected and should not be shown to users.
 */

export function isAbortError(error: any): boolean {
  return (
    error?.name === "AbortError" ||
    error?.message?.includes("aborted") ||
    error?.message?.includes("AbortError") ||
    error?.code === 20 || // DOMException.ABORT_ERR
    error?.toString?.().includes("AbortError")
  )
}

/**
 * Wraps a Supabase promise to suppress AbortErrors
 * Other errors are passed through normally
 */
export async function suppressAbortError<T>(promise: Promise<T>, fallbackValue?: T): Promise<T | undefined> {
  try {
    return await promise
  } catch (error) {
    if (isAbortError(error)) {
      // AbortError is expected during unmount - suppress it
      return fallbackValue
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Wraps a Supabase function call to suppress AbortErrors
 */
export function withAbortSuppression<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | undefined> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (isAbortError(error)) {
        return undefined
      }
      throw error
    }
  }
}
