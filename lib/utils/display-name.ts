export type UserType = "candidate" | "company" | "recruiter"

export function getDisplayName(profile: any, isOwn: boolean): string {
  if (!profile) {
    return "Neznámy používateľ"
  }

  if (isOwn) {
    return profile.first_name && profile.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile.company_name || profile.email || "Môj profil"
  }

  const userType = profile.user_type || "candidate"
  const anonymousId = profile.anonymous_id || "N/A"

  return `${userType === "candidate" ? "Kandidát" : userType === "company" ? "Firma" : "Recruiter"} #${anonymousId}`
}

export function generateAnonymousId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}
