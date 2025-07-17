import type {
  SiteCreate,
  SiteRead,
  SiteUpdate,
  TaskResponse,
  TaskStatus,
  ScrapeLogRead,
  ScraperUploadResponse,
  Snapshot,
  TelegramAccountCreate,
  TelegramAccountRead,
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
      // Garantir que links seja um array válido
      const siteData = {
        ...site,
        links: site.links || [],
      }

      const response = await fetch(`${API_BASE_URL}/api/sites/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(siteData),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Site creation error:", error)
        throw new Error(error.detail || JSON.stringify(error) || "Erro ao criar site")
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
      const response = await fetch(`${API_BASE_URL}/api/scrapers/scrapers/`, {
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
      // Validação no frontend
      if (!file.name.endsWith(".py")) {
        throw new Error("Apenas arquivos .py são aceitos")
      }

      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_BASE_URL}/api/scrapers/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Não incluir Content-Type para FormData - o browser define automaticamente
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()

        // Tratamento específico dos erros do backend
        if (response.status === 400) {
          if (error.detail === "No file provided") {
            throw new Error("Nenhum arquivo foi fornecido")
          } else if (error.detail === "Apenas arquivos .py") {
            throw new Error("Apenas arquivos Python (.py) são aceitos")
          } else if (error.detail === "Scraper inválido") {
            throw new Error("O scraper não implementa a interface correta ou não se registra no registry")
          } else {
            // Erro de importação/execução do módulo
            throw new Error(`Erro no scraper: ${error.detail}`)
          }
        }

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
      const response = await fetch(`${API_BASE_URL}/api/scrapers/scrapers/${slug}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          const error = await response.json()
          throw new Error(error.detail || "Scraper não encontrado")
        }
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir scraper")
      }
    } catch (error) {
      console.error("Error deleting scraper:", error)
      throw error
    }
  }

  // Tasks - Atualizado para usar a nova API
  static async runScraper(siteId: number): Promise<TaskResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/sites/${siteId}/run/`, {
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

  // Logs - Atualizado para usar a nova API
  static async getSiteLogs(siteId: number): Promise<ScrapeLogRead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/sites/${siteId}/logs/`, {
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

  // Método para buscar todos os logs (sem filtro por site)
  static async getAllLogs(): Promise<ScrapeLogRead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/logs/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar logs")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching all logs:", error)
      throw error
    }
  }

  // Stats - Nova funcionalidade para estatísticas
  static async getSiteStats(siteId: number): Promise<{
    total_runs: number
    successful_runs: number
    failed_runs: number
    last_run: string | null
    success_rate: number
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrapers/sites/${siteId}/stats/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar estatísticas")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching site stats:", error)
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
  static async getTelegramAccounts(): Promise<TelegramAccountRead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/`, {
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

  static async getTelegramAccount(id: number): Promise<TelegramAccountRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar conta do Telegram")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching telegram account:", error)
      throw error
    }
  }

  static async createTelegramAccount(account: TelegramAccountCreate): Promise<TelegramAccountRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/`, {
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

  static async updateTelegramAccount(id: number, account: TelegramAccountCreate): Promise<TelegramAccountRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar conta do Telegram")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating telegram account:", error)
      throw error
    }
  }

  static async patchTelegramAccount(id: number, account: Partial<TelegramAccountCreate>): Promise<TelegramAccountRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar conta do Telegram")
      }

      return await response.json()
    } catch (error) {
      console.error("Error patching telegram account:", error)
      throw error
    }
  }

  static async deleteTelegramAccount(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir conta do Telegram")
      }
    } catch (error) {
      console.error("Error deleting telegram account:", error)
      throw error
    }
  }
}
