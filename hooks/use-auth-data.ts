"use client"

import { useState, useEffect } from "react"
import { authService } from "@/services/auth-service"
import type { LoginHistoryRead, UserSessionRead } from "@/types/auth"

export function useAuthData() {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRead[]>([])
  const [sessions, setSessions] = useState<UserSessionRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [historyData, sessionsData] = await Promise.all([authService.getLoginHistory(), authService.getSessions()])

      setLoginHistory(historyData)
      setSessions(sessionsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados")
      console.error("Erro ao carregar dados de autenticação:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: number) => {
    try {
      await authService.deleteSession(sessionId)
      // Atualizar a lista removendo a sessão deletada
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar sessão")
      return false
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    loginHistory,
    sessions,
    loading,
    error,
    refetch: fetchData,
    deleteSession,
  }
}
