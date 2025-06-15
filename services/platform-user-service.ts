import type { PlatformUser, PlatformUserCreate, PlatformUserUpdate, UserStats } from "@/types/platform-user"
import type { LoginHistoryRead, UserSessionRead } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class PlatformUserService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}/api/accounts/platform-users${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
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

  async getUsers(): Promise<PlatformUser[]> {
    return this.makeRequest<PlatformUser[]>("/")
  }

  async getUser(id: number): Promise<PlatformUser> {
    return this.makeRequest<PlatformUser>(`/${id}/`)
  }

  async getUserLoginHistory(id: number): Promise<LoginHistoryRead[]> {
    return this.makeRequest<LoginHistoryRead[]>(`/${id}/login-history/`)
  }

  async getUserSessions(id: number): Promise<UserSessionRead[]> {
    return this.makeRequest<UserSessionRead[]>(`/${id}/sessions/`)
  }

  async createUser(data: PlatformUserCreate): Promise<PlatformUser> {
    return this.makeRequest<PlatformUser>("/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: number, data: PlatformUserUpdate): Promise<PlatformUser> {
    return this.makeRequest<PlatformUser>(`/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: number): Promise<void> {
    await this.makeRequest<void>(`/${id}/`, {
      method: "DELETE",
    })
  }

  // Método para calcular estatísticas baseado nos dados
  calculateStats(users: PlatformUser[]): UserStats {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "active").length
    const adminUsers = users.filter((u) => u.role === "admin" || u.role === "platform_admin").length
    const suspendedUsers = users.filter((u) => u.status === "suspended").length

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      suspendedUsers,
    }
  }

  // Métodos utilitários
  formatDate(dateString?: string | null): string {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  formatDateTime(dateString?: string | null): string {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("pt-BR")
  }

  getFullName(user: PlatformUser): string {
    const firstName = user.first_name || ""
    const lastName = user.last_name || ""
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || user.username || user.email
  }

  getDisplayName(user: PlatformUser): string {
    return user.username || user.email
  }

  translateRole(role: string): string {
    const roleMap: Record<string, string> = {
      user: "Usuário",
      admin: "Administrador",
      platform_admin: "Admin da Plataforma",
    }
    return roleMap[role] || role
  }

  translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso",
    }
    return statusMap[status] || status
  }

  getRoleColor(role: string): string {
    const colorMap: Record<string, string> = {
      user: "text-gray-500",
      admin: "text-blue-500",
      platform_admin: "text-purple-500",
    }
    return colorMap[role] || "text-gray-500"
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      suspended: "bg-red-500",
    }
    return colorMap[status] || "bg-gray-500"
  }

  getRoleIcon(role: string): string {
    const iconMap: Record<string, string> = {
      user: "Users",
      admin: "UserCheck",
      platform_admin: "Crown",
    }
    return iconMap[role] || "Users"
  }

  // Método para validar dados antes do envio
  validateUserData(data: PlatformUserCreate | PlatformUserUpdate): string[] {
    const errors: string[] = []

    if ("email" in data && data.email && !data.email.includes("@")) {
      errors.push("Email deve ser válido")
    }

    if ("username" in data && data.username && data.username.length < 3) {
      errors.push("Username deve ter pelo menos 3 caracteres")
    }

    if ("password" in data && data.password && data.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres")
    }

    return errors
  }

  // Método para limpar dados antes do envio (remover campos vazios)
  cleanUserData(data: PlatformUserCreate | PlatformUserUpdate): any {
    const cleaned: any = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        cleaned[key] = value
      }
    })

    return cleaned
  }

  // Métodos utilitários para histórico de login e sessões
  parseDevice(device?: string | null): { browser: string; os: string; icon: string } {
    if (!device) return { browser: "Desconhecido", os: "Desconhecido", icon: "Monitor" }

    const browser = device.includes("Chrome")
      ? "Chrome"
      : device.includes("Firefox")
        ? "Firefox"
        : device.includes("Safari")
          ? "Safari"
          : device.includes("Edge")
            ? "Edge"
            : "Desconhecido"

    const os = device.includes("Windows")
      ? "Windows"
      : device.includes("macOS")
        ? "macOS"
        : device.includes("Linux")
          ? "Linux"
          : device.includes("Android")
            ? "Android"
            : device.includes("iOS")
              ? "iOS"
              : "Desconhecido"

    const icon =
      device.includes("Mobile") || device.includes("Android") || device.includes("iOS") ? "Smartphone" : "Monitor"

    return { browser, os, icon }
  }

  isSessionExpired(session: UserSessionRead): boolean {
    if (!session.expires_at) return false
    return new Date(session.expires_at) < new Date()
  }

  getLoginStatusColor(success: boolean): string {
    return success ? "text-green-600" : "text-red-600"
  }

  getLoginStatusIcon(success: boolean): string {
    return success ? "CheckCircle" : "XCircle"
  }

  getSessionStatusColor(session: UserSessionRead): string {
    return this.isSessionExpired(session) ? "text-red-600" : "text-green-600"
  }

  getSessionStatusText(session: UserSessionRead): string {
    return this.isSessionExpired(session) ? "Expirada" : "Ativa"
  }
}

export const platformUserService = new PlatformUserService()
