"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function UserHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase()
    }
    return user.email.slice(0, 2).toUpperCase()
  }

  const getDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username || user.email
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case "platform_admin":
        return "Platform Admin"
      case "admin":
        return "Admin"
      default:
        return "Usuário"
    }
  }

  const getProfileImageSrc = (size = 40) => {
    if (!user.profile_image) return `/placeholder.svg?height=${size}&width=${size}`

    // Se for base64, usar diretamente
    if (user.profile_image.startsWith("data:")) {
      return user.profile_image
    }

    // Se for uma URL relativa do backend, construir URL completa
    if (user.profile_image.startsWith("/static/")) {
      return `${apiUrl}${user.profile_image}`
    }

    // Se for uma URL completa, usar diretamente
    return user.profile_image
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
      <div className="px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Page Title Area */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{/* Título será definido por cada página */}</h1>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm" onClick={() => router.push("/search")}>
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pesquisar</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getProfileImageSrc(40) || "/placeholder.svg"} alt={getDisplayName()} />
                    <AvatarFallback className="bg-blue-500 text-white">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getProfileImageSrc(48) || "/placeholder.svg"} alt={getDisplayName()} />
                    <AvatarFallback className="bg-blue-500 text-white">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
