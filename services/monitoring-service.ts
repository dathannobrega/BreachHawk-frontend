import type { MonitoredResource, MonitoredResourceCreate, MonitoredResourceUpdate, Alert } from "@/types/monitoring"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class MonitoringService {
  // Listar todos os recursos monitorados do usuário
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

  // Consultar recurso específico
  static async getMonitoredResource(id: number): Promise<MonitoredResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/${id}/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Recurso não encontrado ou não pertence ao usuário")
        }
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar recurso")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching monitored resource:", error)
      throw error
    }
  }

  // Criar novo recurso monitorado
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
        if (response.status === 400) {
          throw new Error(error.detail || "Recurso já monitorado")
        }
        throw new Error(error.detail || "Erro ao criar recurso monitorado")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating monitored resource:", error)
      throw error
    }
  }

  // Atualizar recurso monitorado
  static async updateMonitoredResource(id: number, data: MonitoredResourceUpdate): Promise<MonitoredResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/${id}/`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Recurso não encontrado ou não pertence ao usuário")
        }
        const error = await response.json()
        if (response.status === 400) {
          throw new Error(error.detail || "Recurso já monitorado")
        }
        throw new Error(error.detail || "Erro ao atualizar recurso")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating monitored resource:", error)
      throw error
    }
  }

  // Excluir recurso monitorado
  static async deleteMonitoredResource(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitoring/resources/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Recurso não encontrado ou não pertence ao usuário")
        }
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir recurso monitorado")
      }

      // Status 204 não tem corpo de resposta
    } catch (error) {
      console.error("Error deleting monitored resource:", error)
      throw error
    }
  }

  // Listar alertas do usuário
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
