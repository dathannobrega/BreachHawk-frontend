"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pesquisar",
    href: "/search",
    icon: Search,
    roles: ["user", "admin"],
  },
  {
    title: "Vazamentos",
    href: "/leaks",
    icon: AlertTriangle,
    badge: "3",
    roles: ["user", "admin"],
  },
  // Admin específico
  {
    title: "Sites",
    href: "/admin/sites",
    icon: Globe,
    roles: ["admin"],
  },
  {
    title: "Usuários da Empresa",
    href: "/admin/users",
    icon: UserCheck,
    roles: ["admin"],
  },
  // Platform Admin específico
  {
    title: "Dashboard Plataforma",
    href: "/platform/dashboard",
    icon: BarChart3,
    roles: ["platform_admin"],
  },
  {
    title: "Todas as Empresas",
    href: "/platform/companies",
    icon: Building,
    roles: ["platform_admin"],
  },
  {
    title: "Todos os Usuários",
    href: "/platform/users",
    icon: Users,
    roles: ["platform_admin"],
  },
  {
    title: "Sites Globais",
    href: "/platform/sites",
    icon: Globe,
    roles: ["platform_admin"],
  },
  {
    title: "Faturamento",
    href: "/platform/billing",
    icon: CreditCard,
    roles: ["platform_admin"],
  },
  // Comum a todos
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

export function SidebarNav({ onCollapseChange }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Notify parent component when collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || "")
  })

  const getUserDisplayName = () => {
    if (!user) return "Usuário"
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user.first_name) return user.first_name
    if (user.username) return user.username
    return "Usuário"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user.first_name) return user.first_name[0].toUpperCase()
    if (user.username) return user.username[0].toUpperCase()
    return "U"
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

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
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

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Mobile close button */}
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
                  isCollapsed ? "h-6 w-6" : "h-5 w-5", // Ícones maiores quando colapsado
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
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {user?.profile_image ? (
                <AvatarImage
                  src={user.profile_image || "/placeholder.svg"}
                  alt={getUserDisplayName()}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{getUserInitials()}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <Badge variant="secondary" className={cn("text-xs mt-1", getRoleColor(user?.role || "user"))}>
                {getRoleLabel(user?.role || "user")}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-10 w-10">
              {" "}
              {/* Avatar maior quando colapsado */}
              {user?.profile_image ? (
                <AvatarImage
                  src={user.profile_image || "/placeholder.svg"}
                  alt={getUserDisplayName()}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{getUserInitials()}</AvatarFallback>
              )}
            </Avatar>
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

      {/* Mobile Overlay */}
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
