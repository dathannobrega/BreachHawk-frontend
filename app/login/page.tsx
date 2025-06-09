"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { StatusMessage } from "@/components/ui/status-message"
import { AuthLayout } from "@/components/templates/auth-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLanguageContextReady, setIsLanguageContextReady] = useState(false)

  const { login, loginWithToken, isAuthenticated } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Verificar se o contexto de idioma está pronto
  useEffect(() => {
    if (t && t.auth && t.auth.login) {
      setIsLanguageContextReady(true)
    }
  }, [t])

  // Verificar se há token na URL (OAuth callback)
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setIsLoading(true)
      fetch(`${apiUrl}/api/accounts/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          loginWithToken({ token, user: userData })
        })
        .catch(() => {
          setError(language === "pt" ? "Erro ao fazer login com Google" : "Error signing in with Google")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [searchParams, loginWithToken, apiUrl, language])

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Ajustar dados para corresponder ao formato esperado pela API
      const loginData = {
        username: formData.username, // Pode ser email ou username
        email: formData.username.includes("@") ? formData.username : null,
        password: formData.password,
      }

      await login(loginData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(
        err.message || (language === "pt" ? "Erro ao fazer login. Tente novamente." : "Login error. Please try again."),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/api/accounts/login/google`
  }

  // Loading state
  if (!isLanguageContextReady) {
    return (
      <AuthLayout title="BreachHawk" description="Carregando...">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t.auth.login.title} description={t.auth.login.subtitle}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <StatusMessage type="error" message={error} onClose={() => setError("")} />}

        <FormField
          label={t.auth.login.username}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder={t.auth.login.usernamePlaceholder}
          icon={Mail}
          required
          disabled={isLoading}
        />

        <div className="space-y-2">
          <FormField
            label={t.auth.login.password}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t.auth.login.passwordPlaceholder}
            icon={Lock}
            required
            disabled={isLoading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-slate-500 hover:text-slate-700"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                {language === "pt" ? "Ocultar senha" : "Hide password"}
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-1" />
                {language === "pt" ? "Mostrar senha" : "Show password"}
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors focus-ring rounded"
          >
            {t.auth.login.forgotPassword}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {t.auth.login.loggingIn}
            </>
          ) : (
            t.auth.login.loginButton
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500 font-medium">{t.auth.login.or}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-slate-300 hover:bg-slate-50 transition-smooth focus-ring"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Chrome className="h-5 w-5 mr-3" />
          {t.auth.login.googleLogin}
        </Button>

        <div className="text-center pt-4">
          <span className="text-slate-600">{t.auth.login.noAccount} </span>
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors focus-ring rounded"
          >
            {t.auth.login.register}
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
