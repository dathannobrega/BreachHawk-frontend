import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/types/auth"
import type { ApiResponse } from "@/types/api"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Request failed")
      }

      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    return response.data
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>("/auth/me")
    return response.data
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
