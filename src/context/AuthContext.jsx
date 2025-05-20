"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Criando o contexto de autenticação
const AuthContext = createContext()

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext)
}

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Função para fazer login
  const login = async (email, password) => {
    // Simulando uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Verificando credenciais (simulação)
        if (email === "admin@example.com" && password === "password") {
          const userData = {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          resolve({ success: true, user: userData })
        } else if (email === "user@example.com" && password === "password") {
          const userData = {
            id: "2",
            name: "Regular User",
            email: "user@example.com",
            role: "user",
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          resolve({ success: true, user: userData })
        } else {
          resolve({ success: false, message: "Credenciais inválidas" })
        }
      }, 1000)
    })
  }

  // Função para fazer logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Função para registrar um novo usuário
  const register = async (name, email, password) => {
    // Simulando uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role: "user",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        resolve({ success: true, user: userData })
      }, 1000)
    })
  }

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Valor do contexto
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
