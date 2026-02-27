"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo } from "react"

export function Header() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      window.location.replace("/")
    }
  }

  const dashboardLink = useMemo(() => {
    if (!user?.user_type) return "/dashboard/worker"
    if (user.user_type === "admin") return "/dashboard/admin"
    return `/dashboard/${user.user_type}`
  }, [user?.user_type])

  const displayName = useMemo(() => {
    const p = user?.profile
    if (user?.user_type === "company") return p?.company_name || user?.email || "Firma"
    if (p?.first_name && p?.last_name) return `${p.first_name} ${p.last_name}`
    return user?.email || "Môj účet"
  }, [user])

  return (
    <header className="w-full bg-card/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-primary">
              Skill<span className="text-foreground">Score</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block text-sm font-medium max-w-[140px] truncate">
                      {displayName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Môj dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Odhlásiť sa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="h-9 text-sm">
                  <Link href="/auth/login">Prihlásiť sa</Link>
                </Button>
                <Button size="sm" asChild className="h-9 text-sm">
                  <Link href="/auth/register">Vytvoriť účet</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
