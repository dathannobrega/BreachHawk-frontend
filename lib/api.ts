import { getAuthHeaders } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Site API functions
export async function getSites() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/sites/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching sites:", error)
    throw error
  }
}

export async function createSite(siteData: {
  name: string
  links: Array<{ url: string }>
  type: string
  auth_type: string
  captcha_type: string
  scraper: string
  needs_js: boolean
  bypass_config?: any
  credentials?: any
  telegram_account?: number | null
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/sites/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(siteData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating site:", error)
    throw error
  }
}

export async function updateSite(
  id: number,
  siteData: {
    name: string
    links: Array<{ url: string }>
    type: string
    auth_type: string
    captcha_type: string
    scraper: string
    needs_js: boolean
    bypass_config?: any
    credentials?: any
    telegram_account?: number | null
  },
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/sites/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(siteData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating site:", error)
    throw error
  }
}

export async function deleteSite(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/sites/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting site:", error)
    throw error
  }
}

// Telegram Account API functions
export async function getTelegramAccounts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching telegram accounts:", error)
    throw error
  }
}

export async function createTelegramAccount(accountData: {
  api_id: number
  api_hash: string
  session_string?: string
  phone?: string
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(accountData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating telegram account:", error)
    throw error
  }
}

export async function updateTelegramAccount(
  id: number,
  accountData: {
    api_id: number
    api_hash: string
    session_string?: string
    phone?: string
  },
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(accountData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating telegram account:", error)
    throw error
  }
}

export async function deleteTelegramAccount(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/telegram-accounts/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting telegram account:", error)
    throw error
  }
}
