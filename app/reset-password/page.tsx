"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PasswordValidator } from "@/components/ui/password-validator"
import { AuthLayout } from "@/components/templates/auth-layout"
import { useLanguage } from "@/contexts/language-context"
import { getTranslations } from "@/lib/i18n"
import { ArrowLeft, Lock, CheckCircle, AlertTriangle } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const t = getTranslations(language)

  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      // Remove token from URL for security
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      setTokenValid(true)
    } else {
      setTokenValid(false)
      setError(t.auth.resetPassword.errors.invalidToken)
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError(t.auth.resetPassword.errors.passwordMismatch)
      return
    }

    if (!password.trim()) {
      setError(t.auth.resetPassword.errors.passwordRequired)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // This endpoint doesn't exist yet in the backend, but we're preparing for it
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.detail || t.auth.resetPassword.errors.invalidToken)
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === false) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Token Inválido</CardTitle>
            <CardDescription className="text-slate-600">
              O link de redefinição de senha é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => router.push("/forgot-password")} className="w-full">
                Solicitar Novo Link
              </Button>
              <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Senha Redefinida!</CardTitle>
            <CardDescription className="text-slate-600">{t.auth.resetPassword.success}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">{t.auth.resetPassword.title}</CardTitle>
          <CardDescription className="text-slate-600">{t.auth.resetPassword.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.resetPassword.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.auth.resetPassword.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.resetPassword.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.auth.resetPassword.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {password && <PasswordValidator password={password} />}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || !password.trim() || !confirmPassword.trim() || password !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  {t.auth.resetPassword.resetting}
                </>
              ) : (
                t.auth.resetPassword.reset
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                <ArrowLeft className="mr-1 h-3 w-3 inline" />
                Voltar ao Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-8">
              <LoadingSpinner className="h-8 w-8" />
            </CardContent>
          </Card>
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
