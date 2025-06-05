export interface LoginHistory {
  id: number
  user_id: number
  ip_address?: string | null
  user_agent?: string | null
  location?: string | null
  timestamp: string
  success: boolean
}

export interface UserSession {
  id: number
  user_id: number
  session_token: string
  ip_address?: string | null
  user_agent?: string | null
  location?: string | null
  created_at: string
  last_activity?: string | null
  is_active: boolean
}

export interface LoginHistoryRead extends LoginHistory {}
export interface UserSessionRead extends UserSession {}
