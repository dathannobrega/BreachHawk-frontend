import { api } from "@/lib/api"
import type {
  MonitoredResource,
  CreateMonitoredResourceRequest,
  UpdateMonitoredResourceRequest,
  Alert,
  MonitoringStats,
  AcknowledgeAlertRequest,
  AcknowledgeAlertResponse,
} from "@/types/monitoring"

export class MonitoringService {
  // Recursos monitorados
  static async getResources(): Promise<MonitoredResource[]> {
    try {
      console.log("Buscando recursos monitorados...")
      const response = await api.get("/api/monitoring/resources/")
      console.log("Recursos encontrados:", response.data)
      return response.data || []
    } catch (error: any) {
      console.error("Erro ao buscar recursos:", error)
      throw error
    }
  }

  static async getResource(id: number): Promise<MonitoredResource> {
    try {
      console.log("Buscando recurso:", id)
      const response = await api.get(`/api/monitoring/resources/${id}/`)
      console.log("Recurso encontrado:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao buscar recurso:", error)
      throw error
    }
  }

  static async createResource(data: CreateMonitoredResourceRequest): Promise<MonitoredResource> {
    try {
      console.log("Criando recurso:", data)
      const response = await api.post("/api/monitoring/resources/", data)
      console.log("Recurso criado:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao criar recurso:", error)
      throw error
    }
  }

  static async updateResource(id: number, data: UpdateMonitoredResourceRequest): Promise<MonitoredResource> {
    try {
      console.log("Atualizando recurso:", { id, data })
      const response = await api.put(`/api/monitoring/resources/${id}/`, data)
      console.log("Recurso atualizado:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao atualizar recurso:", error)
      throw error
    }
  }

  static async deleteResource(id: number): Promise<void> {
    try {
      console.log("Deletando recurso:", id)
      await api.delete(`/api/monitoring/resources/${id}/`)
      console.log("Recurso deletado com sucesso")
    } catch (error: any) {
      console.error("Erro ao deletar recurso:", error)
      throw error
    }
  }

  // Alertas
  static async getAlerts(): Promise<Alert[]> {
    try {
      console.log("Buscando alertas...")
      const response = await api.get("/api/monitoring/alerts/")
      console.log("Alertas encontrados:", response.data)
      return response.data || []
    } catch (error: any) {
      console.error("Erro ao buscar alertas:", error)
      throw error
    }
  }

  // Reconhecer alerta
  static async acknowledgeAlert(alertId: number, acknowledged = true): Promise<AcknowledgeAlertResponse> {
    try {
      console.log("Reconhecendo alerta:", { alertId, acknowledged })
      const response = await api.patch(`/api/monitoring/alerts/${alertId}/ack/`, {
        acknowledged,
      } as AcknowledgeAlertRequest)
      console.log("Alerta reconhecido:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao reconhecer alerta:", error)
      throw error
    }
  }

  // Estatísticas (calculadas a partir dos dados)
  static async getStats(): Promise<MonitoringStats> {
    try {
      console.log("Calculando estatísticas...")
      const [resources, alerts] = await Promise.all([this.getResources(), this.getAlerts()])

      const now = new Date()
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const alertsLast24h = alerts.filter((alert) => new Date(alert.created_at) >= last24h).length
      const alertsLast7days = alerts.filter((alert) => new Date(alert.created_at) >= last7days).length

      const stats = {
        total_resources: resources.length,
        total_alerts: alerts.length,
        alerts_last_7_days: alertsLast7days,
        alerts_last_24h: alertsLast24h,
      }

      console.log("Estatísticas calculadas:", stats)
      return stats
    } catch (error: any) {
      console.error("Erro ao calcular estatísticas:", error)
      throw error
    }
  }
}
