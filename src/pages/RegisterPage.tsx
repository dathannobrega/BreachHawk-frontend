"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/molecules/AuthForm/AuthForm"
import { AuthLayout } from "@/components/templates/AuthLayout/AuthLayout"
import { useAuth } from "@/hooks/useAuth"
import type { RegisterData } from "@/types/auth"

export const RegisterPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("register")
  const { register, login, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "register") {
        const registerData: RegisterData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
        await register(registerData)
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        })
      }
    } catch (err) {
      console.error("Authentication failed:", err)
    }
  }

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthForm mode={mode} onSubmit={handleSubmit} loading={loading} error={error} onModeChange={setMode} />
      </div>
    </AuthLayout>
  )
}
