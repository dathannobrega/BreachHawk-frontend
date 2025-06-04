"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Atualizar a interface User para incluir todos os campos do backend
interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: "admin" | "user" | "platform_admin"
  profileImage?: string
  organization?: string
  contact?: string
  company?: string
  jobTitle?: string
  isSubscribed?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: { username: string; password: string }) => Promise<void>
  loginWithToken: (data: { token: string; user: User }) => void
  logout: () => void
  register: (data: any) => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Usa a URL da API do ambiente ou, se estiver em produção, ajusta para usar a mesma origem
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" && window.location.hostname === "www.protexion.cloud"
      ? "https://www.protexion.cloud/api"
      : "https://dev.protexion.cloud")

  // No useEffect, atualizar para buscar dados atuais do usuário
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem("access_token")
      if (savedToken) {
        try {
          const response = await fetch(`${apiUrl}/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setToken(savedToken)
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
          } else {
            // Token inválido, limpar dados
            localStorage.removeItem("access_token")
            localStorage.removeItem("user")
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error)
        }
      }
      setLoading(false)
    }

    fetchCurrentUser()
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Falha no login")
      }

      const data = await response.json()

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirecionar baseado no role do usuário
      if (data.user.role === "platform_admin") {
        router.push("/platform/dashboard")
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      throw error
    }
  }

  const loginWithToken = (data: { token: string; user: User }) => {
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("access_token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const register = async (data: any) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Falha no registro")
      }

      const result = await response.json()

      setToken(result.access_token)
      setUser(result.user)

      localStorage.setItem("access_token", result.access_token)
      localStorage.setItem("user", JSON.stringify(result.user))

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const value = {
    user,
    token,
    login,
    loginWithToken,
    logout,
    register,
    loading,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
