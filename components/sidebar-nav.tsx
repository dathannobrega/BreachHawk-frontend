"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Settings,
  Users,
  Building2,
  CreditCard,
  Globe,
  Shield,
  Eye,
  Database,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pesquisar",
    href: "/search",
    icon: Search,
  },
  {
    title: "Vazamentos",
    href: "/leaks",
    icon: AlertTriangle,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

const adminNavigation: NavItem[] = [
  {
    title: "Dashboard Admin",
    href: "/admin/dashboard",
    icon: Shield,
    roles: ["admin"],
  },
  {
    title: "Sites",
    href: "/admin/sites",
    icon: Globe,
    roles: ["admin"],
  },
  {
    title: "Monitoramento",
    href: "/admin/monitoring",
    icon: Eye,
    roles: ["admin", "platform_admin"],
  },
  {
    title: "Configurações Admin",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
]

const platformNavigation: NavItem[] = [
  {
    title: "Dashboard Plataforma",
    href: "/platform/dashboard",
    icon: Database,
    roles: ["platform_admin"],
  },
  {
    title: "Usuários",
    href: "/platform/users",
    icon: Users,
    roles: ["platform_admin"],
  },
  {
    title: "Empresas",
    href: "/platform/companies",
    icon: Building2,
    roles: ["platform_admin"],
  },
  {
    title: "Sites",
    href: "/platform/sites",
    icon: Globe,
    roles: ["platform_admin"],
  },
  {
    title: "Contas Telegram",
    href: "/platform/telegram-accounts",
    icon: MessageSquare,
    roles: ["platform_admin"],
  },
  {
    title: "Planos",
    href: "/platform/plans",
    icon: CreditCard,
    roles: ["platform_admin"],
  },
  {
    title: "Faturamento",
    href: "/platform/billing",
    icon: CreditCard,
    roles: ["platform_admin"],
  },
  {
    title: "Configurações",
    href: "/platform/settings",
    icon: Settings,
    roles: ["platform_admin"],
  },
]

interface SidebarNavProps {
  onCollapseChange?: (collapsed: boolean) => void
}

export function SidebarNav({ onCollapseChange }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapseChange?.(newCollapsed)
  }

  const getFilteredNavigation = () => {
    const baseNav = [...navigation]

    if (user?.role === "admin") {
      baseNav.push(...adminNavigation.filter((item) => !item.roles || item.roles.includes("admin")))
    }

    if (user?.role === "platform_admin") {
      baseNav.push(...adminNavigation.filter((item) => !item.roles || item.roles.includes("platform_admin")))
      baseNav.push(...platformNavigation)
    }

    return baseNav
  }

  const NavItems = ({ items }: { items: NavItem[] }) => (
    <nav className="space-y-2">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-blue-100 text-blue-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              collapsed && "justify-center",
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        )
      })}
    </nav>
  )

  const filteredNavigation = getFilteredNavigation()

  return (
    <div
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300",
        collapsed ? "lg:w-16" : "lg:w-64",
      )}
    >
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
        <div className="flex items-center flex-shrink-0 px-4 py-6">
          <Link href="/dashboard" className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {!collapsed && <span className="ml-2 text-xl font-bold text-blue-900">BreachHawk</span>}
          </Link>
        </div>

        <ScrollArea className="flex-1 px-4">
          <NavItems items={filteredNavigation} />
        </ScrollArea>

        <div className="p-4 border-t border-slate-200">
          <Button variant="ghost" size="sm" onClick={handleToggleCollapse} className="w-full justify-center">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
