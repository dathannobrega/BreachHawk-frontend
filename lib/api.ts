import type { SiteRead, SiteCreate, SiteUpdate, TelegramAccountRead, TelegramAccountCreate } from "@/types/site"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const api = {
  baseURL: API_BASE_URL,

  // Helper para headers de autenticação
  getAuthHeaders: () => {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  },

  // Helper para headers de upload
  getUploadHeaders: () => {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
      // Não incluir Content-Type para FormData
    }
  },
}

// Sites API
export async function getSites(page = 1, limit = 10): Promise<{ results: SiteRead[]; count: number }> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/?page=${page}&limit=${limit}`, {
      headers: api.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao buscar sites")
    }

    const data = await response.json()

    // Se a API retorna um array simples, adaptar para o formato esperado
    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
      }
    }

    return data
  } catch (error) {
    console.error("Error fetching sites:", error)
    throw error
  }
}

export async function createSite(siteData: SiteCreate): Promise<SiteRead> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/`, {
      method: "POST",
      headers: api.getAuthHeaders(),
      body: JSON.stringify(siteData),
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

export async function updateSite({ id, data }: { id: number; data: SiteUpdate }): Promise<SiteRead> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/${id}/`, {
      method: "PUT",
      headers: api.getAuthHeaders(),
      body: JSON.stringify(data),
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

export async function deleteSite(id: number): Promise<void> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/${id}/`, {
      method: "DELETE",
      headers: api.getAuthHeaders(),
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

// Scraper APIs
export async function runScraper(siteId: number): Promise<{ task_id: string; status: string }> {
  try {
    const response = await fetch(`${api.baseURL}/api/scrapers/sites/${siteId}/run/`, {
      method: "POST",
      headers: api.getAuthHeaders(),
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

export async function getTaskStatus(taskId: string): Promise<{ task_id: string; status: string; result?: any }> {
  try {
    const response = await fetch(`${api.baseURL}/api/scrapers/tasks/${taskId}/`, {
      headers: api.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao consultar status da tarefa")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting task status:", error)
    throw error
  }
}

export async function getSiteLogs(siteId: number): Promise<any[]> {
  try {
    const response = await fetch(`${api.baseURL}/api/scrapers/sites/${siteId}/logs/`, {
      headers: api.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao buscar logs")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching site logs:", error)
    throw error
  }
}

export async function getSiteStats(siteId: number): Promise<any> {
  try {
    const response = await fetch(`${api.baseURL}/api/scrapers/sites/${siteId}/stats/`, {
      headers: api.getAuthHeaders(),
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

export async function getAllLogs(): Promise<any[]> {
  try {
    const response = await fetch(`${api.baseURL}/api/scrapers/logs/`, {
      headers: api.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao buscar todos os logs")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching all logs:", error)
    throw error
  }
}

// Telegram Accounts API
export async function getTelegramAccounts(): Promise<TelegramAccountRead[]> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/telegram-accounts/`, {
      headers: api.getAuthHeaders(),
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

export async function createTelegramAccount(accountData: TelegramAccountCreate): Promise<TelegramAccountRead> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/telegram-accounts/`, {
      method: "POST",
      headers: api.getAuthHeaders(),
      body: JSON.stringify(accountData),
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

export async function updateTelegramAccount({
  id,
  data,
}: { id: number; data: TelegramAccountCreate }): Promise<TelegramAccountRead> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/telegram-accounts/${id}/`, {
      method: "PUT",
      headers: api.getAuthHeaders(),
      body: JSON.stringify(data),
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

export async function deleteTelegramAccount(id: number): Promise<void> {
  try {
    const response = await fetch(`${api.baseURL}/api/sites/telegram-accounts/${id}/`, {
      method: "DELETE",
      headers: api.getAuthHeaders(),
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
