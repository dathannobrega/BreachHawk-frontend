export interface MonitoredResource {
  id: number
  keyword: string
  created_at: string
}

export interface MonitoredResourceCreate {
  keyword: string
}

export interface MonitoredResourceUpdate {
  keyword: string
}

export interface LeakData {
  id: number
  site: number | null
  company: string
  country: string
  found_at: string
  source_url: string
  views: number | null
  publication_date: string | null
  amount_of_data: string | null
  information: string
  comment: string
  download_links: string | null
  rar_password: string | null
}

export interface Alert {
  id: number
  resource: number
  leak: LeakData
  created_at: string
}

export interface ApiError {
  detail: string
}
