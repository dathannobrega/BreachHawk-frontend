"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, User, Lock, Chrome, Globe } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, loginWithToken, isAuthenticated } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Verificar se há token na URL (OAuth callback)
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      // Fazer request para obter dados do usuário
      fetch(`${apiUrl}/api/v1/auth/me`, {
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
    }
  }, [searchParams])

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData)
    } catch (err: any) {
      setError(
        err.message || (language === "pt" ? "Erro ao fazer login. Tente novamente." : "Login error. Please try again."),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/api/v1/auth/login/google`
  }

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl font-bold">{t("auth.login.title")}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-1" />
              {language === "pt" ? "EN" : "PT"}
            </Button>
          </div>
          <CardDescription className="text-center">{t("auth.login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("auth.login.username")}
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder={t("auth.login.usernamePlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t("auth.login.password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.login.passwordPlaceholder")}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
            </Button>

            <div className="text-center mt-2">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t("auth.login.or")}</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
              <Chrome className="h-4 w-4 mr-2" />
              {t("auth.login.googleLogin")}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t("auth.login.noAccount")} </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              {t("auth.login.register")}
            </Link>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">{t("auth.login.testCredentials")}</p>
            <p>{t("auth.login.adminCredentials")}</p>
            <p>{t("auth.login.userCredentials")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
