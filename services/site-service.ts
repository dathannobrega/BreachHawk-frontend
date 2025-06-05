import type { SiteFormData, SiteListResponse, SiteResponse } from "@/types/site"

export class SiteService {
  private apiUrl: string
  private token: string | null

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    this.token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  }

  private getHeaders(isMultipart = false) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
    }

    if (!isMultipart) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  }

  async getSites(page = 1, size = 10): Promise<SiteListResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/sites/?page=${page}&size=${size}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar sites")
      }

      return await response.json()
    } catch (error: any) {
      console.error("Erro ao buscar sites:", error)
      throw error
    }
  }

  async getSite(id: number): Promise<SiteResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/sites/${id}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao buscar site")
      }

      return await response.json()
    } catch (error: any) {
      console.error(`Erro ao buscar site ${id}:`, error)
      throw error
    }
  }

  async createSite(siteData: SiteFormData): Promise<SiteResponse> {
    try {
      const formData = new FormData()
      formData.append("name", siteData.name)
      formData.append("scraper_name", siteData.scraper_name)
      formData.append("enabled", String(siteData.enabled))
      formData.append("auth_type", siteData.auth_type)
      formData.append("captcha_type", siteData.captcha_type)
      formData.append("needs_js", String(siteData.needs_js))

      // Adicionar URLs como JSON string
      formData.append("urls", JSON.stringify(siteData.urls))

      // Adicionar arquivo do scraper se existir
      if (siteData.scraper_file) {
        formData.append("scraper_file", siteData.scraper_file)
      }

      const response = await fetch(`${this.apiUrl}/api/v1/sites/`, {
        method: "POST",
        headers: this.getHeaders(true),
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao criar site")
      }

      return await response.json()
    } catch (error: any) {
      console.error("Erro ao criar site:", error)
      throw error
    }
  }

  async updateSite(id: number, siteData: SiteFormData): Promise<SiteResponse> {
    try {
      const formData = new FormData()
      formData.append("name", siteData.name)
      formData.append("scraper_name", siteData.scraper_name)
      formData.append("enabled", String(siteData.enabled))
      formData.append("auth_type", siteData.auth_type)
      formData.append("captcha_type", siteData.captcha_type)
      formData.append("needs_js", String(siteData.needs_js))

      // Adicionar URLs como JSON string
      formData.append("urls", JSON.stringify(siteData.urls))

      // Adicionar arquivo do scraper se existir
      if (siteData.scraper_file) {
        formData.append("scraper_file", siteData.scraper_file)
      }

      const response = await fetch(`${this.apiUrl}/api/v1/sites/${id}`, {
        method: "PUT",
        headers: this.getHeaders(true),
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao atualizar site")
      }

      return await response.json()
    } catch (error: any) {
      console.error(`Erro ao atualizar site ${id}:`, error)
      throw error
    }
  }

  async deleteSite(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/sites/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao excluir site")
      }
    } catch (error: any) {
      console.error(`Erro ao excluir site ${id}:`, error)
      throw error
    }
  }

  async runScraper(id: number): Promise<{ task_id: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/sites/${id}/run`, {
        method: "POST",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao executar scraper")
      }

      return await response.json()
    } catch (error: any) {
      console.error(`Erro ao executar scraper para o site ${id}:`, error)
      throw error
    }
  }
}

export const siteService = new SiteService()
