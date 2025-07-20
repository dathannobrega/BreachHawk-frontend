"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, Send, TestTube, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import SettingsTemplate from "@/components/templates/settings-template"
import ConfigFormTemplate from "@/components/templates/config-form-template"
import { smtpService } from "@/services/smtp-service"
import { passwordPolicyService } from "@/services/password-policy-service"
import type { SMTPConfigRead } from "@/types/smtp"
import type { PasswordPolicyRead } from "@/types/password-policy"

export default function PlatformSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("smtp")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "warning">("success")

  // SMTP State
  const [smtpSettings, setSmtpSettings] = useState<SMTPConfigRead>({
    host: "",
    port: 587,
    username: "",
    password: "",
    from_email: "",
  })
  const [loadingSmtp, setLoadingSmtp] = useState(false)
  const [savingSmtp, setSavingSmtp] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testEmail, setTestEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Password Policy State
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicyRead>({
    min_length: 8,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_symbols: true,
  })
  const [loadingPolicy, setLoadingPolicy] = useState(false)
  const [savingPolicy, setSavingPolicy] = useState(false)

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user, router])

  // Load SMTP config
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin" && activeTab === "smtp") {
      loadSmtpConfig()
    }
  }, [isAuthenticated, user, activeTab])

  // Load Password Policy
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin" && activeTab === "security") {
      loadPasswordPolicy()
    }
  }, [isAuthenticated, user, activeTab])

  const showMessage = (msg: string, type: "success" | "error" | "warning" = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const loadSmtpConfig = async () => {
    setLoadingSmtp(true)
    try {
      const config = await smtpService.getConfig()
      setSmtpSettings(config)
    } catch (error: any) {
      console.error("Erro ao carregar configurações SMTP:", error)
      showMessage("Erro ao carregar configurações SMTP", "error")
    } finally {
      setLoadingSmtp(false)
    }
  }

  const loadPasswordPolicy = async () => {
    setLoadingPolicy(true)
    try {
      const policy = await passwordPolicyService.getPolicy()
      setPasswordPolicy(policy)
    } catch (error: any) {
      console.error("Erro ao carregar política de senhas:", error)
      showMessage("Erro ao carregar política de senhas", "error")
    } finally {
      setLoadingPolicy(false)
    }
  }

  const handleSmtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSmtp(true)
    try {
      await smtpService.updateConfig(smtpSettings)
      showMessage("Configurações SMTP salvas com sucesso!", "success")
    } catch (error: any) {
      showMessage(`Erro ao salvar configurações SMTP: ${error.message}`, "error")
    } finally {
      setSavingSmtp(false)
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

  const handlePasswordPolicySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPolicy(true)
    try {
      await passwordPolicyService.updatePolicy(passwordPolicy)
      showMessage("Política de senhas salva com sucesso!", "success")
    } catch (error: any) {
      showMessage(`Erro ao salvar política de senhas: ${error.message}`, "error")
    } finally {
      setSavingPolicy(false)
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

  if (!user || user.role !== "admin") return null

  const tabs = [
    {
      id: "smtp",
      label: "SMTP",
      icon: <Mail className="h-4 w-4" />,
      content: (
        <ConfigFormTemplate
          title="Configurações SMTP"
          description="Configure o servidor de email para envio de notificações"
          icon={<Mail className="h-5 w-5" />}
          onSubmit={handleSmtpSubmit}
          submitLabel="Salvar Configurações SMTP"
          isSubmitting={savingSmtp}
          extraActions={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="email@teste.com"
                  className="h-9 w-48"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestEmail}
                  disabled={testing || !testEmail}
                  className="h-9 flex items-center gap-2"
                >
                  {testing ? (
                    <>
                      <TestTube className="h-4 w-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Testar
                    </>
                  )}
                </Button>
              </div>
            </div>
          }
        >
          {loadingSmtp ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Carregando configurações...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP *</Label>
                  <Input
                    id="smtpHost"
                    value={smtpSettings.host}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta *</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={smtpSettings.port}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, port: Number.parseInt(e.target.value) })}
                    placeholder="587"
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Usuário *</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpSettings.username}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                    placeholder="usuario@gmail.com"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPassword ? "text" : "password"}
                      value={smtpSettings.password || ""}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                      placeholder="••••••••"
                      className="h-11 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">Email do Remetente *</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={smtpSettings.from_email}
                  onChange={(e) => setSmtpSettings({ ...smtpSettings, from_email: e.target.value })}
                  placeholder="noreply@breachhawk.com"
                  className="h-11"
                  required
                />
              </div>

              {/* Test Result */}
              {testResult && (
                <Alert
                  className={`${testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
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
          )}
        </ConfigFormTemplate>
      ),
    },
    {
      id: "security",
      label: "Segurança",
      icon: <Shield className="h-4 w-4" />,
      content: (
        <ConfigFormTemplate
          title="Política de Senhas"
          description="Configure os requisitos de segurança para senhas dos usuários"
          icon={<Shield className="h-5 w-5" />}
          onSubmit={handlePasswordPolicySubmit}
          submitLabel="Salvar Política de Senhas"
          isSubmitting={savingPolicy}
        >
          {loadingPolicy ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Carregando política...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="minLength">Comprimento Mínimo</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={passwordPolicy.min_length}
                  onChange={(e) =>
                    setPasswordPolicy({
                      ...passwordPolicy,
                      min_length: Number.parseInt(e.target.value),
                    })
                  }
                  min="6"
                  max="32"
                  className="h-11 max-w-xs"
                />
                <p className="text-sm text-gray-500">Número mínimo de caracteres (6-32)</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Requisitos de Caracteres</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Letras Maiúsculas</Label>
                      <p className="text-sm text-gray-600">Requer pelo menos uma letra maiúscula (A-Z)</p>
                    </div>
                    <Switch
                      checked={passwordPolicy.require_uppercase}
                      onCheckedChange={(checked) =>
                        setPasswordPolicy({ ...passwordPolicy, require_uppercase: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Letras Minúsculas</Label>
                      <p className="text-sm text-gray-600">Requer pelo menos uma letra minúscula (a-z)</p>
                    </div>
                    <Switch
                      checked={passwordPolicy.require_lowercase}
                      onCheckedChange={(checked) =>
                        setPasswordPolicy({ ...passwordPolicy, require_lowercase: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Números</Label>
                      <p className="text-sm text-gray-600">Requer pelo menos um número (0-9)</p>
                    </div>
                    <Switch
                      checked={passwordPolicy.require_numbers}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, require_numbers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Símbolos Especiais</Label>
                      <p className="text-sm text-gray-600">Requer pelo menos um símbolo (!@#$%^&*)</p>
                    </div>
                    <Switch
                      checked={passwordPolicy.require_symbols}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, require_symbols: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Preview da política */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h5 className="font-medium mb-2">Prévia da Política</h5>
                <p className="text-sm text-gray-600">{passwordPolicyService.getPolicyDescription(passwordPolicy)}</p>
              </div>
            </div>
          )}
        </ConfigFormTemplate>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <SettingsTemplate
        title="Configurações da Plataforma"
        description="Gerencie as configurações essenciais do BreachHawk"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        message={message}
        messageType={messageType}
      />
    </DashboardLayout>
  )
}
