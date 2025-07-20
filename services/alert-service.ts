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
  count: number
  next: string | null
  previous: string | null
  results: Alert[]
}

export interface AlertStats {
  total: number
  acknowledged: number
  unacknowledged: number
  critical: number
  high: number
  medium: number
  low: number
}

export class AlertService {
  static async getAlerts(params?: {
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
  }

  static async acknowledgeAlert(alertId: number, acknowledged = true): Promise<{ acknowledged: boolean }> {
    const response = await api.patch(`/api/monitoring/alerts/${alertId}/ack/`, {
      acknowledged,
    })
    return response.data
  }

  static async getAlertStats(): Promise<AlertStats> {
    // This would be a separate endpoint for statistics
    // For now, we'll calculate from the alerts list
    const alerts = await this.getAlerts({ page_size: 1000 })

    const stats: AlertStats = {
      total: alerts.count,
      acknowledged: 0,
      unacknowledged: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    alerts.results.forEach((alert) => {
      if (alert.acknowledged) {
        stats.acknowledged++
      } else {
        stats.unacknowledged++
      }

      // Classify severity based on content
      const content = `${alert.leak.information || ""} ${alert.leak.comment || ""}`.toLowerCase()
      const criticalKeywords = ["password", "credit", "admin", "root", "database", "api", "token"]
      const highKeywords = ["email", "personal", "phone", "address", "user", "account"]
      const mediumKeywords = ["data", "info", "file", "document"]

      if (criticalKeywords.some((keyword) => content.includes(keyword))) {
        stats.critical++
      } else if (highKeywords.some((keyword) => content.includes(keyword))) {
        stats.high++
      } else if (mediumKeywords.some((keyword) => content.includes(keyword))) {
        stats.medium++
      } else {
        stats.low++
      }
    })

    return stats
  }
}
