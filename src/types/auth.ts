export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "analyst" | "viewer"
  avatar?: string
  createdAt: string
  lastLogin?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiError {
  detail: string
  code?: string
}
