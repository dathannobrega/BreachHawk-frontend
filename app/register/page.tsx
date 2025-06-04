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
import { Shield, User, Mail, Lock, Check, ArrowLeft, ArrowRight, Building, Globe } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

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
  const { language, setLanguage, t } = useLanguage()

  // Verificação de segurança para garantir que t está disponível
  if (!t || !t.auth || !t.auth.register) {
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

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.username.trim()) newErrors.username = t.auth.register.errors.usernameRequired
    if (!formData.email.trim()) newErrors.email = t.auth.register.errors.emailRequired
    if (!formData.password) newErrors.password = t.auth.register.errors.passwordRequired
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.register.errors.passwordMismatch
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = t.auth.register.errors.firstNameRequired
    if (!formData.lastName.trim()) newErrors.lastName = t.auth.register.errors.lastNameRequired
    if (!formData.terms) newErrors.terms = t.auth.register.errors.termsRequired
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
        setErrors({
          submit:
            err.message ||
            (language === "pt" ? "Erro ao registrar. Tente novamente." : "Registration error. Please try again."),
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {t.auth.register.username}
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder={t.auth.register.usernamePlaceholder}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {t.auth.register.email}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t.auth.register.emailPlaceholder}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {t.auth.register.password}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={t.auth.register.passwordPlaceholder}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          {t.auth.register.confirmPassword}
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder={t.auth.register.confirmPasswordPlaceholder}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Button type="button" onClick={nextStep} className="w-full">
        {t.auth.register.next}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">{t.auth.register.firstName}</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder={t.auth.register.firstNamePlaceholder}
          className={errors.firstName ? "border-red-500" : ""}
        />
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">{t.auth.register.lastName}</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder={t.auth.register.lastNamePlaceholder}
          className={errors.lastName ? "border-red-500" : ""}
        />
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          {t.auth.register.company}
        </Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder={t.auth.register.companyPlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">{t.auth.register.jobTitle}</Label>
        <Input
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          placeholder={t.auth.register.jobTitlePlaceholder}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleChange("terms", checked)} />
        <Label htmlFor="terms" className="text-sm">
          {t.auth.register.terms}{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            {t.auth.register.termsLink}
          </Link>{" "}
          {t.auth.register.and}{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            {t.auth.register.privacyLink}
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
          {t.auth.register.back}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? t.auth.register.registering : t.auth.register.register}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl font-bold">{t.auth.register.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-1" />
              {language === "pt" ? "EN" : "PT"}
            </Button>
          </div>
          <CardDescription className="text-center">
            {language === "pt" ? "Etapa" : "Step"} {step} {t.auth.register.stepOf} 2 -{" "}
            {step === 1 ? t.auth.register.step1 : t.auth.register.step2}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t.auth.register.hasAccount} </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              {t.auth.register.login}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
