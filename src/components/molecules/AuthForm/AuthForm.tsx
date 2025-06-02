"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield } from "lucide-react"
import { FaGoogle } from "react-icons/fa"

interface AuthFormProps {
  mode: "login" | "register"
  onSubmit: (data: any) => Promise<void>
  onGoogleAuth: () => Promise<void>
  loading?: boolean
  error?: string | null
  onModeChange: (mode: "login" | "register") => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onGoogleAuth,
  loading = false,
  error,
  onModeChange,
}) => {
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

  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true)
      await onGoogleAuth()
    } catch (err) {
      console.error("Google auth failed:", err)
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
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Auth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleGoogleAuth}
          disabled={loading || googleLoading}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          {googleLoading ? "Carregando..." : mode === "login" ? "Entrar com Google" : "Registrar com Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={validationErrors.name}
                required
                autoComplete="name"
              />
              {validationErrors.name && <p className="text-sm text-destructive">{validationErrors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={validationErrors.email}
              required
              autoComplete="email"
            />
            {validationErrors.email && <p className="text-sm text-destructive">{validationErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={validationErrors.password}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.password && <p className="text-sm text-destructive">{validationErrors.password}</p>}
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar senha
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  error={validationErrors.confirmPassword}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading} disabled={loading || googleLoading}>
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar Conta"}
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
