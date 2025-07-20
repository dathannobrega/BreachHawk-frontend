"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, User, Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    identifier: "", // pode ser username ou email
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.identifier.trim()) {
      newErrors.identifier = t.auth.forgotPassword.errors.identifierRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      // Determinar se é email ou username
      const isEmail = formData.identifier.includes("@")
      const requestData = isEmail ? { email: formData.identifier } : { username: formData.identifier }

      const response = await fetch(`${apiUrl}/api/accounts/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuccess(true)
        } else {
          throw new Error(t.auth.forgotPassword.errors.generic)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || t.auth.forgotPassword.errors.generic)
      }
    } catch (err: any) {
      setErrors({
        submit: err.message || t.auth.forgotPassword.errors.generic,
      })
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
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{t.auth.forgotPassword.success}</AlertDescription>
              </Alert>
              <div className="text-center text-sm text-muted-foreground">{t.auth.forgotPassword.checkEmail}</div>
            </div>
          ) : (
            <>
              {errors.submit && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.auth.forgotPassword.identifier}
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder={t.auth.forgotPassword.identifierPlaceholder}
                    className={cn(errors.identifier ? "border-red-500" : "")}
                  />
                  {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.auth.forgotPassword.sending : t.auth.forgotPassword.send}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">
                  {language === "pt" ? "Voltar ao login" : "Back to login"}
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
