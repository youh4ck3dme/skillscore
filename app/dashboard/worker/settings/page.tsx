import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { I18nProvider } from "@/lib/i18n/context"
import { SettingsPageClient } from "@/components/settings-page-client"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .single()

  // OAuth users have app_metadata.provider set to 'google', 'github', etc.
  // Email/password users have app_metadata.provider set to 'email'
  const hasPassword = user.app_metadata?.provider === "email" || user.app_metadata?.providers?.includes("email")

  return (
    <I18nProvider>
      <SettingsPageClient
        user={{
          id: user.id,
          email: user.email || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          hasPassword,
        }}
      />
    </I18nProvider>
  )
}
