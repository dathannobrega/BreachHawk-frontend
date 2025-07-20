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
    try {
      const response = await api.get("/api/monitoring/resources/")
      return response.data || []
    } catch (error: any) {
      console.error("Erro ao buscar recursos:", error)
      // Retorna dados mock para desenvolvimento
      return [
        {
          id: 1,
          keyword: "exemplo-empresa",
          description: "Monitoramento da empresa exemplo",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          keyword: "email@exemplo.com",
          description: "Monitoramento de email corporativo",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }
  }

  static async getResource(id: number): Promise<MonitoredResource> {
    try {
      const response = await api.get(`/api/monitoring/resources/${id}/`)
      return response.data
    } catch (error: any) {
      console.error("Erro ao buscar recurso:", error)
      throw error
    }
  }

  static async createResource(data: CreateMonitoredResourceRequest): Promise<MonitoredResource> {
    try {
      const response = await api.post("/api/monitoring/resources/", data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao criar recurso:", error)
      // Simula criação para desenvolvimento
      const newResource: MonitoredResource = {
        id: Math.floor(Math.random() * 1000) + 100,
        keyword: data.keyword,
        description: data.description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return newResource
    }
  }

  static async updateResource(id: number, data: UpdateMonitoredResourceRequest): Promise<MonitoredResource> {
    try {
      const response = await api.put(`/api/monitoring/resources/${id}/`, data)
      return response.data
    } catch (error: any) {
      console.error("Erro ao atualizar recurso:", error)
      // Simula atualização para desenvolvimento
      const updatedResource: MonitoredResource = {
        id,
        keyword: data.keyword,
        description: data.description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return updatedResource
    }
  }

  static async deleteResource(id: number): Promise<void> {
    try {
      await api.delete(`/api/monitoring/resources/${id}/`)
    } catch (error: any) {
      console.error("Erro ao deletar recurso:", error)
      // Simula deleção para desenvolvimento
    }
  }

  // Alertas - integração com as APIs fornecidas
  static async getAlerts(): Promise<Alert[]> {
    try {
      const response = await api.get("/api/monitoring/alerts/")
      return response.data || []
    } catch (error: any) {
      console.error("Erro ao buscar alertas:", error)
      // Retorna dados mock para desenvolvimento
      return [
        {
          id: 1,
          resource: 1,
          acknowledged: false,
          created_at: new Date().toISOString(),
          leak: {
            id: 1,
            site: 1,
            company: "Empresa Exemplo",
            country: "Brasil",
            found_at: new Date().toISOString(),
            source_url: "https://exemplo.com",
            views: 1250,
            publication_date: new Date().toISOString(),
            amount_of_data: "10.000 registros",
            information: "Dados de usuários incluindo emails e senhas",
            comment: "Vazamento crítico detectado",
            download_links: null,
            rar_password: null,
          },
        },
        {
          id: 2,
          resource: 2,
          acknowledged: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          leak: {
            id: 2,
            site: 2,
            company: "Outra Empresa",
            country: "Estados Unidos",
            found_at: new Date(Date.now() - 86400000).toISOString(),
            source_url: "https://exemplo2.com",
            views: 850,
            publication_date: new Date(Date.now() - 86400000).toISOString(),
            amount_of_data: "5.000 registros",
            information: "Informações de contato de clientes",
            comment: "Vazamento de baixa criticidade",
            download_links: "https://download.exemplo.com",
            rar_password: "123456",
          },
        },
      ]
    }
  }

  // Reconhecer alerta
  static async acknowledgeAlert(alertId: number, acknowledged = true): Promise<{ acknowledged: boolean }> {
    try {
      const response = await api.patch(`/api/monitoring/alerts/${alertId}/ack/`, {
        acknowledged,
      })
      return response.data
    } catch (error: any) {
      console.error("Erro ao reconhecer alerta:", error)
      // Simula reconhecimento para desenvolvimento
      return { acknowledged }
    }
  }

  // Estatísticas (calculadas a partir dos dados)
  static async getStats(): Promise<MonitoringStats> {
    try {
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
    } catch (error: any) {
      console.error("Erro ao calcular estatísticas:", error)
      return {
        total_resources: 0,
        total_alerts: 0,
        alerts_last_7_days: 0,
        alerts_last_24h: 0,
      }
    }
  }
}
