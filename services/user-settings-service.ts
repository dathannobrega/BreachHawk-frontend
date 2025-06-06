const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface UserSettingsUpdate {
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  organization?: string | null
  contact?: string | null
  company?: string | null
  job_title?: string | null
  is_subscribed?: boolean
}

export interface PasswordChangeRequest {
  old_password: string
  new_password: string
}

class UserSettingsService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async updateProfile(settings: UserSettingsUpdate): Promise<any> {
    return this.makeRequest<any>("/api/v1/users/me", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }

  async changePassword(passwordData: PasswordChangeRequest): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
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

  async deleteProfileImage(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>("/api/v1/users/me/profile-image", {
      method: "DELETE",
    })
  }
}

export const userSettingsService = new UserSettingsService()
