"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {useAuth} from "@/contexts/auth-context"
import {useLanguage} from "@/contexts/language-context"
import {User, Settings, LogOut, Bell, Search, Globe, ChevronDown, Shield} from "lucide-react"
import {cn} from "@/lib/utils"

interface UserHeaderProps {
    breadcrumbs?: Array<{
        label: string
        href?: string
    }>
}
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function UserHeader({breadcrumbs = []}: UserHeaderProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const {user, logout} = useAuth()
    const {language, setLanguage} = useLanguage()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

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

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                {/* Left Section - Breadcrumbs */}
                <div className="flex items-center space-x-4 flex-1 lg:ml-0 ml-16">
                    {breadcrumbs.length > 0 && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard" className="flex items-center hover:text-blue-600">
                                        <Shield className="h-4 w-4"/>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center">
                                        <BreadcrumbSeparator/>
                                        <BreadcrumbItem>
                                            {crumb.href && index < breadcrumbs.length - 1 ? (
                                                <BreadcrumbLink href={crumb.href} className="hover:text-blue-600">
                                                    {crumb.label}
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage
                                                    className="text-slate-900 font-medium">{crumb.label}</BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                    </div>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                </div>

                {/* Center Section - Search */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                        <input
                            type="text"
                            placeholder="Pesquisar vazamentos, domínios..."
                            className={cn(
                                "w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                "placeholder:text-slate-400",
                                isSearchFocused && "shadow-lg",
                            )}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Right Section - Actions & User Menu */}
                <div className="flex items-center space-x-3">
                    {/* Language Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100">
                                <Globe className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Idioma</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => setLanguage("pt")}
                                className={language === "pt" ? "bg-blue-50 text-blue-900" : ""}
                            >
                                🇧🇷 Português
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setLanguage("en")}
                                className={language === "en" ? "bg-blue-50 text-blue-900" : ""}
                            >
                                🇺🇸 English
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative hover:bg-slate-100">
                        <Bell className="h-4 w-4"/>
                        <span
                            className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 px-2 space-x-2 hover:bg-slate-100">
                                <Avatar className="h-7 w-7">
                                    {user?.profile_image && user.profile_image.trim() !== '' ? (
                                        <AvatarImage
                                            src={
                                                user.profile_image.startsWith('http')
                                                    ? user.profile_image
                                                    : `${apiUrl}${user.profile_image}`
                                            }
                                            alt={getUserDisplayName()}
                                            className="object-cover"
                                            onError={(e) => {
                                                // Fallback para placeholder se a imagem falhar ao carregar
                                                e.currentTarget.src = "/placeholder.svg";
                                            }}
                                        />
                                    ) : (
                                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium text-slate-900">{getUserDisplayName()}</span>
                                    <Badge variant="secondary"
                                           className={cn("text-xs", getRoleColor(user?.role || "user"))}>
                                        {getRoleLabel(user?.role || "user")}
                                    </Badge>
                                </div>
                                <ChevronDown className="h-3 w-3 text-slate-500"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                    {user?.company && <p className="text-xs text-slate-500">{user.company}</p>}
                                    <Badge variant="secondary"
                                           className={cn("text-xs w-fit", getRoleColor(user?.role || "user"))}>
                                        {getRoleLabel(user?.role || "user")}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex items-center">
                                    <User className="mr-2 h-4 w-4"/>
                                    Perfil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4"/>
                                    Configurações
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={handleLogout}
                                              className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4"/>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
