export enum AuthType {
  NONE = "none",
  BASIC = "basic",
  FORM = "form",
}

export enum CaptchaType {
  NONE = "none",
  IMAGE = "image",
  MATH = "math",
  ROTATED = "rotated",
}

export enum SiteType {
  FORUM = "forum",
  WEBSITE = "website",
  TELEGRAM = "telegram",
  DISCORD = "discord",
  PASTE = "paste",
}

export interface BypassConfig {
  use_proxies?: boolean
  rotate_user_agent?: boolean
  captcha_solver?: string | null
}

export interface Credentials {
  username?: string
  password?: string
  token?: string | null
}

export interface TelegramAccount {
  id: number
  api_id: number
  api_hash: string
  phone: string
  session_string?: string | null // write-only field
}

export interface TelegramAccountCreate {
  api_id: number
  api_hash: string
  phone: string
  session_string?: string | null
}

export interface TelegramAccountRead {
  id: number
  api_id: number
  api_hash: string
  phone: string
  // session_string não é retornado pelo backend
}

export interface SiteCreate {
  name: string
  url: string
  type: SiteType
  auth_type: AuthType
  captcha_type: CaptchaType
  scraper: string
  needs_js: boolean
  enabled?: boolean
  bypass_config?: BypassConfig | null
  credentials?: Credentials | null
  telegram_account?: number | null
}

export interface SiteRead extends SiteCreate {
  id: number
  created_at: string
  links: SiteLink[]
  telegram_account_details?: TelegramAccountRead | null
}

export interface SiteUpdate {
  name?: string
  url?: string
  type?: SiteType
  auth_type?: AuthType
  captcha_type?: CaptchaType
  scraper?: string
  needs_js?: boolean
  enabled?: boolean
  bypass_config?: BypassConfig | null
  credentials?: Credentials | null
  telegram_account?: number | null
}

export interface SiteLink {
  id: number
  site: number
  url: string
  created_at: string
}

export interface TaskResponse {
  task_id: string
  status: string
}

export interface TaskStatus {
  task_id: string
  status: string
  result?: any
}

export interface ScrapeLogRead {
  id: number
  site: number
  url: string
  success: boolean
  message: string | null
  created_at: string
}

export interface ScraperUploadResponse {
  msg: string
  slug: string
}

export interface Snapshot {
  id: number
  site: number
  taken_at: string
  screenshot: string
  html?: string | null
}
