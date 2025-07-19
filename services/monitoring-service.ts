import { api } from "@/lib/api"
import type {
  MonitoredResource,
  CreateMonitoredResourceRequest,
  UpdateMonitoredResourceRequest,
  Alert,
  MonitoringStats,
} from "@/types/monitoring"

export class MonitoringService {
  // Recursos monitorados
  static async getResources(): Promise<MonitoredResource[]> {
    const response = await api.get("/api/monitoring/resources/")
    return response.data
  }

  static async getResource(id: number): Promise<MonitoredResource> {
    const response = await api.get(`/api/monitoring/resources/${id}/`)
    return response.data
  }

  static async createResource(data: CreateMonitoredResourceRequest): Promise<MonitoredResource> {
    const response = await api.post("/api/monitoring/resources/", data)
    return response.data
  }

  static async updateResource(id: number, data: UpdateMonitoredResourceRequest): Promise<MonitoredResource> {
    const response = await api.put(`/api/monitoring/resources/${id}/`, data)
    return response.data
  }

  static async deleteResource(id: number): Promise<void> {
    await api.delete(`/api/monitoring/resources/${id}/`)
  }

  // Alertas - integração com as APIs fornecidas
  static async getAlerts(): Promise<Alert[]> {
    const response = await api.get("/api/monitoring/alerts/")
    return response.data
  }

  // Reconhecer alerta
  static async acknowledgeAlert(alertId: number, acknowledged = true): Promise<{ acknowledged: boolean }> {
    const response = await api.patch(`/api/monitoring/alerts/${alertId}/ack/`, {
      acknowledged,
    })
    return response.data
  }

  // Estatísticas (calculadas a partir dos dados)
  static async getStats(): Promise<MonitoringStats> {
    const [resources, alerts] = await Promise.all([this.getResources(), this.getAlerts()])

    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const alertsLast24h = alerts.filter((alert) => new Date(alert.created_at) >= last24h).length
    const alertsLast7days = alerts.filter((alert) => new Date(alert.created_at) >= last7days).length

    return {
      total_resources: resources.length,
      total_alerts: alerts.length,
      alerts_last_7_days: alertsLast7days,
      alerts_last_24h: alertsLast24h,
    }
  }
}
