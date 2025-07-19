"use client"

import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserHeader } from "@/components/user-header"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: Array<{ label: string; href?: string }> = []

    if (pathSegments.length === 0) return []

    // Mapear rotas para breadcrumbs
    if (pathSegments[0] === "dashboard") {
      breadcrumbs.push({ label: "Dashboard" })
    } else if (pathSegments[0] === "admin") {
      breadcrumbs.push({ label: "Admin", href: "/admin/dashboard" })
      if (pathSegments[1] && pathSegments[1] !== "dashboard") {
        const pageLabels: Record<string, string> = {
          sites: "Sites",
          users: "Usuários",
          settings: "Configurações",
          monitoring: "Monitoramento",
        }
        breadcrumbs.push({
          label: pageLabels[pathSegments[1]] || pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1),
        })
      }
    } else if (pathSegments[0] === "platform") {
      breadcrumbs.push({ label: "Plataforma", href: "/platform/dashboard" })
      if (pathSegments[1] && pathSegments[1] !== "dashboard") {
        const pageLabels: Record<string, string> = {
          companies: "Empresas",
          users: "Usuários",
          sites: "Sites",
          billing: "Faturamento",
          settings: "Configurações",
        }
        breadcrumbs.push({
          label: pageLabels[pathSegments[1]] || pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1),
        })
      }
    } else if (pathSegments[0] === "settings") {
      breadcrumbs.push({ label: "Configurações" })
    } else if (pathSegments[0] === "search") {
      breadcrumbs.push({ label: "Pesquisar" })
    } else if (pathSegments[0] === "leaks") {
      breadcrumbs.push({ label: "Vazamentos" })
    } else {
      const pageLabels: Record<string, string> = {
        search: "Pesquisar",
        leaks: "Vazamentos",
        settings: "Configurações",
      }
      breadcrumbs.push({
        label: pageLabels[pathSegments[0]] || pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1),
      })
    }

    return breadcrumbs
  }

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
      <SidebarNav onCollapseChange={setSidebarCollapsed} />

      {/* Main Content Area - Ajusta dinamicamente baseado no estado da sidebar */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <UserHeader breadcrumbs={getBreadcrumbs()} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BreachHawk. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}
