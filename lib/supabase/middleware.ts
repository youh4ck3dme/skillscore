import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Public pages — no auth required
  const publicPageRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/callback",
    "/auth/verify",
    "/legal/gdpr",
    "/legal/terms",
    "/legal/agb",
    "/legal/cookies",
    "/sitemap.xml",
    "/robots.txt",
    "/info",
    "/kontakt",
  ]

  // Public API routes — explicitly whitelisted only
  // ⚠️ DO NOT add "/api/" here — that was the security bug
  const publicApiRoutes = [
    "/api/auth/callback",
    "/api/auth/confirm",
  ]

  const pathname = request.nextUrl.pathname

  // Static assets and internal Next.js paths — always public, skip auth
  const isStaticAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-touch-icon") ||
    pathname.startsWith("/logo") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".webmanifest") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"

  if (isStaticAsset) {
    return supabaseResponse
  }

  const isPublicPage =
    publicPageRoutes.includes(pathname) ||
    publicPageRoutes.some((route) => route !== "/" && pathname.startsWith(route + "/"))

  const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route))

  if (isPublicPage || isPublicApi) {
    return supabaseResponse
  }

  // All other routes (including /api/*) require authentication
  let user = null
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    user = sessionData.session?.user ?? null
  } catch (error) {
    console.error("Error getting session in middleware:", error)
  }

  if (!user) {
    // API routes: return 401 JSON (not redirect)
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Page routes: redirect to login
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
