"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  username: string | null
  email: string
  first_name: string | null
  last_name: string | null
  role: "admin" | "user" | "platform_admin"
  company: string | null
  job_title: string | null
  profile_image: string | null
  organization: string | null
  contact: string | null
  is_subscribed: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: { username: string; email?: string | null; password: string }) => Promise<void>
  loginWithToken: (data: { token: string; user: User }) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      // Verificar se o token ainda é válido
      fetch(`${apiUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          throw new Error("Token inválido")
        })
        .then((userData) => {
          setUser(userData)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem("access_token")
          setUser(null)
          setIsAuthenticated(false)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [apiUrl])

  const login = async (credentials: { username: string; email?: string | null; password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao fazer login")
      }

      const data = await response.json()

      localStorage.setItem("access_token", data.access_token)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  }

  const loginWithToken = (data: { token: string; user: User }) => {
    localStorage.setItem("access_token", data.token)
    setUser(data.user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        loginWithToken,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
