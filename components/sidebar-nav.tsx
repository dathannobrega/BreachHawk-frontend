"use client"

import { LayoutDashboard, Settings, User, HelpCircle, LogOutIcon as Logout, Target } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/hooks/use-user"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useUser()

  const navigation = [
    {
      name: t?.sidebar?.dashboard || "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: pathname === "/",
    },
  ]

  const userNavigation = [
    {
      name: t?.sidebar?.dashboard || "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: pathname === "/",
    },
    {
      name: t?.sidebar?.resources || "Recursos Monitorados",
      href: "/resources",
      icon: Target,
      current: pathname === "/resources",
    },
  ]

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {isLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <>
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User Avatar"} />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" forceMount>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/help")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>{t("help")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/api/auth/signout")}>
                <Logout className="mr-2 h-4 w-4" />
                <span>{t("log_out")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        {userNavigation.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start rounded-md px-2.5 py-2 font-normal"
            onClick={() => router.push(item.href)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
