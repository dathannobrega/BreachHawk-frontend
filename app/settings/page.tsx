"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Bell, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import UserHeader from "@/components/user-header"
import UserFooter from "@/components/user-footer"

export default function UserSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    email: user?.email || "",
    profileImage: user?.profileImage || "",
    organization: "",
    contact: "",
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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading])

  useEffect(() => {
    if (user) {
      setProfileSettings({
        email: user.email,
        profileImage: user.profileImage || "",
        organization: user.organization || "",
        contact: user.contact || "",
      })
      setNotificationSettings((prev) => ({
        ...prev,
        isSubscribed: user.isSubscribed ?? true,
      }))
    }
  }, [user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

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
          profile_image: profileSettings.profileImage,
          organization: profileSettings.organization,
          contact: profileSettings.contact,
          is_subscribed: notificationSettings.isSubscribed,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil")
      }

      setMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setMessage("As senhas não conferem")
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
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.username[0].toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e preferências</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileSettings.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Foto
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG até 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" value={profileSettings.email} disabled className="bg-gray-50" />
                      <p className="text-sm text-gray-500">O e-mail não pode ser alterado</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organização</Label>
                      <Input
                        id="organization"
                        value={profileSettings.organization}
                        onChange={(e) => setProfileSettings({ ...profileSettings, organization: e.target.value })}
                        placeholder="Nome da sua organização"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contato</Label>
                    <Input
                      id="contact"
                      value={profileSettings.contact}
                      onChange={(e) => setProfileSettings({ ...profileSettings, contact: e.target.value })}
                      placeholder="Telefone ou outro meio de contato"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subscribed"
                      checked={notificationSettings.isSubscribed}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, isSubscribed: checked })
                      }
                    />
                    <Label htmlFor="subscribed">Receber comunicações da plataforma</Label>
                  </div>

                  <Button type="submit" disabled={saving}>
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
                    />
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

                  <Button type="submit" disabled={saving}>
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
                      <Label>Alertas por E-mail</Label>
                      <p className="text-sm text-gray-500">Receba alertas quando novos vazamentos forem detectados</p>
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
                      <p className="text-sm text-gray-500">Receba alertas por SMS para vazamentos críticos</p>
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

                  <Button onClick={handleProfileSubmit} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Preferências"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UserFooter />
    </div>
  )
}
