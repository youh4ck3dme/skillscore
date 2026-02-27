"use client"

import type React from "react"

import { Header } from "@/components/header"
import { DevUserSwitcher } from "@/components/dev-user-switcher"

interface DashboardLayoutProps {
  children: React.ReactNode
  requireVerification?: boolean
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 text-left text-sm px-4 sm:px-6 lg:px-8">{children}</main>
      <DevUserSwitcher />
    </div>
  )
}
