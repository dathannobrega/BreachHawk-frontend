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

export interface SiteUrl {
  url: string
  is_primary?: boolean
}

export interface SiteCreate {
  links: string[]
  auth_type: AuthType
  captcha_type: CaptchaType
  scraper: string
  needs_js: boolean
}

export interface SiteRead extends SiteCreate {
  id: number
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

export interface ScraperInfo {
  name: string
  description?: string
}
