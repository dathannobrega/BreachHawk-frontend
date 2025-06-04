"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, User, Mail, Lock, Check, ArrowLeft, ArrowRight, Building } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    terms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.username.trim()) newErrors.username = "Usuário é obrigatório"
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório"
    if (!formData.password) newErrors.password = "Senha é obrigatória"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Nome é obrigatório"
    if (!formData.lastName.trim()) newErrors.lastName = "Sobrenome é obrigatório"
    if (!formData.terms) newErrors.terms = "Você precisa concordar com os Termos de Serviço"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
  }

  const prevStep = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 2 && validateStep2()) {
      setLoading(true)
      try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          job_title: formData.jobTitle,
        })
      } catch (err: any) {
        setErrors({ submit: err.message || "Erro ao registrar. Tente novamente." })
      } finally {
        setLoading(false)
      }
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Usuário
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="Digite um nome de usuário"
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          E-mail
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Digite seu e-mail"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Senha
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Crie uma senha"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Confirme a Senha
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder="Repita sua senha"
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Button type="button" onClick={nextStep} className="w-full">
        Próximo
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Nome</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="Digite seu nome"
          className={errors.firstName ? "border-red-500" : ""}
        />
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Sobrenome</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder="Digite seu sobrenome"
          className={errors.lastName ? "border-red-500" : ""}
        />
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Empresa (opcional)
        </Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Digite sua empresa"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Cargo (opcional)</Label>
        <Input
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          placeholder="Digite seu cargo"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleChange("terms", checked)} />
        <Label htmlFor="terms" className="text-sm">
          Eu li e concordo com os{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Política de Privacidade
          </Link>
        </Label>
      </div>
      {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

      {errors.submit && (
        <Alert variant="destructive">
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Registrando..." : "Concluir Registro"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl font-bold">Registro</CardTitle>
          </div>
          <CardDescription className="text-center">
            Etapa {step} de 2 - {step === 1 ? "Credenciais" : "Informações Pessoais"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
