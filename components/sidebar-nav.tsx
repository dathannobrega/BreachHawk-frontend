"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles?: string[]
}

const baseNavigation: NavItem[] = [
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
    badge: "3",
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
    icon: Package,
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
  onItemClick?: () => void
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [adminExpanded, setAdminExpanded] = useState(pathname.startsWith("/admin"))
  const [platformExpanded, setPlatformExpanded] = useState(pathname.startsWith("/platform"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.role === "admin"
  const isPlatformAdmin = user?.role === "platform_admin"

  const getUserDisplayName = () => {
    if (!user) return "Usuário"
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    if (user.first_name) return user.first_name
    if (user.username) return user.username
    return user.email
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.first_name && user.last_name) return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    if (user.first_name) return user.first_name[0].toUpperCase()
    if (user.username) return user.username[0].toUpperCase()
    return user.email[0].toUpperCase()
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

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

    return (
      <Link
        href={item.href}
        onClick={() => {
          onItemClick?.()
          setMobileOpen(false)
        }}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isActive
            ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-900">BreachHawk</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {/* Base Navigation */}
          {baseNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <div className="pt-4">
              <div className="pb-2">
                <button
                  onClick={() => setAdminExpanded(!adminExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <span>Administração</span>
                  </div>
                  {adminExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
              {adminExpanded && (
                <div className="space-y-1 pl-6">
                  {adminNavigation
                    .filter((item) => !item.roles || item.roles.includes("admin"))
                    .map((item) => (
                      <NavItem key={item.href} item={item} />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Platform Admin Section */}
          {isPlatformAdmin && (
            <div className="pt-4">
              <div className="pb-2">
                <button
                  onClick={() => setPlatformExpanded(!platformExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5" />
                    <span>Plataforma</span>
                  </div>
                  {platformExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
              {platformExpanded && (
                <div className="space-y-1 pl-6">
                  {platformNavigation.map((item) => (
                    <NavItem key={item.href} item={item} />
                  ))}
                </div>
              )}
              {/* Admin items for platform admin */}
              {adminExpanded && (
                <div className="space-y-1 pl-6 pt-2">
                  {adminNavigation
                    .filter((item) => !item.roles || item.roles.includes("platform_admin"))
                    .map((item) => (
                      <NavItem key={item.href} item={item} />
                    ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profile_image || "/placeholder.svg"} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{getUserInitials()}</AvatarFallback>
          </Avatar>
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
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md border border-slate-200"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
