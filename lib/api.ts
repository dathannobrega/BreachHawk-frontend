import type { SiteRead, SiteCreate, SiteUpdate, TelegramAccountRead, TelegramAccountCreate } from "@/types/site"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Sites API
export async function getSites(page = 1, limit = 10): Promise<{ results: SiteRead[]; count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/api/sites/${id}/`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
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

// Telegram Accounts API
export async function getTelegramAccounts(): Promise<TelegramAccountRead[]> {
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

export async function createTelegramAccount(accountData: TelegramAccountCreate): Promise<TelegramAccountRead> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
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
