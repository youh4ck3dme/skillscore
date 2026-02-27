// Development helper functions

export function shouldBypassAuth(): boolean {
  // Always return false in production
  if (process.env.NODE_ENV === "production") {
    return false
  }

  // Check for dev mode environment variable
  return process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
}

export function getDevUser() {
  if (!shouldBypassAuth()) {
    return null
  }

  return {
    id: "dev-user-123",
    email: "dev@example.com",
    user_type: "candidate",
    display_name: "Dev User",
  }
}
