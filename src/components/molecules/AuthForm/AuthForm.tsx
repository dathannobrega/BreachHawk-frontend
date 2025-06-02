"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield } from "lucide-react"
import { initiateGoogleLogin } from "@/lib/auth-google"

interface AuthFormProps {
  mode: "login" | "register"
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
  error?: string | null
  onModeChange: (mode: "login" | "register") => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, loading = false, error, onModeChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [googleLoading, setGoogleLoading] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (mode === "register" && !formData.name.trim()) {
      errors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }

    if (!formData.password) {
      errors.password = "Senha é obrigatória"
    } else if (formData.password.length < 8) {
      errors.password = "Senha deve ter pelo menos 8 caracteres"
    }

    if (mode === "register") {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirmação de senha é obrigatória"
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Senhas não coincidem"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      // Error is handled by parent component
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true)
      await initiateGoogleLogin()
    } catch (err) {
      console.error("Google login failed:", err)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">BreachHawk</span>
        </div>
        <CardTitle className="text-2xl">{mode === "login" ? "Fazer Login" : "Criar Conta"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Entre com suas credenciais para acessar a plataforma"
            : "Crie sua conta para começar a monitorar ameaças"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path
                  d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
                  fill="#4285F4"
                ></path>
              </g>
            </svg>
            {mode === "login" ? "Entrar com Google" : "Registrar com Google"}
          </Button>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === "register" && (
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={validationErrors.name}
              required
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={validationErrors.email}
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={validationErrors.password}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {mode === "register" && (
            <div className="relative">
              <Input
                label="Confirmar senha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={validationErrors.confirmPassword}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading} disabled={loading || googleLoading}>
            {mode === "login" ? "Entrar" : "Criar Conta"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => onModeChange(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Não tem uma conta? Registre-se" : "Já tem uma conta? Faça login"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
