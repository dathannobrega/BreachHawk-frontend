// Atualizar para corresponder exatamente aos schemas Pydantic
export type UserStatus = "active" | "inactive" | "suspended"
export type UserRole = "user" | "admin" | "platform_admin"

export interface PlatformUser {
  id: number
  username?: string | null
  email: string
  first_name?: string | null
  last_name?: string | null
  role: string
  status: UserStatus
  company?: string | null
  job_title?: string | null
  last_login?: string | null
  created_at?: string | null
}

export interface PlatformUserCreate {
  username?: string | null
  email: string
  password: string
  first_name?: string | null
  last_name?: string | null
  role?: UserRole
  status?: UserStatus
  company?: string | null
  job_title?: string | null
}

export interface PlatformUserUpdate {
  username?: string | null
  email?: string | null
  password?: string | null
  first_name?: string | null
  last_name?: string | null
  role?: UserRole | null
  status?: UserStatus | null
  company?: string | null
  job_title?: string | null
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  suspendedUsers: number
}
