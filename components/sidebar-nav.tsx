"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Search, Shield, Users, Settings, Building, Globe, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function SidebarNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getNavItems = () => {
    const baseItems = [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ["user", "admin", "platform_admin"],
      },
    ]

    if (user.role === "user") {
      return [
        ...baseItems,
        {
          label: "Pesquisar",
          icon: Search,
          href: "/search",
          roles: ["user"],
        },
        {
          label: "Vazamentos",
          icon: Shield,
          href: "/leaks",
          roles: ["user"],
        },
        {
          label: "Configurações",
          icon: Settings,
          href: "/settings",
          roles: ["user"],
        },
      ]
    }

    if (user.role === "admin") {
      return [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin/dashboard",
          roles: ["admin"],
        },
        {
          label: "Usuários",
          icon: Users,
          href: "/admin/users",
          roles: ["admin"],
        },
        {
          label: "Domínios",
          icon: Globe,
          href: "/admin/domains",
          roles: ["admin"],
        },
        {
          label: "Configurações",
          icon: Settings,
          href: "/admin/settings",
          roles: ["admin"],
        },
      ]
    }

    if (user.role === "platform_admin") {
      return [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/platform/dashboard",
          roles: ["platform_admin"],
        },
        {
          label: "Empresas",
          icon: Building,
          href: "/platform/companies",
          roles: ["platform_admin"],
        },
        {
          label: "Usuários",
          icon: Users,
          href: "/platform/users",
          roles: ["platform_admin"],
        },
        {
          label: "Financeiro",
          icon: Settings,
          href: "/platform/billing",
          roles: ["platform_admin"],
        },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold">BreachHawk</h2>
            {user.company && <p className="text-xs text-gray-500">{user.company.name}</p>}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {(user.firstName?.[0] || user.username[0]).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{user.firstName || user.username}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {user.role === "platform_admin" ? "Platform Admin" : user.role === "admin" ? "Admin" : "Usuário"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-red-600" onClick={logout}>
          <LogOut className="h-4 w-4 mr-3" />
          Sair
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
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <NavContent />
          </div>
        </div>
      )}
    </>
  )
}
