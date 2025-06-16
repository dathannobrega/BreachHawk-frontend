"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Lock, Eye, EyeOff, Chrome, AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLanguageContextReady, setIsLanguageContextReady] = useState(false)

  const { login, loginWithToken, isAuthenticated } = useAuth()
  const { language, t } = useLanguage()
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
        .then((res) => {
          if (!res.ok) throw new Error("Token inválido")
          return res.json()
        })
        .then((userData) => {
          loginWithToken({ token, user: userData })
          setSuccess(language === "pt" ? "Login realizado com sucesso!" : "Login successful!")
          setTimeout(() => router.push("/dashboard"), 1500)
        })
        .catch(() => {
          setError(language === "pt" ? "Erro ao fazer login com Google" : "Error signing in with Google")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [searchParams, loginWithToken, apiUrl, language, router])

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
    if (success) setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Ajustar dados para corresponder ao formato esperado pela API
      let loginData: { username?: string; email?: string; password: string }
      if (formData.username.includes("@")) {
        loginData = { email: formData.username, password: formData.password }
      } else {
        loginData = { username: formData.username, password: formData.password }
      }

      await login(loginData as any)
      setSuccess(language === "pt" ? "Login realizado com sucesso!" : "Login successful!")
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (err: any) {
      setError(
        err.message || (language === "pt" ? "Erro ao fazer login. Tente novamente." : "Login error. Please try again."),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/api/accounts/login/google/`
  }

  // Loading state
  if (!isLanguageContextReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-blue-200">
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-blue-700">Carregando...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900">BreachHawk</h1>
          <p className="text-blue-600">{t.auth.login.subtitle}</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-blue-900">{t.auth.login.title}</CardTitle>
            <CardDescription className="text-center text-blue-600">
              {language === "pt"
                ? "Entre com suas credenciais para acessar a plataforma"
                : "Enter your credentials to access the platform"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900 font-medium">
                  {t.auth.login.username}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={t.auth.login.usernamePlaceholder}
                    className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900 font-medium">
                  {t.auth.login.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.auth.login.passwordPlaceholder}
                    className="pl-10 pr-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {t.auth.login.forgotPassword}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-blue-600 font-medium">{t.auth.login.or}</span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-blue-200 hover:bg-blue-50 transition-colors"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Chrome className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-blue-700">{t.auth.login.googleLogin}</span>
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-blue-100">
              <span className="text-blue-600">{t.auth.login.noAccount} </span>
              <Link href="/register" className="text-blue-700 hover:text-blue-800 font-semibold transition-colors">
                {t.auth.login.register}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-blue-500">
          <p>© 2024 BreachHawk. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
