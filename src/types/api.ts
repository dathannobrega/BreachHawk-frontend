export interface ApiResponse<T> {
  data: T
  message?: string
  status: "success" | "error"
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ThreatData {
  id: string
  type: "malware" | "phishing" | "data_breach" | "vulnerability"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  source: string
  detectedAt: string
  indicators: string[]
}
