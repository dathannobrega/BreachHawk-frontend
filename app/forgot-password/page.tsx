"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Mail, ArrowLeft, Globe, User, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { language, setLanguage, t } = useLanguage()
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
    setError("")
    setLoading(true)

    try {
      // Determinar se é email ou username
      const isEmail = identifier.includes("@")
      const requestData = isEmail ? { email: identifier.trim() } : { username: identifier.trim() }

      const response = await fetch(`${apiUrl}/api/accounts/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      // O endpoint sempre retorna {"success": true} por segurança
      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        throw new Error(data.detail || t.auth.forgotPassword.errors.generic)
      }
    } catch (err: any) {
      setError(
        err.message ||
          (language === "pt"
            ? "Erro ao enviar instruções. Tente novamente."
            : "Error sending instructions. Please try again."),
      )
    } finally {
      setLoading(false)
    }
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
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800 text-center">
                  {language === "pt"
                    ? "Se o usuário existir, um e-mail com instruções foi enviado. Verifique sua caixa de entrada e spam."
                    : "If the user exists, an email with instructions has been sent. Check your inbox and spam folder."}
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link href="/login">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t.auth.forgotPassword.back}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {language === "pt" ? "E-mail ou Nome de Usuário" : "Email or Username"}
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      language === "pt" ? "Digite seu e-mail ou nome de usuário" : "Enter your email or username"
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "pt"
                      ? "Digite seu e-mail ou nome de usuário cadastrado"
                      : "Enter your registered email or username"}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !identifier.trim()}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === "pt" ? "Enviando..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      {language === "pt" ? "Enviar Instruções" : "Send Instructions"}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1 inline" />
                  {t.auth.forgotPassword.back}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {language === "pt" ? "Não tem uma conta?" : "Don't have an account?"}{" "}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    {language === "pt" ? "Registre-se" : "Sign up"}
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
