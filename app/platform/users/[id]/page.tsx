"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Calendar,
  Shield,
  Monitor,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Crown,
  UserCheck,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { platformUserService } from "@/services/platform-user-service"
import type { PlatformUser, LoginHistoryRead, UserSessionRead } from "@/types/platform-user"

export default function UserDetailsPage() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = Number.parseInt(params.id as string)

  const [user, setUser] = useState<PlatformUser | null>(null)
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRead[]>([])
  const [sessions, setSessions] = useState<UserSessionRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, currentUser])

  useEffect(() => {
    if (userId && currentUser?.role === "platform_admin") {
      loadUserData()
    }
  }, [userId, currentUser])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError("")

      const [userData, historyData, sessionsData] = await Promise.all([
        platformUserService.getUser(userId),
        platformUserService.getUserLoginHistory(userId),
        platformUserService.getUserSessions(userId),
      ])

      setUser(userData)
      setLoginHistory(historyData)
      setSessions(sessionsData)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao carregar dados do usuário")
    } finally {
      setLoading(false)
    }
  }

  const getUserDisplayName = (user: PlatformUser) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user.first_name) return user.first_name
    if (user.username) return user.username
    return user.email
  }

  const getUserInitials = (user: PlatformUser) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user.first_name) return user.first_name[0].toUpperCase()
    if (user.username) return user.username[0].toUpperCase()
    return user.email[0].toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "platform_admin":
        return <Crown className="h-4 w-4 text-purple-500" />
      case "admin":
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case "user":
        return <Users className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getDeviceIcon = (device?: string | null) => {
    if (!device) return <Monitor className="h-4 w-4 text-gray-500" />
    if (device.includes("Mobile") || device.includes("Android") || device.includes("iOS")) {
      return <Smartphone className="h-4 w-4 text-blue-500" />
    }
    return <Monitor className="h-4 w-4 text-gray-500" />
  }

  const parseDevice = (device?: string | null) => {
    if (!device) return "Dispositivo desconhecido"

    const browser = device.includes("Chrome")
      ? "Chrome"
      : device.includes("Firefox")
        ? "Firefox"
        : device.includes("Safari")
          ? "Safari"
          : device.includes("Edge")
            ? "Edge"
            : "Navegador"

    const os = device.includes("Windows")
      ? "Windows"
      : device.includes("macOS")
        ? "macOS"
        : device.includes("Linux")
          ? "Linux"
          : device.includes("Android")
            ? "Android"
            : device.includes("iOS")
              ? "iOS"
              : "Sistema"

    return `${browser} em ${os}`
  }

  const isSessionExpired = (session: UserSessionRead) => {
    if (!session.expires_at) return false
    return new Date(session.expires_at) < new Date()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentUser || currentUser.role !== "platform_admin") return null

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Alert>
            <AlertDescription>Usuário não encontrado.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes do Usuário</h1>
              <p className="text-gray-600 mt-2">{getUserDisplayName(user)}</p>
            </div>
          </div>
          <Button variant="outline" onClick={loadUserData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Usuário */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar e Nome */}
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    {user.profile_image ? (
                      <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={getUserDisplayName(user)} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-medium">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900">{getUserDisplayName(user)}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>

                {/* Informações Básicas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">{getRoleIcon(user.role)}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Função</p>
                      <Badge variant="outline" className="mt-1">
                        {platformUserService.translateRole(user.role)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                        className="mt-1"
                      >
                        {platformUserService.translateStatus(user.status)}
                      </Badge>
                    </div>
                  </div>

                  {user.company && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Empresa</p>
                        <p className="text-sm text-gray-600">{user.company}</p>
                        {user.job_title && <p className="text-xs text-gray-500">{user.job_title}</p>}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Criado em</p>
                      <p className="text-sm text-gray-600">{platformUserService.formatDateTime(user.created_at)}</p>
                    </div>
                  </div>

                  {user.last_login && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Último Login</p>
                        <p className="text-sm text-gray-600">{platformUserService.formatDateTime(user.last_login)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico e Sessões */}
          <div className="lg:col-span-2 space-y-6">
            {/* Histórico de Logins */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Logins</CardTitle>
                <CardDescription>Últimas tentativas de login do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                {loginHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dispositivo</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginHistory.slice(0, 10).map((login) => (
                        <TableRow key={login.id}>
                          <TableCell className="font-medium">{formatDateTime(login.timestamp)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {login.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className={login.success ? "text-green-600" : "text-red-600"}>
                                {login.success ? "Sucesso" : "Falha"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(login.device)}
                              <span className="text-sm">{parseDevice(login.device)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{login.location || "Desconhecida"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{login.ip_address || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum histórico de login encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sessões Ativas */}
            <Card>
              <CardHeader>
                <CardTitle>Sessões</CardTitle>
                <CardDescription>Sessões ativas e expiradas do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dispositivo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criada em</TableHead>
                        <TableHead>Expira em</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(session.device)}
                              <span className="text-sm">{parseDevice(session.device)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isSessionExpired(session) ? "destructive" : "default"} className="text-xs">
                              {isSessionExpired(session) ? "Expirada" : "Ativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDateTime(session.created_at)}</TableCell>
                          <TableCell className="text-sm">
                            {session.expires_at ? formatDateTime(session.expires_at) : "Nunca"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{session.location || "Desconhecida"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{session.ip_address || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma sessão encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
