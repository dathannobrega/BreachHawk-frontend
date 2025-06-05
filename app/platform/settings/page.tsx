"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Mail, Shield, Database, Bell, Palette, Send, TestTube, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { smtpService } from "@/services/smtp-service"
import type { SMTPConfigRead } from "@/types/smtp"

export default function PlatformSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testEmail, setTestEmail] = useState("")

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "BreachHawk",
    platformDescription: "Plataforma de threat intelligence para monitoramento da dark web",
    supportEmail: "suporte@breachhawk.com",
    maintenanceMode: false,
    registrationEnabled: true,
    maxCompanies: 1000,
    maxUsersPerCompany: 100,
  })

  // SMTP settings
  const [smtpSettings, setSmtpSettings] = useState<SMTPConfigRead>({
    host: "",
    port: 587,
    username: "",
    password: "",
    from_email: "",
  })
  const [loadingSmtp, setLoadingSmtp] = useState(false)
  const [smtpEnabled, setSmtpEnabled] = useState(true)

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    twoFactorRequired: false,
  })

  // Database settings
  const [databaseSettings, setDatabaseSettings] = useState({
    host: "localhost",
    port: 5432,
    database: "breachhawk",
    username: "postgres",
    maxConnections: 100,
    backupEnabled: true,
    backupFrequency: "daily" as "hourly" | "daily" | "weekly",
    retentionDays: 30,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true,
    slackIntegration: false,
    discordIntegration: false,
    webhookUrl: "",
    slackWebhook: "",
    discordWebhook: "",
  })

  // Branding settings
  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    logoUrl: "",
    faviconUrl: "",
    customCss: "",
    footerText: "© 2023 BreachHawk. Todos os direitos reservados.",
    showPoweredBy: true,
  })

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user, router])

  // Carregar configurações SMTP
  useEffect(() => {
    if (isAuthenticated && user?.role === "platform_admin" && activeTab === "smtp") {
      loadSmtpConfig()
    }
  }, [isAuthenticated, user, activeTab])

  const loadSmtpConfig = async () => {
    setLoadingSmtp(true)
    try {
      const config = await smtpService.getConfig()
      setSmtpSettings(config)
      setSmtpEnabled(true)
    } catch (error) {
      console.error("Erro ao carregar configurações SMTP:", error)
      setMessage("Erro ao carregar configurações SMTP")
    } finally {
      setLoadingSmtp(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "platform_admin") return null

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações gerais salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações gerais")
    } finally {
      setSaving(false)
    }
  }

  const handleSmtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await smtpService.updateConfig(smtpSettings)
      setMessage("Configurações SMTP salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(`Erro ao salvar configurações SMTP: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      setTestResult({
        success: false,
        message: "Por favor, informe um email válido para teste.",
      })
      return
    }

    setTesting(true)
    setTestResult(null)
    try {
      const result = await smtpService.testEmail(testEmail)

      if (result.success) {
        setTestResult({
          success: true,
          message: `Email de teste enviado com sucesso para ${testEmail}! Verifique a caixa de entrada.`,
        })
      } else {
        setTestResult({
          success: false,
          message: "Falha ao enviar email de teste. Verifique as configurações SMTP.",
        })
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Erro ao testar configurações SMTP: ${error.message}`,
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações de segurança salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações de segurança")
    } finally {
      setSaving(false)
    }
  }

  const handleDatabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações de banco de dados salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações de banco de dados")
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações de notificação salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações de notificação")
    } finally {
      setSaving(false)
    }
  }

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações de marca salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações de marca")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Plataforma</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações globais do BreachHawk</p>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Banco
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Marca
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configure as informações básicas da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="platformName">Nome da Plataforma</Label>
                      <Input
                        id="platformName"
                        value={generalSettings.platformName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                        placeholder="BreachHawk"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de Suporte</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                        placeholder="suporte@breachhawk.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platformDescription">Descrição da Plataforma</Label>
                    <Textarea
                      id="platformDescription"
                      value={generalSettings.platformDescription}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, platformDescription: e.target.value })}
                      placeholder="Descrição da plataforma..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxCompanies">Máximo de Empresas</Label>
                      <Input
                        id="maxCompanies"
                        type="number"
                        value={generalSettings.maxCompanies}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, maxCompanies: Number.parseInt(e.target.value) })
                        }
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxUsersPerCompany">Máximo de Usuários por Empresa</Label>
                      <Input
                        id="maxUsersPerCompany"
                        type="number"
                        value={generalSettings.maxUsersPerCompany}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            maxUsersPerCompany: Number.parseInt(e.target.value),
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo de Manutenção</Label>
                        <p className="text-sm text-gray-500">Ativar modo de manutenção da plataforma</p>
                      </div>
                      <Switch
                        checked={generalSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setGeneralSettings({ ...generalSettings, maintenanceMode: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Registro Habilitado</Label>
                        <p className="text-sm text-gray-500">Permitir novos registros na plataforma</p>
                      </div>
                      <Switch
                        checked={generalSettings.registrationEnabled}
                        onCheckedChange={(checked) =>
                          setGeneralSettings({ ...generalSettings, registrationEnabled: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Settings */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle>Configurações SMTP</CardTitle>
                <CardDescription>Configure o servidor de email para envio de notificações</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSmtp ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Carregando configurações...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSmtpSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMTP Habilitado</Label>
                        <p className="text-sm text-gray-500">Ativar envio de emails via SMTP</p>
                      </div>
                      <Switch checked={smtpEnabled} onCheckedChange={(checked) => setSmtpEnabled(checked)} />
                    </div>

                    {smtpEnabled && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="smtpHost">Servidor SMTP</Label>
                            <Input
                              id="smtpHost"
                              value={smtpSettings.host}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                              placeholder="smtp.gmail.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="smtpPort">Porta</Label>
                            <Input
                              id="smtpPort"
                              type="number"
                              value={smtpSettings.port}
                              onChange={(e) =>
                                setSmtpSettings({ ...smtpSettings, port: Number.parseInt(e.target.value) })
                              }
                              placeholder="587"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="smtpUsername">Usuário</Label>
                            <Input
                              id="smtpUsername"
                              value={smtpSettings.username}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                              placeholder="usuario@gmail.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="smtpPassword">Senha</Label>
                            <Input
                              id="smtpPassword"
                              type="password"
                              value={smtpSettings.password || ""}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fromEmail">Email do Remetente</Label>
                          <Input
                            id="fromEmail"
                            type="email"
                            value={smtpSettings.from_email}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, from_email: e.target.value })}
                            placeholder="noreply@breachhawk.com"
                          />
                        </div>

                        {/* Test Email Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium">Teste de Email</h4>
                              <p className="text-sm text-gray-500">
                                Envie um email de teste para verificar as configurações
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2 space-y-2">
                              <Label htmlFor="testEmail">Email para Teste</Label>
                              <Input
                                id="testEmail"
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="seu@email.com"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleTestEmail}
                              disabled={testing || !testEmail}
                              className="flex items-center gap-2"
                            >
                              {testing ? (
                                <>
                                  <TestTube className="h-4 w-4 animate-spin" />
                                  Testando...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  Enviar Teste
                                </>
                              )}
                            </Button>
                          </div>

                          {testResult && (
                            <Alert
                              className={`mt-4 ${
                                testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {testResult.success ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                                  {testResult.message}
                                </AlertDescription>
                              </div>
                            </Alert>
                          )}
                        </div>
                      </>
                    )}

                    <Button type="submit" disabled={saving}>
                      {saving ? "Salvando..." : "Salvar Configurações SMTP"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>Configure as políticas de segurança da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Política de Senhas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="passwordMinLength">Comprimento Mínimo</Label>
                        <Input
                          id="passwordMinLength"
                          type="number"
                          value={securitySettings.passwordMinLength}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              passwordMinLength: Number.parseInt(e.target.value),
                            })
                          }
                          min="6"
                          max="32"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Requer Maiúsculas</Label>
                          <Switch
                            checked={securitySettings.passwordRequireUppercase}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Requer Minúsculas</Label>
                          <Switch
                            checked={securitySettings.passwordRequireLowercase}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireLowercase: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Requer Números</Label>
                          <Switch
                            checked={securitySettings.passwordRequireNumbers}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Requer Símbolos</Label>
                          <Switch
                            checked={securitySettings.passwordRequireSymbols}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireSymbols: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">Sessões e Login</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Timeout de Sessão (horas)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              sessionTimeout: Number.parseInt(e.target.value),
                            })
                          }
                          min="1"
                          max="168"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              maxLoginAttempts: Number.parseInt(e.target.value),
                            })
                          }
                          min="3"
                          max="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lockoutDuration">Duração do Bloqueio (minutos)</Label>
                        <Input
                          id="lockoutDuration"
                          type="number"
                          value={securitySettings.lockoutDuration}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              lockoutDuration: Number.parseInt(e.target.value),
                            })
                          }
                          min="5"
                          max="1440"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>2FA Obrigatório</Label>
                          <p className="text-sm text-gray-500">Exigir autenticação de dois fatores</p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorRequired}
                          onCheckedChange={(checked) =>
                            setSecuritySettings({ ...securitySettings, twoFactorRequired: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações de Segurança"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Banco de Dados</CardTitle>
                <CardDescription>Configure as configurações de banco de dados e backup</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDatabaseSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Conexão do Banco</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="dbHost">Host</Label>
                        <Input
                          id="dbHost"
                          value={databaseSettings.host}
                          onChange={(e) => setDatabaseSettings({ ...databaseSettings, host: e.target.value })}
                          placeholder="localhost"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dbPort">Porta</Label>
                        <Input
                          id="dbPort"
                          type="number"
                          value={databaseSettings.port}
                          onChange={(e) =>
                            setDatabaseSettings({ ...databaseSettings, port: Number.parseInt(e.target.value) })
                          }
                          placeholder="5432"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dbDatabase">Banco de Dados</Label>
                        <Input
                          id="dbDatabase"
                          value={databaseSettings.database}
                          onChange={(e) => setDatabaseSettings({ ...databaseSettings, database: e.target.value })}
                          placeholder="breachhawk"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dbUsername">Usuário</Label>
                        <Input
                          id="dbUsername"
                          value={databaseSettings.username}
                          onChange={(e) => setDatabaseSettings({ ...databaseSettings, username: e.target.value })}
                          placeholder="postgres"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxConnections">Máximo de Conexões</Label>
                        <Input
                          id="maxConnections"
                          type="number"
                          value={databaseSettings.maxConnections}
                          onChange={(e) =>
                            setDatabaseSettings({
                              ...databaseSettings,
                              maxConnections: Number.parseInt(e.target.value),
                            })
                          }
                          min="10"
                          max="1000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">Configurações de Backup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Backup Automático</Label>
                          <p className="text-sm text-gray-500">Ativar backup automático do banco</p>
                        </div>
                        <Switch
                          checked={databaseSettings.backupEnabled}
                          onCheckedChange={(checked) =>
                            setDatabaseSettings({ ...databaseSettings, backupEnabled: checked })
                          }
                        />
                      </div>

                      {databaseSettings.backupEnabled && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                            <Select
                              value={databaseSettings.backupFrequency}
                              onValueChange={(value: any) =>
                                setDatabaseSettings({ ...databaseSettings, backupFrequency: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">A cada hora</SelectItem>
                                <SelectItem value="daily">Diário</SelectItem>
                                <SelectItem value="weekly">Semanal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="retentionDays">Retenção (dias)</Label>
                            <Input
                              id="retentionDays"
                              type="number"
                              value={databaseSettings.retentionDays}
                              onChange={(e) =>
                                setDatabaseSettings({
                                  ...databaseSettings,
                                  retentionDays: Number.parseInt(e.target.value),
                                })
                              }
                              min="1"
                              max="365"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações do Banco"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificação</CardTitle>
                <CardDescription>Configure os canais de notificação da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-gray-500">Enviar notificações via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por SMS</Label>
                        <p className="text-sm text-gray-500">Enviar notificações via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Webhooks</Label>
                        <p className="text-sm text-gray-500">Enviar notificações via webhook</p>
                      </div>
                      <Switch
                        checked={notificationSettings.webhookNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, webhookNotifications: checked })
                        }
                      />
                    </div>
                  </div>

                  {notificationSettings.webhookNotifications && (
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">URL do Webhook</Label>
                      <Input
                        id="webhookUrl"
                        value={notificationSettings.webhookUrl}
                        onChange={(e) =>
                          setNotificationSettings({ ...notificationSettings, webhookUrl: e.target.value })
                        }
                        placeholder="https://api.exemplo.com/webhook"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-medium mb-4">Integrações</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Integração Slack</Label>
                          <p className="text-sm text-gray-500">Enviar notificações para o Slack</p>
                        </div>
                        <Switch
                          checked={notificationSettings.slackIntegration}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, slackIntegration: checked })
                          }
                        />
                      </div>

                      {notificationSettings.slackIntegration && (
                        <div className="space-y-2">
                          <Label htmlFor="slackWebhook">Webhook do Slack</Label>
                          <Input
                            id="slackWebhook"
                            value={notificationSettings.slackWebhook}
                            onChange={(e) =>
                              setNotificationSettings({ ...notificationSettings, slackWebhook: e.target.value })
                            }
                            placeholder="https://hooks.slack.com/services/..."
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Integração Discord</Label>
                          <p className="text-sm text-gray-500">Enviar notificações para o Discord</p>
                        </div>
                        <Switch
                          checked={notificationSettings.discordIntegration}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, discordIntegration: checked })
                          }
                        />
                      </div>

                      {notificationSettings.discordIntegration && (
                        <div className="space-y-2">
                          <Label htmlFor="discordWebhook">Webhook do Discord</Label>
                          <Input
                            id="discordWebhook"
                            value={notificationSettings.discordWebhook}
                            onChange={(e) =>
                              setNotificationSettings({ ...notificationSettings, discordWebhook: e.target.value })
                            }
                            placeholder="https://discord.com/api/webhooks/..."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações de Notificação"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Marca</CardTitle>
                <CardDescription>Personalize a aparência da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBrandingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">URL do Logo</Label>
                      <Input
                        id="logoUrl"
                        value={brandingSettings.logoUrl}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, logoUrl: e.target.value })}
                        placeholder="https://exemplo.com/logo.png"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faviconUrl">URL do Favicon</Label>
                      <Input
                        id="faviconUrl"
                        value={brandingSettings.faviconUrl}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, faviconUrl: e.target.value })}
                        placeholder="https://exemplo.com/favicon.ico"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footerText">Texto do Rodapé</Label>
                    <Input
                      id="footerText"
                      value={brandingSettings.footerText}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, footerText: e.target.value })}
                      placeholder="© 2023 BreachHawk. Todos os direitos reservados."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customCss">CSS Personalizado</Label>
                    <Textarea
                      id="customCss"
                      value={brandingSettings.customCss}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, customCss: e.target.value })}
                      placeholder="/* Adicione seu CSS personalizado aqui */"
                      rows={6}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mostrar "Powered by BreachHawk"</Label>
                      <p className="text-sm text-gray-500">Exibir marca BreachHawk no rodapé</p>
                    </div>
                    <Switch
                      checked={brandingSettings.showPoweredBy}
                      onCheckedChange={(checked) =>
                        setBrandingSettings({ ...brandingSettings, showPoweredBy: checked })
                      }
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações de Marca"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
