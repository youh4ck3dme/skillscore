import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ✅ toto MUSÍ byť verejné vždy (bez login redirectu)
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next()
  }

  // všetko ostatné rieši tvoj Supabase auth middleware
  return updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
