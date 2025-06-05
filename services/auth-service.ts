import type { LoginHistoryRead, UserSessionRead } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class AuthService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    // Para DELETE requests que retornam 204, não há conteúdo para parsear
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async getLoginHistory(): Promise<LoginHistoryRead[]> {
    return this.makeRequest<LoginHistoryRead[]>("/api/v1/auth/login-history")
  }

  async getSessions(): Promise<UserSessionRead[]> {
    return this.makeRequest<UserSessionRead[]>("/api/v1/auth/sessions")
  }

  async deleteSession(sessionId: number): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/api/v1/auth/sessions/${sessionId}`, {
      method: "DELETE",
    })
  }

  async uploadProfileImage(file: File): Promise<any> {
    const token = localStorage.getItem("access_token")
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Métodos utilitários
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  formatTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`

    return this.formatDate(dateString)
  }

  parseUserAgent(userAgent?: string | null): { browser: string; os: string } {
    if (!userAgent) return { browser: "Desconhecido", os: "Desconhecido" }

    let browser = "Desconhecido"
    let os = "Desconhecido"

    // Detectar browser
    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"

    // Detectar OS
    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS")) os = "iOS"

    return { browser, os }
  }

  getLocationDisplay(location?: string | null): string {
    return location || "Localização desconhecida"
  }
}

export const authService = new AuthService()
