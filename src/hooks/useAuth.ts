"use client"

import { useState, useEffect } from "react"
import type { User, LoginCredentials, RegisterData } from "@/types/auth"
import { auth } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.subscribe(setUser)
    return unsubscribe
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      await auth.login(credentials)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    setError(null)
    try {
      await auth.register(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await auth.loginWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await auth.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: auth.isAuthenticated(),
  }
}
