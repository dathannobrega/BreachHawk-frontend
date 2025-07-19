"use client"

import { useState, useEffect } from "react"
import { MonitoringService } from "@/services/monitoring-service"
import type { MonitoredResource, MonitoredResourceCreate, MonitoredResourceUpdate, Alert } from "@/types/monitoring"

export function useMonitoredResources() {
  const [resources, setResources] = useState<MonitoredResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MonitoringService.getMonitoredResources()
      setResources(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (data: MonitoredResourceCreate) => {
    try {
      const newResource = await MonitoringService.createMonitoredResource(data)
      setResources((prev) => [newResource, ...prev])
      return newResource
    } catch (err) {
      throw err
    }
  }

  const updateResource = async (id: number, data: MonitoredResourceUpdate) => {
    try {
      const updatedResource = await MonitoringService.updateMonitoredResource(id, data)
      setResources((prev) => prev.map((resource) => (resource.id === id ? updatedResource : resource)))
      return updatedResource
    } catch (err) {
      throw err
    }
  }

  const deleteResource = async (id: number) => {
    try {
      await MonitoringService.deleteMonitoredResource(id)
      setResources((prev) => prev.filter((resource) => resource.id !== id))
    } catch (err) {
      throw err
    }
  }

  const getResource = async (id: number) => {
    try {
      return await MonitoringService.getMonitoredResource(id)
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return {
    resources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    getResource,
    refetch: fetchResources,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
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
  }
}
