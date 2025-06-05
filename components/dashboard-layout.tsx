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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <div className="fixed inset-y-0 left-0 z-40 w-64">
        <SidebarNav />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header - Fixed at top */}
        <UserHeader />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>

        {/* Footer */}
        <UserFooter />
      </div>
    </div>
  )
}
