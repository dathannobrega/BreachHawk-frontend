"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SidebarNav } from "@/components/sidebar-nav"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="lg" />
          <p className="text-slate-700 font-medium">Carregando sua experiência...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
