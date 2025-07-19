"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  BarChart3,
  Building2,
  CreditCard,
  Globe,
  Home,
  Search,
  Settings,
  Shield,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarNavProps {
  onItemClick?: () => void
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [adminOpen, setAdminOpen] = useState(pathname.startsWith("/admin"))
  const [platformOpen, setPlatformOpen] = useState(pathname.startsWith("/platform"))

  const isAdmin = user?.role === "admin"
  const isPlatformAdmin = user?.role === "platform_admin"
  const isAdminOrPlatform = isAdmin || isPlatformAdmin

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      show: true,
    },
    {
      name: "Pesquisar Vazamentos",
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
      href: "/settings",
      icon: Settings,
      show: true,
    },
  ]

  const adminNavigation = [
    {
      name: "Dashboard Admin",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      name: "Sites",
      href: "/admin/sites",
      icon: Globe,
    },
    {
      name: "Monitoramento",
      href: "/admin/monitoring",
      icon: Eye,
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const platformNavigation = [
    {
      name: "Dashboard",
      href: "/platform/dashboard",
      icon: BarChart3,
    },
    {
      name: "Usuários",
      href: "/platform/users",
      icon: Users,
    },
    {
      name: "Empresas",
      href: "/platform/companies",
      icon: Building2,
    },
    {
      name: "Sites",
      href: "/platform/sites",
      icon: Globe,
    },
    {
      name: "Contas Telegram",
      href: "/platform/telegram-accounts",
      icon: Shield,
    },
    {
      name: "Planos",
      href: "/platform/plans",
      icon: CreditCard,
    },
    {
      name: "Faturamento",
      href: "/platform/billing",
      icon: CreditCard,
    },
    {
      name: "Configurações",
      href: "/platform/settings",
      icon: Settings,
    },
  ]

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        pathname === item.href
          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <item.icon
        className={cn(
          "mr-3 h-5 w-5 flex-shrink-0",
          pathname === item.href ? "text-blue-700" : "text-slate-400 group-hover:text-slate-500",
        )}
      />
      {item.name}
    </Link>
  )

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {/* Main Navigation */}
      {navigation
        .filter((item) => item.show)
        .map((item) => (
          <NavItem key={item.name} item={item} onClick={onItemClick} />
        ))}

      {/* Admin Section */}
      {isAdmin && (
        <div className="pt-4">
          <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center">
                  <Shield className="mr-3 h-5 w-5 text-slate-400" />
                  Administração
                </div>
                {adminOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              {adminNavigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={onItemClick} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* Platform Admin Section */}
      {isPlatformAdmin && (
        <div className="pt-4">
          <Collapsible open={platformOpen} onOpenChange={setPlatformOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center">
                  <Building2 className="mr-3 h-5 w-5 text-slate-400" />
                  Plataforma
                </div>
                {platformOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              {platformNavigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={onItemClick} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </nav>
  )
}
