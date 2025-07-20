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
      const data = await MonitoringService.getResources()
      setResources(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao carregar recursos")
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (data: CreateMonitoredResourceRequest): Promise<boolean> => {
    try {
      const newResource = await MonitoringService.createResource(data)
      setResources((prev) => [...prev, newResource])
      return true
    } catch (err: any) {
      if (err.response?.status === 400) {
        throw new Error(err.response.data.detail || "Recurso já monitorado")
      }
      throw new Error("Erro ao criar recurso")
    }
  }

  const updateResource = async (id: number, data: UpdateMonitoredResourceRequest): Promise<boolean> => {
    try {
      const updatedResource = await MonitoringService.updateResource(id, data)
      setResources((prev) => prev.map((r) => (r.id === id ? updatedResource : r)))
      return true
    } catch (err: any) {
      if (err.response?.status === 400) {
        throw new Error(err.response.data.detail || "Recurso já monitorado")
      }
      if (err.response?.status === 404) {
        throw new Error("Recurso não encontrado")
      }
      throw new Error("Erro ao atualizar recurso")
    }
  }

  const deleteResource = async (id: number): Promise<boolean> => {
    try {
      await MonitoringService.deleteResource(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
      return true
    } catch (err: any) {
      if (err.response?.status === 404) {
        throw new Error("Recurso não encontrado")
      }
      throw new Error("Erro ao excluir recurso")
    }
  }

  useEffect(() => {
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
      const data = await MonitoringService.getAlerts()
      setAlerts(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao carregar alertas")
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: number, acknowledged = true): Promise<boolean> => {
    try {
      await MonitoringService.acknowledgeAlert(alertId, acknowledged)
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged } : alert)))
      return true
    } catch (err: any) {
      throw new Error("Erro ao reconhecer alerta")
    }
  }

  useEffect(() => {
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
      const data = await MonitoringService.getStats()
      setStats(data)
    } catch (err: any) {
      setError("Erro ao carregar estatísticas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

/**
 * Hook unificado que reúne recursos, alertas e estatísticas
 * de monitoramento em um único objeto.
 */
export function useMonitoring() {
  const resourcesCtx = useMonitoredResources()
  const alertsCtx = useAlerts()
  const statsCtx = useMonitoringStats()

  return {
    ...resourcesCtx,
    ...alertsCtx,
    ...statsCtx,
  }
}
