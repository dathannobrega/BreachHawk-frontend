"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Mail, User, Globe, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Verificação de segurança para garantir que t está disponível
  if (!t || !t.auth || !t.auth.forgotPassword) {
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
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier.trim()) {
      setError(t.auth.forgotPassword.errors.identifierRequired)
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${apiUrl}/api/accounts/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Detecta automaticamente se é email ou username
          ...(identifier.includes("@") ? { email: identifier } : { username: identifier }),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        throw new Error(data.detail || t.auth.forgotPassword.errors.serverError)
      }
    } catch (err: any) {
      // Sempre mostra mensagem genérica por segurança
      setError(
        language === "pt"
          ? "Se o usuário existir, um email de recuperação será enviado."
          : "If the user exists, a recovery email will be sent.",
      )
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

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
            <CardTitle className="text-2xl font-bold text-green-600">{t.auth.forgotPassword.success.title}</CardTitle>
            <CardDescription>{t.auth.forgotPassword.success.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {language === "pt"
                  ? "Se o usuário existir, um email com instruções foi enviado."
                  : "If the user exists, an email with instructions has been sent."}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full">{language === "pt" ? "Voltar ao Login" : "Back to Login"}</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSuccess(false)
                  setIdentifier("")
                  setError("")
                }}
              >
                {language === "pt" ? "Enviar Outro Email" : "Send Another Email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl font-bold">{t.auth.forgotPassword.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-1" />
              {language === "pt" ? "EN" : "PT"}
            </Button>
          </div>
          <CardDescription className="text-center">{t.auth.forgotPassword.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2">
                {identifier.includes("@") ? <Mail className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {t.auth.forgotPassword.identifier}
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t.auth.forgotPassword.identifierPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={cn("h-11", error ? "border-red-500" : "")}
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                {language === "pt" ? "Digite seu email ou nome de usuário" : "Enter your email or username"}
              </p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading || !identifier.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.auth.forgotPassword.sending}
                </>
              ) : (
                t.auth.forgotPassword.send
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
