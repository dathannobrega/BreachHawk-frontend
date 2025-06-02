import { APP_CONFIG } from "@/config/app"
import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/types/auth"
import type { GoogleUser } from "./auth-google"

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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Request failed" }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async googleAuth(googleUser: GoogleUser): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        google_id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        given_name: googleUser.given_name,
        family_name: googleUser.family_name,
      }),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me")
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" })
  }

  // Search endpoints
  async searchLeaks(query: string, type: string): Promise<any> {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`)
  }

  // Sites endpoints
  async getSites(): Promise<any> {
    return this.request("/sites")
  }

  async createSite(siteData: any): Promise<any> {
    return this.request("/sites", {
      method: "POST",
      body: JSON.stringify(siteData),
    })
  }

  async updateSite(id: string, siteData: any): Promise<any> {
    return this.request(`/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify(siteData),
    })
  }

  async deleteSite(id: string): Promise<void> {
    await this.request(`/sites/${id}`, { method: "DELETE" })
  }

  // Leaks endpoints
  async getLeaks(): Promise<any> {
    return this.request("/leaks")
  }

  async updateLeak(id: string, data: any): Promise<any> {
    return this.request(`/leaks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Tasks endpoints
  async getTasks(): Promise<any> {
    return this.request("/tasks")
  }

  async updateTask(id: string, data: any): Promise<any> {
    return this.request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Scrape runs endpoints
  async getScrapeRuns(): Promise<any> {
    return this.request("/scrape-runs")
  }

  async createScrapeRun(data: any): Promise<any> {
    return this.request("/scrape-runs", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Settings endpoints
  async getSettings(): Promise<any> {
    return this.request("/settings")
  }

  async updateSettings(data: any): Promise<any> {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(APP_CONFIG.API.BASE_URL)
