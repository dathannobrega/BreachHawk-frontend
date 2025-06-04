"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import UserHeader from "@/components/user-header"
import UserFooter from "@/components/user-footer"
import SidebarNav from "@/components/sidebar-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <UserHeader />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <UserFooter />
      </div>
    </div>
  )
}
