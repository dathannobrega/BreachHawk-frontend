"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthForm } from "@/components/molecules/AuthForm/AuthForm"
import { AuthLayout } from "@/components/templates/AuthLayout/AuthLayout"
import { useAuth } from "@/hooks/useAuth"
import type { LoginCredentials } from "@/types/auth"

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login")
  const { login, register, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "login") {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
        }
        await login(credentials)
      } else {
        await register(formData)
      }

      // Navigation will be handled by the useEffect above
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error("Authentication failed:", err)
    }
  }

  // Don't render if already authenticated (prevents flash)
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
