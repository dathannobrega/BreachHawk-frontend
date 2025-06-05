import type { SiteCreate, SiteRead, TaskResponse, TaskStatus, UploadScraperResponse } from "@/types/site"

class SiteService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  private getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  private getAuthHeadersForUpload() {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  async uploadScraper(file: File): Promise<UploadScraperResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.baseUrl}/api/v1/sites/upload-scraper`, {
      method: "POST",
      headers: this.getAuthHeadersForUpload(),
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao fazer upload do scraper")
    }

    return response.json()
  }

  async createSite(siteData: SiteCreate): Promise<SiteRead> {
    const response = await fetch(`${this.baseUrl}/api/v1/sites/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(siteData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao criar site")
    }

    return response.json()
  }

  async listSites(): Promise<SiteRead[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/sites/`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao listar sites")
    }

    return response.json()
  }

  async runScraper(siteId: number): Promise<TaskResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/sites/${siteId}/run`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao executar scraper")
    }

    return response.json()
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await fetch(`${this.baseUrl}/api/v1/sites/tasks/${taskId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Erro ao obter status da task")
    }

    return response.json()
  }
}

export const siteService = new SiteService()
