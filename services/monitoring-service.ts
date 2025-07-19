import type { MonitoredResource, MonitoredResourceCreate, Alert } from "@/types/monitoring"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class MonitoringService {
  // Recursos Monitorados
  static async getMonitoredResources(): Promise<MonitoredResource[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar recursos monitorados")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching monitored resources:", error)
      throw error
    }
  }

  static async createMonitoredResource(data: MonitoredResourceCreate): Promise<MonitoredResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao criar recurso monitorado")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating monitored resource:", error)
      throw error
    }
  }

  static async deleteMonitoredResource(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir recurso monitorado")
      }
    } catch (error) {
      console.error("Error deleting monitored resource:", error)
      throw error
    }
  }

  // Alertas
  static async getAlerts(): Promise<Alert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/alerts/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar alertas")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching alerts:", error)
      throw error
    }
  }
}
