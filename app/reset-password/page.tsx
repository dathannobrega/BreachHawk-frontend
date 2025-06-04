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
import { Shield, Lock, ArrowLeft, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid-token">("idle")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" && window.location.hostname === "www.protexion.cloud"
      ? "https://www.protexion.cloud/api"
      : "https://dev.protexion.cloud")

  useEffect(() => {
    if (!token) {
      setStatus("invalid-token")
      setError("Token de redefinição inválido ou ausente.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setStatus("loading")
    setError("")

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao redefinir senha")
      }

      setStatus("success")
    } catch (err: any) {
      setStatus("error")
      setError(err.message || "Ocorreu um erro. Tente novamente.")
    }
  }

  if (status === "invalid-token") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl font-bold">BreachHawk</CardTitle>
            </div>
            <CardDescription className="text-center">Redefinição de senha</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Solicitar nova redefinição</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl font-bold">BreachHawk</CardTitle>
          </div>
          <CardDescription className="text-center">Redefinição de senha</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === "success" ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-center">Senha redefinida com sucesso!</h3>
                <p className="text-center text-gray-600 mt-2">
                  Sua senha foi alterada. Agora você pode fazer login com sua nova senha.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/login">Ir para o login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Nova senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirme a senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  minLength={8}
                />
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={status === "loading" || password !== confirmPassword}>
                {status === "loading" ? "Redefinindo..." : "Redefinir senha"}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
