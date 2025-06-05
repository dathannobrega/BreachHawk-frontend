"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Atualizar a interface User para corresponder exatamente à resposta do backend
interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: "admin" | "user" | "platform_admin"
  profile_image?: string
  organization?: string
  contact?: string
  company?: string
  job_title?: string
  is_subscribed?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: { username: string; password: string }) => Promise<void>
  loginWithToken: (data: { token: string; user: User }) => void
  logout: () => void
  register: (data: any) => Promise<void>
  updateUser: (userData: User) => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Usa a URL da API do ambiente
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" && window.location.hostname === "www.protexion.cloud"
      ? "https://www.protexion.cloud/api"
      : "https://dev.protexion.cloud")

  // Função para salvar dados de autenticação
  const saveAuthData = (token: string, user: User) => {
    setToken(token)
    setUser(user)
    localStorage.setItem("access_token", token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("auth_timestamp", Date.now().toString())
  }

  // Função para limpar dados de autenticação
  const clearAuthData = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    localStorage.removeItem("auth_timestamp")
  }

  // Função para verificar se a sessão ainda é válida
  const isSessionValid = () => {
    const timestamp = localStorage.getItem("auth_timestamp")
    if (!timestamp) return false

    const sessionAge = Date.now() - Number.parseInt(timestamp)
    const maxAge = 24 * 60 * 60 * 1000 // 24 horas

    return sessionAge < maxAge
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("access_token")
        const savedUser = localStorage.getItem("user")

        if (savedToken && savedUser && isSessionValid()) {
          const userData = JSON.parse(savedUser)
          setToken(savedToken)
          setUser(userData)

          // Tentar validar o token com o backend (opcional)
          try {
            const response = await fetch(`${apiUrl}/api/v1/users/me`, {
              headers: {
                Authorization: `Bearer ${savedToken}`,
              },
            })

            if (response.ok) {
              const currentUser = await response.json()
              // Atualizar com dados mais recentes do servidor
              saveAuthData(savedToken, currentUser)
            }
          } catch (error) {
            console.log("Não foi possível validar com o servidor, usando dados locais")
          }
        } else {
          // Sessão expirada ou inválida
          clearAuthData()
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [apiUrl])

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
      saveAuthData(data.access_token, data.user)

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
    saveAuthData(data.token, data.user)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
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
      saveAuthData(result.access_token, result.user)

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    clearAuthData()
    router.push("/login")
  }

  const value = {
    user,
    token,
    login,
    loginWithToken,
    logout,
    register,
    updateUser,
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
