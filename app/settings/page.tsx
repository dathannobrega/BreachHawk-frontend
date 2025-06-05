"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Lock,
  Bell,
  Upload,
  Shield,
  Camera,
  Trash2,
  Monitor,
  Smartphone,
  Globe,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useAuthData } from "@/hooks/use-auth-data"
import { authService } from "@/services/auth-service"
import DashboardLayout from "@/components/dashboard-layout"

export default function UserSettings() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { loginHistory, sessions, loading: dataLoading, error: dataError, refetch, deleteSession } = useAuthData()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
    organization: "",
    contact: "",
    company: "",
    jobTitle: "",
    preferredLanguage: language,
  })

  // Password settings
  const [passwordSettings, setPasswordSettings] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    isSubscribed: true,
    emailAlerts: true,
    smsAlerts: false,
    weeklyReport: true,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (user) {
      setProfileSettings({
        username: user.username || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        profileImage: user.profile_image || "",
        organization: user.organization || "",
        contact: user.contact || "",
        company: user.company || "",
        jobTitle: user.job_title || "",
        preferredLanguage: language,
      })
      setNotificationSettings((prev) => ({
        ...prev,
        isSubscribed: user.is_subscribed ?? true,
      }))
    }
  }, [user, language])

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setMessage("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("A imagem deve ter no máximo 5MB.")
      return
    }

    setUploading(true)
    try {
      // Usar o endpoint correto de upload
      const updatedUser = await authService.uploadProfileImage(file)

      // Atualizar o estado local
      setProfileSettings((prev) => ({
        ...prev,
        profileImage: updatedUser.profile_image,
      }))

      // Atualizar o usuário no contexto
      updateUser(updatedUser)

      setMessage("Imagem atualizada com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Erro no upload:", error)
      setMessage("Erro ao fazer upload da imagem.")
    } finally {
      setUploading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          username: profileSettings.username || null,
          first_name: profileSettings.firstName || null,
          last_name: profileSettings.lastName || null,
          organization: profileSettings.organization || null,
          contact: profileSettings.contact || null,
          company: profileSettings.company || null,
          job_title: profileSettings.jobTitle || null,
          is_subscribed: notificationSettings.isSubscribed,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar perfil")
      }

      const updatedUser = await response.json()
      updateUser(updatedUser)

      // Update language if changed
      if (profileSettings.preferredLanguage !== language) {
        setLanguage(profileSettings.preferredLanguage as "pt" | "en")
      }

      setMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          is_subscribed: notificationSettings.isSubscribed,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar notificações")
      }

      const updatedUser = await response.json()
      updateUser(updatedUser)

      setMessage("Preferências de notificação atualizadas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao atualizar notificações")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setMessage("As senhas não coincidem")
      return
    }

    if (passwordSettings.newPassword.length < 6) {
      setMessage("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          old_password: passwordSettings.oldPassword,
          new_password: passwordSettings.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao alterar senha")
      }

      setMessage("Senha alterada com sucesso!")
      setPasswordSettings({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao alterar senha")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSession = async (sessionId: number) => {
    const success = await deleteSession(sessionId)
    if (success) {
      setMessage("Sessão encerrada com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const getInitials = () => {
    if (profileSettings.firstName && profileSettings.lastName) {
      return `${profileSettings.firstName[0]}${profileSettings.lastName[0]}`.toUpperCase()
    }
    if (profileSettings.username) {
      return profileSettings.username.slice(0, 2).toUpperCase()
    }
    return profileSettings.email.slice(0, 2).toUpperCase()
  }

  const getProfileImageSrc = () => {
    if (!profileSettings.profileImage) return "/placeholder.svg?height=96&width=96"

    // Se for base64, usar diretamente
    if (profileSettings.profileImage.startsWith("data:")) {
      return profileSettings.profileImage
    }

    // Se for uma URL relativa do backend, construir URL completa
    if (profileSettings.profileImage.startsWith("/static/")) {
      return `${apiUrl}${profileSettings.profileImage}`
    }

    // Se for uma URL completa, usar diretamente
    return profileSettings.profileImage
  }

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return Monitor
    if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
      return Smartphone
    }
    return Monitor
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas preferências e configurações da conta</p>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${message.includes("sucesso") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <AlertDescription className={message.includes("sucesso") ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {dataError && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">{dataError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais e preferências</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={getProfileImageSrc() || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="bg-blue-500 text-white text-lg">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? "Enviando..." : "Alterar Foto"}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500">JPG, PNG ou GIF. Máximo 5MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={profileSettings.firstName}
                        onChange={(e) => setProfileSettings({ ...profileSettings, firstName: e.target.value })}
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        value={profileSettings.lastName}
                        onChange={(e) => setProfileSettings({ ...profileSettings, lastName: e.target.value })}
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input
                        id="username"
                        value={profileSettings.username}
                        onChange={(e) => setProfileSettings({ ...profileSettings, username: e.target.value })}
                        placeholder="Seu nome de usuário"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileSettings.email} disabled className="bg-gray-50" />
                      <p className="text-sm text-gray-500">O email não pode ser alterado</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={profileSettings.company}
                        onChange={(e) => setProfileSettings({ ...profileSettings, company: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Cargo</Label>
                      <Input
                        id="jobTitle"
                        value={profileSettings.jobTitle}
                        onChange={(e) => setProfileSettings({ ...profileSettings, jobTitle: e.target.value })}
                        placeholder="Seu cargo"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organização</Label>
                    <Input
                      id="organization"
                      value={profileSettings.organization}
                      onChange={(e) => setProfileSettings({ ...profileSettings, organization: e.target.value })}
                      placeholder="Nome da organização"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contato</Label>
                    <Input
                      id="contact"
                      value={profileSettings.contact}
                      onChange={(e) => setProfileSettings({ ...profileSettings, contact: e.target.value })}
                      placeholder="Telefone ou outro contato"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={profileSettings.preferredLanguage}
                      onValueChange={(value) => setProfileSettings({ ...profileSettings, preferredLanguage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full md:w-auto">
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Settings */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Senha Atual</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={passwordSettings.oldPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, oldPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordSettings.newPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                    <p className="text-sm text-gray-500">Mínimo de 6 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordSettings.confirmPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={saving} className="w-full md:w-auto">
                    {saving ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Configure como você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Receber Notificações por Email</Label>
                      <p className="text-sm text-gray-500">Receba alertas e atualizações por email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.isSubscribed}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, isSubscribed: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas por Email</Label>
                      <p className="text-sm text-gray-500">Receba alertas de segurança por email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas por SMS</Label>
                      <p className="text-sm text-gray-500">Receba alertas críticos por SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatório Semanal</Label>
                      <p className="text-sm text-gray-500">Receba um resumo semanal das atividades</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                      }
                    />
                  </div>

                  <Button type="submit" disabled={saving} className="w-full md:w-auto">
                    {saving ? "Salvando..." : "Salvar Preferências"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Two Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle>Autenticação de Dois Fatores</CardTitle>
                  <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sessões Ativas</CardTitle>
                      <CardDescription>Gerencie onde você está logado</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={refetch} disabled={dataLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? "animate-spin" : ""}`} />
                      Atualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session) => {
                        const { browser, os } = authService.parseUserAgent(session.user_agent)
                        const DeviceIcon = getDeviceIcon(session.user_agent)

                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <DeviceIcon className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">
                                  {browser} • {os}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <Globe className="h-3 w-3 inline mr-1" />
                                  {authService.getLocationDisplay(session.location)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Última atividade:{" "}
                                  {authService.formatTimeAgo(session.last_activity || session.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.is_active ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Ativa
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inativa
                                </Badge>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSession(session.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}

                      {sessions.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Nenhuma sessão ativa encontrada</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Login History */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Histórico de Login</CardTitle>
                      <CardDescription>Veja quando e onde você fez login</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={refetch} disabled={dataLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? "animate-spin" : ""}`} />
                      Atualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {loginHistory.slice(0, 10).map((login) => {
                        const { browser, os } = authService.parseUserAgent(login.user_agent)

                        return (
                          <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {login.success ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <div>
                                <p className="text-sm font-medium">
                                  {login.success ? "Login realizado" : "Tentativa de login falhada"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {browser} • {os} • {authService.getLocationDisplay(login.location)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{authService.formatDateTime(login.timestamp)}</p>
                              <p className="text-xs text-gray-400">{login.ip_address}</p>
                            </div>
                          </div>
                        )
                      })}

                      {loginHistory.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Nenhum histórico de login encontrado</p>
                      )}

                      {loginHistory.length > 10 && (
                        <div className="text-center pt-4">
                          <p className="text-sm text-gray-500">
                            Mostrando os 10 logins mais recentes de {loginHistory.length} total
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
