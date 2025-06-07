export interface LoginHistoryRead {
  id: number
  user_id: number
  timestamp: string
  device?: string | null
  ip_address?: string | null
  location?: string | null
  success: boolean
}

export interface UserSessionRead {
  id: number
  user_id: number
  token: string
  device?: string | null
  ip_address?: string | null
  location?: string | null
  created_at: string
  expires_at?: string | null
}
