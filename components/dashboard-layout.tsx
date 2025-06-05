"use client"

import type React from "react"

import SidebarNav from "@/components/sidebar-nav"
import UserHeader from "@/components/user-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarNav />
      </aside>

      {/* Page Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <UserHeader />

        {/* Main Content */}
        <main className="py-6 px-6">
          <div className="min-h-[calc(100vh - 160px)]">{children}</div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BreachHawk. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
