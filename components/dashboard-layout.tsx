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
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Header - Fixed at top with proper z-index */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <UserHeader />
        </header>

        {/* Page Content - Scrollable with white background */}
        <main className="flex-1 bg-white">
          <div className="p-6">{children}</div>
        </main>

        {/* Footer */}
        <UserFooter />
      </div>
    </div>
  )
}
