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

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("access_token")
      const savedUser = localStorage.getItem("user")

      if (savedToken && savedUser) {
        try {
          // Primeiro, tenta usar os dados salvos
          const userData = JSON.parse(savedUser)
          setToken(savedToken)
          setUser(userData)

          // Depois, tenta validar o token fazendo uma requisição simples
          // Como /users/me não existe, vamos tentar uma rota que sabemos que existe
          const response = await fetch(`${apiUrl}/api/v1/auth/validate-token`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${savedToken}`,
              "Content-Type": "application/json",
            },
          })

          // Se a validação falhar, limpa os dados
          if (!response.ok) {
            console.log("Token inválido, limpando dados de autenticação")
            localStorage.removeItem("access_token")
            localStorage.removeItem("user")
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error("Erro ao validar token:", error)
          // Em caso de erro, mantém os dados salvos para funcionar offline
        }
      }
      setLoading(false)
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
