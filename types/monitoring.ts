export interface MonitoredResource {
  id: number
  keyword: string
  created_at: string
}

export interface CreateMonitoredResourceRequest {
  keyword: string
}

export interface UpdateMonitoredResourceRequest {
  keyword: string
}

export interface LeakData {
  id: number
  site: number | null
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

export interface Alert {
  id: number
  resource: number
  leak: LeakData
  acknowledged: boolean
  created_at: string
}

export interface MonitoringStats {
  total_resources: number
  total_alerts: number
  alerts_last_7_days: number
  alerts_last_24h: number
}

export interface AcknowledgeAlertRequest {
  acknowledged: boolean
}

export interface AcknowledgeAlertResponse {
  acknowledged: boolean
}
