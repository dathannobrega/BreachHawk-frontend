// /context/AuthContext.jsx
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Cria o contexto
const AuthContext = createContext()

// Hook para usar o contexto em qualquer componente
export const useAuth = () => {
  return useContext(AuthContext)
}

// Provedor (Provider) do contexto
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  // Estado principal: usuário e se estamos carregando
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Função interna: atualiza o estado de "usuário autenticado" a partir de um token
  const fetchUserFromToken = async (token) => {
    try {
      const resp = await fetch(`${apiUrl}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resp.ok) {
        // Token inválido ou expirado: limpa tudo
        throw new Error("Token inválido ou expirado")
      }

      const data = await resp.json()
      // Esperamos que o backend retorne algo como: { id, name, email, role, ... }
      setUser(data)
      return data
    } catch (err) {
      console.warn("Erro ao buscar usuário a partir do token:", err.message)
      // Se falhar, garante que não fique token inválido no localStorage
      localStorage.removeItem("access_token")
      setUser(null)
      return null
    }
  }

  /**
   * login(params)
   *  - Se receber `{ email, password }`, faz POST /api/v1/auth/login
   *  - Se receber `{ token }`, armazena o token e busca o usuário em /api/v1/auth/me
   *
   * Em ambos os casos, no final da chamada bem-sucedida, o `user` ficará preenchido e
   * `localStorage.setItem("access_token", token)` já terá sido chamado.
   */
  const login = async (params) => {
    setLoading(true)

    try {
      let token = null
      let userData = null

      // 1) Se vier { token }, é porque é login via Google (callback do OAuth)
      if (params.token) {
        token = params.token
        localStorage.setItem("access_token", token)

        // Busca o usuário (endereço: GET /api/v1/auth/me)
        userData = await fetchUserFromToken(token)
        if (!userData) {
          throw new Error("Não foi possível recuperar usuário a partir do token.")
        }
      }
      // 2) Se vier { email, password }, é login “tradicional”
      else if (params.email && params.password) {
        const resp = await fetch(`${apiUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: params.email,
            password: params.password,
          }),
        })

        if (!resp.ok) {
          const errJson = await resp.json().catch(() => null)
          throw new Error(errJson?.detail || "Falha no login. Verifique suas credenciais.")
        }

        const data = await resp.json()
        // Supondo que venha: { access_token: "...", user: { id, name, email, role } }
        token = data.access_token
        userData = data.user

        localStorage.setItem("access_token", token)
        setUser(userData)
      } else {
        throw new Error("Parâmetros de login inválidos.")
      }

      return { success: true, user: userData }
    } catch (err) {
      console.error("Erro em AuthContext.login:", err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * register(params)
   *  - Chama POST /api/v1/auth/register
   *  - Espera resposta { access_token, user }
   *  - Armazena token, atualiza `user` e retorna objeto
   */
  const register = async ({ name, email, password, first_name, last_name, company, job_title, plan }) => {
    setLoading(true)

    try {
      const resp = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          first_name,
          last_name,
          company,
          job_title,
          plan,
        }),
      })

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => null)
        throw new Error(errJson?.detail || "Falha no registro.")
      }

      const data = await resp.json()
      // Esperamos { access_token, user }
      const token = data.access_token
      const userData = data.user

      localStorage.setItem("access_token", token)
      setUser(userData)

      return { success: true, user: userData }
    } catch (err) {
      console.error("Erro em AuthContext.register:", err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // remove token e usuário
  const logout = () => {
    setUser(null)
    localStorage.removeItem("access_token")
    // Se quiser redirecionar ao deslogar, pode descomentar a linha abaixo:
    // navigate("/login", { replace: true })
  }

  // Na montagem do Provider, verifica se já existe um token em localStorage:
  //    se existir, tenta buscar o usuário via /api/v1/auth/me
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token")
      if (storedToken) {
        await fetchUserFromToken(storedToken)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Valor que ficará disponível em todos os componentes via `useAuth()`
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
