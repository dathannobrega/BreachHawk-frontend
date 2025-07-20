import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import type { SiteRead, SiteCreate, SiteUpdate, TelegramAccountRead, TelegramAccountCreate } from "@/types/site"

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Criar instância do axios
const apiInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token de autenticação
apiInstance.interceptors.request.use(
  (config) => {
    // Tentar obter token do localStorage (client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para tratar respostas e erros
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Tratar erros de autenticação
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        sessionStorage.removeItem("auth_token")
        // Redirecionar para login se necessário
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export const api = {
  baseURL: API_BASE_URL,
  instance: apiInstance,

  // Helper para headers de autenticação
  getAuthHeaders: () => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  },

  // Helper para headers de upload
  getUploadHeaders: () => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      // Não incluir Content-Type para FormData
    }
  },
}

// Sites API
export async function getSites(page = 1, limit = 10): Promise<{ results: SiteRead[]; count: number }> {
  try {
    const response = await api.instance.get(`/api/sites/?page=${page}&limit=${limit}`)

    // Se a API retorna um array simples, adaptar para o formato esperado
    if (Array.isArray(response.data)) {
      return {
        results: response.data,
        count: response.data.length,
      }
    }

    return response.data
  } catch (error) {
    console.error("Error fetching sites:", error)
    throw error
  }
}

export async function createSite(siteData: SiteCreate): Promise<SiteRead> {
  try {
    const response = await api.instance.post(`/api/sites/`, siteData)

    return response.data
  } catch (error) {
    console.error("Error creating site:", error)
    throw error
  }
}

export async function updateSite({ id, data }: { id: number; data: SiteUpdate }): Promise<SiteRead> {
  try {
    const response = await api.instance.put(`/api/sites/${id}/`, data)

    return response.data
  } catch (error) {
    console.error("Error updating site:", error)
    throw error
  }
}

export async function deleteSite(id: number): Promise<void> {
  try {
    await api.instance.delete(`/api/sites/${id}/`)
  } catch (error) {
    console.error("Error deleting site:", error)
    throw error
  }
}

// Scraper APIs
export async function runScraper(siteId: number): Promise<{ task_id: string; status: string }> {
  try {
    const response = await api.instance.post(`/api/scrapers/sites/${siteId}/run/`)

    return response.data
  } catch (error) {
    console.error("Error running scraper:", error)
    throw error
  }
}

export async function getTaskStatus(taskId: string): Promise<{ task_id: string; status: string; result?: any }> {
  try {
    const response = await api.instance.get(`/api/scrapers/tasks/${taskId}/`)

    return response.data
  } catch (error) {
    console.error("Error getting task status:", error)
    throw error
  }
}

export async function getSiteLogs(siteId: number): Promise<any[]> {
  try {
    const response = await api.instance.get(`/api/scrapers/sites/${siteId}/logs/`)

    return response.data
  } catch (error) {
    console.error("Error fetching site logs:", error)
    throw error
  }
}

export async function getSiteStats(siteId: number): Promise<any> {
  try {
    const response = await api.instance.get(`/api/scrapers/sites/${siteId}/stats/`)

    return response.data
  } catch (error) {
    console.error("Error fetching site stats:", error)
    throw error
  }
}

export async function getAllLogs(): Promise<any[]> {
  try {
    const response = await api.instance.get(`/api/scrapers/logs/`)

    return response.data
  } catch (error) {
    console.error("Error fetching all logs:", error)
    throw error
  }
}

// Telegram Accounts API
export async function getTelegramAccounts(): Promise<TelegramAccountRead[]> {
  try {
    const response = await api.instance.get(`/api/sites/telegram-accounts/`)

    return response.data
  } catch (error) {
    console.error("Error fetching telegram accounts:", error)
    throw error
  }
}

export async function createTelegramAccount(accountData: TelegramAccountCreate): Promise<TelegramAccountRead> {
  try {
    const response = await api.instance.post(`/api/sites/telegram-accounts/`, accountData)

    return response.data
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
    const response = await api.instance.put(`/api/sites/telegram-accounts/${id}/`, data)

    return response.data
  } catch (error) {
    console.error("Error updating telegram account:", error)
    throw error
  }
}

export async function deleteTelegramAccount(id: number): Promise<void> {
  try {
    await api.instance.delete(`/api/sites/telegram-accounts/${id}/`)
  } catch (error) {
    console.error("Error deleting telegram account:", error)
    throw error
  }
}

export default apiInstance
