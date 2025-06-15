import type {
  SiteCreate,
  SiteRead,
  SiteUpdate,
  TaskResponse,
  TaskStatus,
  ScrapeLogRead,
  ScraperUploadResponse,
  Snapshot,
  TelegramAccount,
} from "@/types/site"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class SiteService {
  // Sites CRUD
  static async getSites(): Promise<SiteRead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar sites")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching sites:", error)
      throw error
    }
  }

  static async getSite(id: number): Promise<SiteRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${id}/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar site")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching site:", error)
      throw error
    }
  }

  static async createSite(site: SiteCreate): Promise<SiteRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(site),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao criar site")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating site:", error)
      throw error
    }
  }

  static async updateSite(id: number, site: SiteUpdate): Promise<SiteRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${id}/`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(site),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar site")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating site:", error)
      throw error
    }
  }

  static async patchSite(id: number, site: Partial<SiteUpdate>): Promise<SiteRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${id}/`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(site),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar site")
      }

      return await response.json()
    } catch (error) {
      console.error("Error patching site:", error)
      throw error
    }
  }

  static async deleteSite(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir site")
      }
    } catch (error) {
      console.error("Error deleting site:", error)
      throw error
    }
  }

  // Scrapers
  static async getAvailableScrapers(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/available/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar scrapers disponíveis")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching available scrapers:", error)
      throw error
    }
  }

  static async uploadScraper(file: File): Promise<ScraperUploadResponse> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/scrapers/upload/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao fazer upload do scraper")
      }

      return await response.json()
    } catch (error) {
      console.error("Error uploading scraper:", error)
      throw error
    }
  }

  static async deleteScraper(slug: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/${slug}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir scraper")
      }
    } catch (error) {
      console.error("Error deleting scraper:", error)
      throw error
    }
  }

  // Tasks
  static async runScraper(siteId: number): Promise<TaskResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/run/${siteId}/`, {
        method: "POST",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao executar scraper")
      }

      return await response.json()
    } catch (error) {
      console.error("Error running scraper:", error)
      throw error
    }
  }

  static async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/tasks/${taskId}/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar status da tarefa")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching task status:", error)
      throw error
    }
  }

  // Logs
  static async getSiteLogs(siteId?: number): Promise<ScrapeLogRead[]> {
    try {
      const url = siteId ? `${API_BASE_URL}/api/scrapers/logs/?site=${siteId}` : `${API_BASE_URL}/api/scrapers/logs/`

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar logs")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching logs:", error)
      throw error
    }
  }

  // Snapshots
  static async getSnapshots(siteId?: number): Promise<Snapshot[]> {
    try {
      const url = siteId
        ? `${API_BASE_URL}/api/scrapers/snapshots/?site=${siteId}`
        : `${API_BASE_URL}/api/scrapers/snapshots/`

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar snapshots")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching snapshots:", error)
      throw error
    }
  }

  // Telegram Accounts
  static async getTelegramAccounts(): Promise<TelegramAccount[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/telegram-accounts/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar contas do Telegram")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching telegram accounts:", error)
      throw error
    }
  }

  static async createTelegramAccount(account: Omit<TelegramAccount, "id">): Promise<TelegramAccount> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/telegram-accounts/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao criar conta do Telegram")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating telegram account:", error)
      throw error
    }
  }
}
