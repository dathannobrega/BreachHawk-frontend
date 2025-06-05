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
      {/* Sidebar - Fixed */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header - Fixed at top */}
        <UserHeader />

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <UserFooter />
      </div>
    </div>
  )
}
