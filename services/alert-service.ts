import { api } from "@/lib/api"

export interface Alert {
  id: number
  resource: number
  leak: {
    id: number
    site: string | null
    company: string
    country: string | null
    found_at: string
    source_url: string
    views: number | null
    publication_date: string | null
    amount_of_data: string | null
    information: string | null
    comment: string | null
    download_links: string | null
    rar_password: string | null
  }
  acknowledged: boolean
  created_at: string
}

export interface AlertsResponse {
  results: Alert[]
  count: number
  next: string | null
  previous: string | null
}

export const alertService = {
  // Listar alertas
  async getAlerts(params?: {
    page?: number
    page_size?: number
    acknowledged?: boolean
    search?: string
  }): Promise<AlertsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.page_size) searchParams.append("page_size", params.page_size.toString())
    if (params?.acknowledged !== undefined) searchParams.append("acknowledged", params.acknowledged.toString())
    if (params?.search) searchParams.append("search", params.search)

    const response = await api.get(`/api/monitoring/alerts/?${searchParams.toString()}`)
    return response.data
  },

  // Reconhecer/desmarcar alerta
  async acknowledgeAlert(alertId: number, acknowledged: boolean): Promise<{ acknowledged: boolean }> {
    const response = await api.patch(`/api/monitoring/alerts/${alertId}/ack/`, {
      acknowledged,
    })
    return response.data
  },

  // Estatísticas de alertas
  async getAlertStats(): Promise<{
    total: number
    acknowledged: number
    unacknowledged: number
    recent: number
  }> {
    const response = await api.get("/api/monitoring/alerts/stats/")
    return response.data
  },
}
