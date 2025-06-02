"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/auth"
import type { User, LoginCredentials, RegisterData } from "@/types/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = auth.subscribe((newUser) => {
      setUser(newUser)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const user = await auth.login(credentials)
      return user
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login. Verifique suas credenciais.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    setError(null)
    try {
      const user = await auth.register(userData)
      return user
    } catch (err: any) {
      setError(err.message || "Falha ao registrar. Tente novamente.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await auth.loginWithGoogle()
      return user
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login com Google. Tente novamente.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await auth.logout()
    } catch (err: any) {
      console.error("Logout failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  }
}
