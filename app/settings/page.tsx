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
import { User, Lock, Bell, Upload, Shield, History, Camera } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function UserSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const { t, language, setLanguage } = useLanguage()
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
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user) {
      setProfileSettings({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
        organization: user.organization || "",
        contact: user.contact || "",
        company: user.company || "",
        jobTitle: user.jobTitle || "",
        preferredLanguage: language,
      })
      setNotificationSettings((prev) => ({
        ...prev,
        isSubscribed: user.isSubscribed ?? true,
      }))
    }
  }, [user, language])

  if (loading) {
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
      // Converter para base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        // Atualizar o perfil com a nova imagem
        const response = await fetch(`${apiUrl}/api/v1/users/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            profile_image: base64,
          }),
        })

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da imagem")
        }

        const updatedUser = await response.json()

        // Atualizar o estado local
        setProfileSettings((prev) => ({
          ...prev,
          profileImage: base64,
        }))

        // Atualizar o usuário no localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setMessage("Imagem atualizada com sucesso!")
        setTimeout(() => setMessage(""), 3000)
      }
      reader.readAsDataURL(file)
    } catch (error) {
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
      localStorage.setItem("user", JSON.stringify(updatedUser))

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

  const getInitials = () => {
    if (profileSettings.firstName && profileSettings.lastName) {
      return `${profileSettings.firstName[0]}${profileSettings.lastName[0]}`.toUpperCase()
    }
    if (profileSettings.username) {
      return profileSettings.username.slice(0, 2).toUpperCase()
    }
    return profileSettings.email.slice(0, 2).toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
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
                        <AvatarImage
                          src={profileSettings.profileImage || "/placeholder.svg?height=96&width=96"}
                          alt="Profile"
                        />
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subscribed"
                      checked={notificationSettings.isSubscribed}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, isSubscribed: checked })
                      }
                    />
                    <Label htmlFor="subscribed">Receber notificações por email</Label>
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
                <div className="space-y-6">
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

                  <Button onClick={handleProfileSubmit} disabled={saving} className="w-full md:w-auto">
                    {saving ? "Salvando..." : "Salvar Preferências"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>Gerencie a segurança da sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Sessões Ativas</Label>
                      <p className="text-sm text-gray-500 mb-3">Gerencie onde você está logado</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Sessão Atual</p>
                            <p className="text-sm text-gray-500">Chrome • São Paulo, Brasil</p>
                          </div>
                          <Badge variant="secondary">Ativa</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">Histórico de Login</Label>
                      <p className="text-sm text-gray-500 mb-3">Veja quando e onde você fez login</p>
                      <Button variant="outline" className="w-full">
                        <History className="h-4 w-4 mr-2" />
                        Ver Histórico Completo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
