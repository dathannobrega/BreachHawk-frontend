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
    return this.makeRequest<LoginHistoryRead[]>("/api/accounts/login-history/")
  }

  async getSessions(): Promise<UserSessionRead[]> {
    return this.makeRequest<UserSessionRead[]>("/api/accounts/sessions/")
  }

  async deleteSession(sessionId: number): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/api/accounts/sessions/${sessionId}`, {
      method: "DELETE",
    })
  }

  async uploadProfileImage(file: File): Promise<any> {
    const token = localStorage.getItem("access_token")
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/api/accounts/me/profile-image/`, {
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

  parseDevice(device?: string | null): { browser: string; os: string } {
    if (!device) return { browser: "Desconhecido", os: "Desconhecido" }

    let browser = "Desconhecido"
    let os = "Desconhecido"

    // Detectar browser
    if (device.includes("Chrome")) browser = "Chrome"
    else if (device.includes("Firefox")) browser = "Firefox"
    else if (device.includes("Safari")) browser = "Safari"
    else if (device.includes("Edge")) browser = "Edge"

    // Detectar OS
    if (device.includes("Windows")) os = "Windows"
    else if (device.includes("Mac")) os = "macOS"
    else if (device.includes("Linux")) os = "Linux"
    else if (device.includes("Android")) os = "Android"
    else if (device.includes("iOS")) os = "iOS"

    return { browser, os }
  }

  getLocationDisplay(location?: string | null): string {
    return location || "Localização desconhecida"
  }

  isSessionExpired(expiresAt?: string | null): boolean {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  getDeviceIcon(device?: string | null): "desktop" | "mobile" {
    if (!device) return "desktop"
    if (device.includes("Mobile") || device.includes("Android") || device.includes("iPhone")) {
      return "mobile"
    }
    return "desktop"
  }
}

export const authService = new AuthService()
