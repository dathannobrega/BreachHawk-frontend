"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AuthLayout } from "@/components/templates/auth-layout"
import { useLanguage } from "@/contexts/language-context"
import { getTranslations } from "@/lib/i18n"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = getTranslations(language)
  const [identifier, setIdentifier] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const payload = isEmail(identifier) ? { email: identifier } : { username: identifier }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.detail || "Erro ao enviar instruções")
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">{t.auth.forgotPassword.title}</CardTitle>
            <CardDescription className="text-slate-600">{t.auth.forgotPassword.success}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.auth.forgotPassword.back}
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
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">{t.auth.forgotPassword.title}</CardTitle>
          <CardDescription className="text-slate-600">{t.auth.forgotPassword.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier">{t.auth.forgotPassword.email}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t.auth.forgotPassword.emailPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
              <p className="text-xs text-slate-500">Digite seu e-mail ou nome de usuário</p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading || !identifier.trim()}>
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  {t.auth.forgotPassword.sending}
                </>
              ) : (
                t.auth.forgotPassword.send
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                <ArrowLeft className="mr-1 h-3 w-3 inline" />
                {t.auth.forgotPassword.back}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
