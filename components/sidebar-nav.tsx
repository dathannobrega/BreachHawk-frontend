"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Search,
  Shield,
  Users,
  Settings,
  Building,
  Globe,
  LogOut,
  Menu,
  X,
  FileText,
  Bell,
  CreditCard,
  Lock,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"

export default function SidebarNav() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Verificação de segurança para evitar erros
  if (!user) return null
  if (!t || !t.sidebar) {
    return (
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-white border-r shadow-sm">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-400">Carregando...</div>
        </div>
      </div>
    )
  }

  const getNavItems = () => {
    if (user.role === "user") {
      return [
        {
          label: t.sidebar.dashboard || "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          description: "Visão geral da sua conta",
        },
        {
          label: t.sidebar.search || "Pesquisar",
          icon: Search,
          href: "/search",
          description: "Pesquisar vazamentos",
        },
        {
          label: t.sidebar.leaks || "Vazamentos",
          icon: Shield,
          href: "/leaks",
          description: "Vazamentos detectados",
          badge: "3", // Exemplo de badge
        },
        {
          label: t.sidebar.reports || "Relatórios",
          icon: FileText,
          href: "/reports",
          description: "Relatórios detalhados",
        },
        {
          label: t.sidebar.alerts || "Alertas",
          icon: Bell,
          href: "/alerts",
          description: "Configurar alertas",
        },
      ]
    }

    if (user.role === "admin") {
      return [
        {
          label: t.sidebar.dashboard || "Dashboard",
          icon: LayoutDashboard,
          href: "/admin/dashboard",
          description: "Painel administrativo",
        },
        {
          label: t.sidebar.users || "Usuários",
          icon: Users,
          href: "/admin/users",
          description: "Gerenciar usuários",
        },
        {
          label: t.sidebar.domains || "Domínios",
          icon: Globe,
          href: "/admin/domains",
          description: "Domínios monitorados",
        },
        {
          label: t.sidebar.security || "Segurança",
          icon: Lock,
          href: "/admin/security",
          description: "Configurações de segurança",
        },
      ]
    }

    if (user.role === "platform_admin") {
      return [
        {
          label: t.sidebar.dashboard || "Dashboard",
          icon: LayoutDashboard,
          href: "/platform/dashboard",
          description: "Painel da plataforma",
        },
        {
          label: t.sidebar.companies || "Empresas",
          icon: Building,
          href: "/platform/companies",
          description: "Gerenciar empresas",
        },
        {
          label: t.sidebar.users || "Usuários",
          icon: Users,
          href: "/platform/users",
          description: "Todos os usuários",
        },
        {
          label: t.sidebar.billing || "Financeiro",
          icon: CreditCard,
          href: "/platform/billing",
          description: "Faturamento e pagamentos",
        },
        {
          label: t.sidebar.sites || "Sites",
          icon: Globe,
          href: "/platform/sites",
          description: "Gerenciar sites de scraping",
        },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  const getSettingsPath = () => {
    if (user.role === "platform_admin") return "/platform/settings"
    if (user.role === "admin") return "/admin/settings"
    return "/settings"
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">BreachHawk</h2>
            {user.company && <p className="text-xs text-blue-100 truncate max-w-[150px]">{user.company.name}</p>}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-lg">
              {(user.first_name?.[0] || user.username[0]).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.first_name || user.username}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <Badge
              variant={user.role === "platform_admin" ? "default" : user.role === "admin" ? "secondary" : "outline"}
              className="text-xs mt-1"
            >
              {user.role === "platform_admin" ? "Platform Admin" : user.role === "admin" ? "Admin" : "Usuário"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.href} className="group">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    router.push(item.href)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : "text-gray-500"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Settings */}
        <div className="space-y-1">
          <Button
            variant={pathname === getSettingsPath() ? "default" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
              pathname === getSettingsPath() ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              router.push(getSettingsPath())
              setIsOpen(false)
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <Settings className={`h-5 w-5 ${pathname === getSettingsPath() ? "text-white" : "text-gray-500"}`} />
              <div className="flex-1 text-left">
                <span className="font-medium">{t.sidebar.settings || "Configurações"}</span>
                <p className={`text-xs mt-0.5 ${pathname === getSettingsPath() ? "text-blue-100" : "text-gray-500"}`}>
                  {user.role === "platform_admin" ? "Configurações da plataforma" : "Configurações da conta"}
                </p>
              </div>
            </div>
          </Button>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t bg-gray-50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          {t.sidebar.logout || "Sair"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-white border-r shadow-sm">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  )
}
