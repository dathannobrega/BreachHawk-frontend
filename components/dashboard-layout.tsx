"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserHeader } from "@/components/user-header"
import { UserFooter } from "@/components/user-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    if (segments.includes("admin")) {
      breadcrumbs.push({ label: "Admin", href: "/admin/dashboard" })
      if (segments.includes("monitoring")) {
        breadcrumbs.push({ label: "Monitoramento", href: "/admin/monitoring" })
      }
    } else if (segments.includes("platform")) {
      breadcrumbs.push({ label: "Plataforma", href: "/platform/dashboard" })
    } else {
      breadcrumbs.push({ label: "Dashboard", href: "/dashboard" })
    }

    return breadcrumbs
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <UserHeader />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-slate-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <SidebarNav />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40 bg-white shadow-md">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-blue-900">Menu</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarNav onItemClick={() => setSidebarOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-slate-200 px-4 py-3">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {getBreadcrumbs().map((breadcrumb, index) => (
                    <li key={breadcrumb.href} className="flex items-center">
                      {index > 0 && <span className="text-slate-400 mx-2">/</span>}
                      <a
                        href={breadcrumb.href}
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {breadcrumb.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Page Content */}
            <div className="flex-1">{children}</div>
          </main>

          <UserFooter />
        </div>
      </div>
    </div>
  )
}
