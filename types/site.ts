export interface SiteUrl {
  id?: number
  url: string
  is_primary: boolean
}

export interface Site {
  id?: number
  name: string
  urls: SiteUrl[]
  scraper_name: string
  scraper_file?: string
  enabled: boolean
  created_at?: string
  updated_at?: string
  auth_type?: "none" | "basic" | "form"
  captcha_type?: "none" | "image" | "math" | "rotated"
  needs_js?: boolean
}

export interface SiteFormData {
  name: string
  urls: { url: string; is_primary: boolean }[]
  scraper_name: string
  scraper_file?: File
  enabled: boolean
  auth_type: "none" | "basic" | "form"
  captcha_type: "none" | "image" | "math" | "rotated"
  needs_js: boolean
}

export interface SiteResponse {
  id: number
  name: string
  urls: SiteUrl[]
  scraper_name: string
  scraper_file_name?: string
  enabled: boolean
  created_at: string
  updated_at: string
  auth_type: "none" | "basic" | "form"
  captcha_type: "none" | "image" | "math" | "rotated"
  needs_js: boolean
}

export interface SiteListResponse {
  items: SiteResponse[]
  total: number
  page: number
  size: number
  pages: number
}
