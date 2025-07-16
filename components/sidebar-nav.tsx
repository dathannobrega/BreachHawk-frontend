"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Search,
  Shield,
  Users,
  Building,
  Settings,
  CreditCard,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Cog,
  Package,
  LogOut,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles?: string[]
}

interface SidebarNavProps {
  onCollapseChange?: (collapsed: boolean) => void
}

const navigationItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Pesquisar", href: "/search", icon: Search, roles: ["user", "admin"] },
  { title: "Vazamentos", href: "/leaks", icon: AlertTriangle, badge: "3", roles: ["user", "admin"] },
  { title: "Sites", href: "/admin/sites", icon: Globe, roles: ["admin"] },
  { title: "Usuários da Empresa", href: "/admin/users", icon: UserCheck, roles: ["admin"] },
  { title: "Dashboard Plataforma", href: "/platform/dashboard", icon: BarChart3, roles: ["platform_admin"] },
  { title: "Todas as Empresas", href: "/platform/companies", icon: Building, roles: ["platform_admin"] },
  { title: "Todos os Usuários", href: "/platform/users", icon: Users, roles: ["platform_admin"] },
  { title: "Sites Globais", href: "/platform/sites", icon: Globe, roles: ["platform_admin"] },
  { title: "Planos", href: "/platform/plans", icon: Package, roles: ["platform_admin"] },
  { title: "Faturamento", href: "/platform/billing", icon: CreditCard, roles: ["platform_admin"] },
  { title: "Configurações da Plataforma", href: "/platform/settings", icon: Cog, roles: ["platform_admin"] },
  { title: "Configurações", href: "/settings", icon: Settings },
]

export function SidebarNav({ onCollapseChange }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Notify parent when collapse changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  // Close mobile on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Filter by roles
  const filteredItems = navigationItems.filter((item) => !item.roles || item.roles.includes(user?.role || ""))

  const getUserDisplayName = () => {
    if (!user) return "Usuário"
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    if (user.first_name) return user.first_name
    if (user.username) return user.username
    return "Usuário"
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "platform_admin":
        return "Admin Plataforma"
      case "admin":
        return "Administrador"
      default:
        return "Usuário"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "platform_admin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  const NavContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-slate-200 p-4",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">BreachHawk</span>
          </div>
        )}

        {/* Collapse buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden h-8 w-8 p-0 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isActive
                  ? "bg-blue-100 text-blue-900 border border-blue-200"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                isCollapsed && "justify-center",
              )}
            >
              <item.icon
                className={cn(
                  "transition-all duration-200",
                  isCollapsed ? "h-6 w-6" : "h-5 w-5",
                  !isCollapsed && "mr-3",
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-red-100 text-red-800">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info Footer */}
      <div className="border-t border-slate-200 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <UserAvatar size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <Badge variant="secondary" className={cn("text-xs mt-1", getRoleColor(user?.role || "user"))}>
                  {getRoleLabel(user?.role || "user")}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <UserAvatar size="md" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 p-0 bg-white shadow-md border border-slate-200"
      >
        <Menu className="h-5 w-5" />
      </Button>
      {/* Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-200 transition-all duration-300 fixed inset-y-0 left-0 z-30",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 transform transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <NavContent />
      </aside>
    </>
  )
}
