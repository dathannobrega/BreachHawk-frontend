export interface LeakResult {
  site_id: number
  company: string
  source_url: string
  found_at: string
  country?: string | null
  views?: number | null
  publication_date?: string | null
  amount_of_data?: string | null
  information?: string | null
  comment?: string | null
  download_links?: string | null
  rar_password?: string | null
}

export interface LeakSearchResponse {
  results: LeakResult[]
}

export interface LeakSearchError {
  detail: string
}
