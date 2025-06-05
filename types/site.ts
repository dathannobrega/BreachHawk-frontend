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

export interface SiteCreate {
  name: string
  links: string[]
  auth_type: AuthType
  captcha_type: CaptchaType
  scraper: string
  needs_js: boolean
}

export interface SiteRead extends SiteCreate {
  id: number
}

export interface SiteUpdate {
  name?: string
  links?: string[]
  auth_type?: AuthType
  captcha_type?: CaptchaType
  scraper?: string
  needs_js?: boolean
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
  site_id: number
  url: string
  success: boolean
  message: string | null
  created_at: string
}

export interface ScraperUploadResponse {
  msg: string
  slug: string
}
