export interface LoginHistoryRead {
  id: number
  user_id: number
  ip_address: string
  user_agent?: string | null
  location?: string | null
  success: boolean
  timestamp: string
}

export interface UserSessionRead {
  id: number
  user_id: number
  session_token: string
  ip_address: string
  user_agent?: string | null
  location?: string | null
  is_active: boolean
  created_at: string
  last_activity?: string | null
  expires_at?: string | null
}
