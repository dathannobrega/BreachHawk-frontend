export interface SMTPConfig {
  id?: number
  host: string
  port: number
  username: string
  password?: string
  from_email: string
  created_at?: string
  updated_at?: string
}

export interface SMTPConfigRead extends Omit<SMTPConfig, "password"> {
  password?: string
}

export interface SMTPConfigUpdate extends SMTPConfig {}

export interface TestEmailRequest {
  to_email: string
}

export interface TestEmailResponse {
  success: boolean
}
