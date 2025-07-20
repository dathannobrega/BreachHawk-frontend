"use client"

import { useState, useEffect } from "react"
import { MonitoringService } from "@/services/monitoring-service"
import type {
  MonitoredResource,
  CreateMonitoredResourceRequest,
  UpdateMonitoredResourceRequest,
  Alert,
  MonitoringStats,
} from "@/types/monitoring"

export function useMonitoredResources() {
  const [resources, setResources] = useState<MonitoredResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Hook: Iniciando busca de recursos...")
      const data = await MonitoringService.getResources()
      console.log("Hook: Recursos carregados:", data)
      setResources(data)
    } catch (err: any) {
      console.error("Hook: Erro ao carregar recursos:", err)
      setError(err.message || "Erro ao carregar recursos")
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (data: CreateMonitoredResourceRequest): Promise<boolean> => {
    try {
      console.log("Hook: Criando recurso:", data)
      const newResource = await MonitoringService.createResource(data)
      console.log("Hook: Recurso criado:", newResource)
      setResources((prev) => [...prev, newResource])
      return true
    } catch (err: any) {
      console.error("Hook: Erro ao criar recurso:", err)
      throw new Error(err.message || "Erro ao criar recurso")
    }
  }

  const updateResource = async (id: number, data: UpdateMonitoredResourceRequest): Promise<boolean> => {
    try {
      console.log("Hook: Atualizando recurso:", { id, data })
      const updatedResource = await MonitoringService.updateResource(id, data)
      console.log("Hook: Recurso atualizado:", updatedResource)
      setResources((prev) => prev.map((r) => (r.id === id ? updatedResource : r)))
      return true
    } catch (err: any) {
      console.error("Hook: Erro ao atualizar recurso:", err)
      throw new Error(err.message || "Erro ao atualizar recurso")
    }
  }

  const deleteResource = async (id: number): Promise<boolean> => {
    try {
      console.log("Hook: Deletando recurso:", id)
      await MonitoringService.deleteResource(id)
      console.log("Hook: Recurso deletado")
      setResources((prev) => prev.filter((r) => r.id !== id))
      return true
    } catch (err: any) {
      console.error("Hook: Erro ao deletar recurso:", err)
      throw new Error(err.message || "Erro ao excluir recurso")
    }
  }

  useEffect(() => {
    console.log("Hook: Componente montado, carregando recursos...")
    fetchResources()
  }, [])

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
    createResource,
    updateResource,
    deleteResource,
  }
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Hook: Iniciando busca de alertas...")
      const data = await MonitoringService.getAlerts()
      console.log("Hook: Alertas carregados:", data)
      setAlerts(data)
    } catch (err: any) {
      console.error("Hook: Erro ao carregar alertas:", err)
      setError(err.message || "Erro ao carregar alertas")
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: number, acknowledged = true): Promise<boolean> => {
    try {
      console.log("Hook: Reconhecendo alerta:", { alertId, acknowledged })
      await MonitoringService.acknowledgeAlert(alertId, acknowledged)
      console.log("Hook: Alerta reconhecido")
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged } : alert)))
      return true
    } catch (err: any) {
      console.error("Hook: Erro ao reconhecer alerta:", err)
      throw new Error(err.message || "Erro ao reconhecer alerta")
    }
  }

  useEffect(() => {
    console.log("Hook: Componente montado, carregando alertas...")
    fetchAlerts()
  }, [])

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    acknowledgeAlert,
  }
}

export function useMonitoringStats() {
  const [stats, setStats] = useState<MonitoringStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Hook: Iniciando busca de estatísticas...")
      const data = await MonitoringService.getStats()
      console.log("Hook: Estatísticas carregadas:", data)
      setStats(data)
    } catch (err: any) {
      console.error("Hook: Erro ao carregar estatísticas:", err)
      setError(err.message || "Erro ao carregar estatísticas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("Hook: Componente montado, carregando estatísticas...")
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
