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
import { Mail, Shield, Send, TestTube, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { smtpService } from "@/services/smtp-service"
import type { SMTPConfigRead } from "@/types/smtp"

export default function PlatformSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("smtp")
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testEmail, setTestEmail] = useState("")

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
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "platform_admin") return null

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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Plataforma</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações essenciais do BreachHawk</p>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* SMTP Settings */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configurações SMTP
                </CardTitle>
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
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">SMTP Habilitado</Label>
                        <p className="text-sm text-gray-500">Ativar envio de emails via SMTP</p>
                      </div>
                      <Switch checked={smtpEnabled} onCheckedChange={(checked) => setSmtpEnabled(checked)} />
                    </div>

                    {smtpEnabled && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="smtpHost">Servidor SMTP</Label>
                            <Input
                              id="smtpHost"
                              value={smtpSettings.host}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                              placeholder="smtp.gmail.com"
                              className="h-11"
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
                              className="h-11"
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
                              className="h-11"
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
                              className="h-11"
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
                            className="h-11"
                          />
                        </div>

                        {/* Test Email Section */}
                        <div className="border-t pt-6">
                          <div className="mb-4">
                            <h4 className="text-lg font-medium">Teste de Email</h4>
                            <p className="text-sm text-gray-500">
                              Envie um email de teste para verificar as configurações
                            </p>
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
                                className="h-11"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleTestEmail}
                              disabled={testing || !testEmail}
                              className="h-11 flex items-center gap-2"
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
                      </div>
                    )}

                    <Button type="submit" disabled={saving} className="h-11 px-8">
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
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações de Segurança
                </CardTitle>
                <CardDescription>Configure as políticas de segurança da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSecuritySubmit} className="space-y-8">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Política de Senhas</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <Label>Requer Maiúsculas</Label>
                          <Switch
                            checked={securitySettings.passwordRequireUppercase}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <Label>Requer Minúsculas</Label>
                          <Switch
                            checked={securitySettings.passwordRequireLowercase}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireLowercase: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <Label>Requer Números</Label>
                          <Switch
                            checked={securitySettings.passwordRequireNumbers}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="h-11"
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
                          className="h-11"
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
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">2FA Obrigatório</Label>
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

                  <Button type="submit" disabled={saving} className="h-11 px-8">
                    {saving ? "Salvando..." : "Salvar Configurações de Segurança"}
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
