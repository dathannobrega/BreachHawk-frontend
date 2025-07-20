"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Check, Globe, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import PasswordValidator from "@/components/ui/password-validator"
import { passwordPolicyService } from "@/services/password-policy-service"
import type { PasswordPolicyRead } from "@/types/password-policy"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [token, setToken] = useState("")
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
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setErrors({ token: t?.auth?.resetPassword?.errors?.invalidToken || "Token inválido ou ausente" })
    }
  }, [searchParams, t])

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
          token,
          new_password: formData.password,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        const data = await response.json()
        throw new Error(data.detail || t.auth.resetPassword.errors.invalidToken)
      }
    } catch (err: any) {
      setErrors({
        submit:
          err.message ||
          (language === "pt"
            ? "Erro ao redefinir senha. Tente novamente."
            : "Error resetting password. Please try again."),
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

  if (errors.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{errors.token}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                {language === "pt" ? "Solicitar nova recuperação" : "Request new recovery"}
              </Link>
            </div>
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
          {success ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{t.auth.resetPassword.success}</AlertDescription>
              </Alert>
              <div className="text-center text-sm text-muted-foreground">
                {language === "pt" ? "Redirecionando para o login..." : "Redirecting to login..."}
              </div>
            </div>
          ) : (
            <>
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

                <Button type="submit" className="w-full" disabled={loading || loadingPolicy}>
                  {loading ? t.auth.resetPassword.resetting : t.auth.resetPassword.reset}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">
                  {language === "pt" ? "Voltar ao login" : "Back to login"}
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
