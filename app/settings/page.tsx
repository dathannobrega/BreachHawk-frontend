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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, Bell, Upload, Shield, History } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function UserSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const { t, language, setLanguage } = useLanguage()
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
  }, [isAuthenticated, loading])

  useEffect(() => {
    if (user) {
      setProfileSettings({
        email: user.email,
        profileImage: user.profileImage || "",
        organization: user.organization || "",
        contact: user.contact || "",
        preferredLanguage: language,
      })
      setNotificationSettings((prev) => ({
        ...prev,
        isSubscribed: user.isSubscribed ?? true,
      }))
    }
  }, [user, language])

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
          preferred_language: profileSettings.preferredLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error(t.settings.profile.profileError)
      }

      // Update language if changed
      if (profileSettings.preferredLanguage !== language) {
        setLanguage(profileSettings.preferredLanguage as "pt" | "en")
      }

      setMessage(t.settings.profile.profileUpdated)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(t.settings.profile.profileError)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setMessage(t.settings.password.passwordsNotMatch)
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
        throw new Error(error.detail || t.settings.password.passwordError)
      }

      setMessage(t.settings.password.passwordChanged)
      setPasswordSettings({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || t.settings.password.passwordError)
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.settings.title}</h1>
          <p className="text-gray-600 mt-2">{t.settings.subtitle}</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t.sidebar.profile}
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t.sidebar.notifications}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t.sidebar.security}
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.profile.title}</CardTitle>
                <CardDescription>{t.settings.profile.subtitle}</CardDescription>
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
                        {t.settings.profile.changePhoto}
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">{t.settings.profile.photoFormat}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.settings.profile.email}</Label>
                      <Input id="email" type="email" value={profileSettings.email} disabled className="bg-gray-50" />
                      <p className="text-sm text-gray-500">{t.settings.profile.emailDisabled}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">{t.settings.profile.organization}</Label>
                      <Input
                        id="organization"
                        value={profileSettings.organization}
                        onChange={(e) => setProfileSettings({ ...profileSettings, organization: e.target.value })}
                        placeholder={t.settings.profile.organizationPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">{t.settings.profile.contact}</Label>
                    <Input
                      id="contact"
                      value={profileSettings.contact}
                      onChange={(e) => setProfileSettings({ ...profileSettings, contact: e.target.value })}
                      placeholder={t.settings.profile.contactPlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">{t.settings.profile.language}</Label>
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
                    <p className="text-sm text-gray-500">{t.settings.profile.languageSubtitle}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subscribed"
                      checked={notificationSettings.isSubscribed}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, isSubscribed: checked })
                      }
                    />
                    <Label htmlFor="subscribed">{t.settings.profile.subscribed}</Label>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? t.settings.profile.saving : t.settings.profile.saveChanges}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Settings */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.password.title}</CardTitle>
                <CardDescription>{t.settings.password.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">{t.settings.password.currentPassword}</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={passwordSettings.oldPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, oldPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t.settings.password.newPassword}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordSettings.newPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t.settings.password.confirmPassword}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordSettings.confirmPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? t.settings.password.changing : t.settings.password.changePassword}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.notifications.title}</CardTitle>
                <CardDescription>{t.settings.notifications.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t.settings.notifications.emailAlerts}</Label>
                      <p className="text-sm text-gray-500">{t.settings.notifications.emailAlertsDesc}</p>
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
                      <Label>{t.settings.notifications.smsAlerts}</Label>
                      <p className="text-sm text-gray-500">{t.settings.notifications.smsAlertsDesc}</p>
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
                      <Label>{t.settings.notifications.weeklyReport}</Label>
                      <p className="text-sm text-gray-500">{t.settings.notifications.weeklyReportDesc}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleProfileSubmit} disabled={saving}>
                    {saving ? t.settings.profile.saving : t.settings.notifications.savePreferences}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.security.title}</CardTitle>
                <CardDescription>{t.settings.security.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t.settings.security.twoFactor}</Label>
                      <p className="text-sm text-gray-500">{t.settings.security.twoFactorDesc}</p>
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
                      <Label className="text-base">{t.settings.security.sessions}</Label>
                      <p className="text-sm text-gray-500 mb-3">{t.settings.security.sessionsDesc}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Sessão Atual</p>
                            <p className="text-sm text-gray-500">Chrome • São Paulo, Brasil</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Ativa
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">{t.settings.security.loginHistory}</Label>
                      <p className="text-sm text-gray-500 mb-3">{t.settings.security.loginHistoryDesc}</p>
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
