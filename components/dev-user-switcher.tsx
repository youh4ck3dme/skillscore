"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { shouldBypassAuth } from "@/lib/auth/dev-helpers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DevUserSwitcher() {
  const { user, switchDevUser } = useAuth()

  if (!shouldBypassAuth()) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          >
            Dev: {user?.user_type || "loading"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => switchDevUser("admin")}>Switch to Admin</DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchDevUser("candidate")}>Switch to Candidate</DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchDevUser("company")}>Switch to Company</DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchDevUser("recruiter")}>Switch to Recruiter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
