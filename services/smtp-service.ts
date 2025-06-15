import type { SMTPConfigRead, SMTPConfigUpdate, TestEmailRequest, TestEmailResponse } from "@/types/smtp"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class SMTPService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}/api/notifications/smtp${endpoint}`, {
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

  async getConfig(): Promise<SMTPConfigRead> {
    return this.makeRequest<SMTPConfigRead>("/")
  }

  async updateConfig(config: SMTPConfigUpdate): Promise<SMTPConfigRead> {
    return this.makeRequest<SMTPConfigRead>("/", {
      method: "PUT",
      body: JSON.stringify(config),
    })
  }

  async testEmail(email: string): Promise<TestEmailResponse> {
    const data: TestEmailRequest = {
      to_email: email,
    }

    return this.makeRequest<TestEmailResponse>("/test/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const smtpService = new SMTPService()
