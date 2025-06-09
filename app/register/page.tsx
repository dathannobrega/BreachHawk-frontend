"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { StatusMessage } from "@/components/ui/status-message"
import { AuthLayout } from "@/components/templates/auth-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { User, Mail, Lock, Building, Eye, EyeOff } from "lucide-react"
import PasswordValidator from "@/components/ui/password-validator"
import { passwordPolicyService } from "@/services/password-policy-service"
import type { PasswordPolicyRead } from "@/types/password-policy"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicyRead | null>(null)
  const [loadingPolicy, setLoadingPolicy] = useState(true)

  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Carregar política de senhas pública
  useEffect(() => {
    const loadPasswordPolicy = async () => {
      try {
        const policy = await passwordPolicyService.getPublicPolicy()
        setPasswordPolicy(policy)
      } catch (error) {
        console.error("Erro ao carregar política de senhas:", error)
        // Usar política padrão se não conseguir carregar
        setPasswordPolicy({
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: true,
        })
      } finally {
        setLoadingPolicy(false)
      }
    }

    loadPasswordPolicy()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    // Validar se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }

    // Validar senha contra a política
    if (passwordPolicy) {
      const validation = passwordPolicyService.validatePassword(formData.password, passwordPolicy)
      if (!validation.isValid) {
        setError(validation.errors[0])
        return false
      }
    } else if (formData.password.length < 8) {
      // Fallback se não tiver política
      setError("A senha deve ter pelo menos 8 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/accounts/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          company: formData.company,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao criar conta")
      }

      setSuccess("Conta criada com sucesso! Redirecionando...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  return (
      <AuthLayout title="Criar conta" description="Junte-se à plataforma de threat intelligence">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <StatusMessage type="error" message={error} onClose={() => setError("")} />}

          {success && <StatusMessage type="success" message={success} />}

          <div className="grid grid-cols-1 gap-4">
            <FormField
                label="Nome completo"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Seu nome completo"
                icon={User}
                required
                disabled={isLoading}
            />

            <FormField
                label="Usuário"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Seu nome de usuário"
                icon={User}
                required
                disabled={isLoading}
            />

            <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                icon={Mail}
                required
                disabled={isLoading}
            />

            <FormField
                label="Empresa"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Nome da sua empresa"
                icon={Building}
                required
                disabled={isLoading}
            />

            <div className="space-y-2">
              <FormField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  disabled={isLoading}
              />

              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
              >
                {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Ocultar senha
                    </>
                ) : (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Mostrar senha
                    </>
                )}
              </Button>

              {/* Validador de senha em tempo real */}
              {passwordPolicy && !loadingPolicy && formData.password && (
                  <PasswordValidator password={formData.password} policy={passwordPolicy} />
              )}
            </div>

            <div className="space-y-2">
              <FormField
                  label="Confirmar senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  disabled={isLoading}
              />

              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
              >
                {showConfirmPassword ? (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Ocultar senha
                    </>
                ) : (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Mostrar senha
                    </>
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading || !isFormValid}>
            {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Criando conta...
                </>
            ) : (
                "Criar conta"
            )}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Já tem uma conta?{" "}
            <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors focus-ring rounded"
            >
              Faça login
            </Link>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
              Política de Privacidade
            </Link>
          </div>
        </form>
      </AuthLayout>
  )
}
