"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Settings,
  Users,
  Building2,
  Globe,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
} from "lucide-react"

interface SidebarNavProps {
  onCollapseChange?: (collapsed: boolean) => void
}

export function SidebarNav({ onCollapseChange }: SidebarNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapseChange?.(newCollapsed)
  }

  const isAdmin = user?.role === "admin"
  const isPlatformAdmin = user?.role === "platform_admin"
  const isRegularUser = !isAdmin && !isPlatformAdmin

  const navigation = [
    // Navegação comum para todos os usuários
    {
      name: "Dashboard",
      href: isAdmin ? "/admin/dashboard" : isPlatformAdmin ? "/platform/dashboard" : "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Pesquisar",
      href: "/search",
      icon: Search,
      show: true,
    },
    {
      name: "Vazamentos",
      href: "/leaks",
      icon: AlertTriangle,
      show: true,
    },
    {
      name: "Configurações",
      href: isAdmin ? "/admin/settings" : isPlatformAdmin ? "/platform/settings" : "/settings",
      icon: Settings,
      show: true,
    },

    // Navegação específica para Admin
    {
      name: "Sites",
      href: "/admin/sites",
      icon: Globe,
      show: isAdmin,
    },
    {
      name: "Monitoramento",
      href: "/admin/monitoring",
      icon: Eye,
      show: isAdmin,
    },

    // Navegação específica para Platform Admin
    {
      name: "Empresas",
      href: "/platform/companies",
      icon: Building2,
      show: isPlatformAdmin,
    },
    {
      name: "Usuários",
      href: "/platform/users",
      icon: Users,
      show: isPlatformAdmin,
    },
    {
      name: "Sites",
      href: "/platform/sites",
      icon: Globe,
      show: isPlatformAdmin,
    },
    {
      name: "Telegram",
      href: "/platform/telegram-accounts",
      icon: MessageSquare,
      show: isPlatformAdmin,
    },
    {
      name: "Planos",
      href: "/platform/plans",
      icon: Shield,
      show: isPlatformAdmin,
    },
    {
      name: "Faturamento",
      href: "/platform/billing",
      icon: CreditCard,
      show: isPlatformAdmin,
    },
  ]

  const visibleNavigation = navigation.filter((item) => item.show)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">BreachHawk</span>
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={toggleCollapse} className="h-8 w-8 p-0 hover:bg-slate-100">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3",
                    collapsed && "px-2",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">
                {user?.role === "platform_admin" ? "Platform Admin" : user?.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
