"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Check, Globe, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import PasswordValidator from "@/components/ui/password-validator"
import { passwordPolicyService } from "@/services/password-policy-service"
import type { PasswordPolicyRead } from "@/types/password-policy"

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [token, setToken] = useState("")
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicyRead | null>(null)
  const [loadingPolicy, setLoadingPolicy] = useState(true)

  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam && tokenParam.trim()) {
      setToken(tokenParam.trim())
      setTokenValid(true)

      // Remove token da URL por segurança após capturar
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    } else {
      setTokenValid(false)
      setErrors({
        token:
          language === "pt"
            ? "Token inválido ou ausente. Solicite um novo link de recuperação."
            : "Invalid or missing token. Request a new recovery link.",
      })
    }
  }, [searchParams, language])

  // Carregar política de senhas pública
  useEffect(() => {
    const loadPasswordPolicy = async () => {
      try {
        const policy = await passwordPolicyService.getPublicPolicy()
        setPasswordPolicy(policy)
      } catch (error) {
        console.error("Erro ao carregar política de senhas:", error)
        // Usar política padrão se não conseguir carregar
        setPasswordPolicy({
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: true,
        })
      } finally {
        setLoadingPolicy(false)
      }
    }

    loadPasswordPolicy()
  }, [])

  // Verificação de segurança para garantir que t está disponível
  if (!t || !t.auth || !t.auth.resetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = t.auth.resetPassword.errors.passwordRequired
    } else if (passwordPolicy) {
      const validation = passwordPolicyService.validatePassword(formData.password, passwordPolicy)
      if (!validation.isValid) {
        newErrors.password = validation.errors[0]
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.resetPassword.errors.passwordMismatch
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/accounts/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        throw new Error(data.detail || "Invalid or expired token")
      }
    } catch (err: any) {
      setErrors({
        submit:
          err.message === "Invalid or expired token"
            ? language === "pt"
              ? "Token inválido ou expirado. Solicite um novo link de recuperação."
              : "Invalid or expired token. Request a new recovery link."
            : language === "pt"
              ? "Erro ao redefinir senha. Verifique se o link ainda é válido."
              : "Error resetting password. Check if the link is still valid.",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

  // Token inválido ou ausente - Exatamente como na imagem
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              {language === "pt" ? "Link Inválido" : "Invalid Link"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {language === "pt"
                ? "O link de redefinição de senha é inválido ou expirou."
                : "The password reset link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{errors.token}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Link href="/forgot-password">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {language === "pt" ? "Solicitar Novo Link" : "Request New Link"}
                </Button>
              </Link>
              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">
                  {language === "pt" ? "Voltar ao Login" : "Back to Login"}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sucesso
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              {language === "pt" ? "Senha Redefinida!" : "Password Reset!"}
            </CardTitle>
            <CardDescription>{t.auth.resetPassword.success}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-200 bg-green-50 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {language === "pt"
                  ? "Sua senha foi redefinida com sucesso. Redirecionando para o login..."
                  : "Your password has been successfully reset. Redirecting to login..."}
              </AlertDescription>
            </Alert>
            <Link href="/login">
              <Button className="w-full">{language === "pt" ? "Ir para Login" : "Go to Login"}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl font-bold">{t.auth.resetPassword.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-1" />
              {language === "pt" ? "EN" : "PT"}
            </Button>
          </div>
          <CardDescription className="text-center">{t.auth.resetPassword.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {errors.submit && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t.auth.resetPassword.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.auth.resetPassword.passwordPlaceholder}
                  className={cn("pr-10", errors.password ? "border-red-500" : "")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

              {/* Validador de senha em tempo real */}
              {passwordPolicy && !loadingPolicy && (
                <PasswordValidator password={formData.password} policy={passwordPolicy} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                {t.auth.resetPassword.confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.auth.resetPassword.confirmPasswordPlaceholder}
                  className={cn("pr-10", errors.confirmPassword ? "border-red-500" : "")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || loadingPolicy || !formData.password || !formData.confirmPassword}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.auth.resetPassword.resetting}
                </>
              ) : (
                t.auth.resetPassword.reset
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              {language === "pt" ? "Voltar ao login" : "Back to login"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
