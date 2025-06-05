import type { SiteCreate, SiteRead, TaskResponse, TaskStatus } from "@/types/site"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class SiteService {
  static async getSites(): Promise<SiteRead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sites/`, {
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

  static async createSite(site: SiteCreate): Promise<SiteRead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sites/`, {
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

  static async uploadScraper(file: File): Promise<{ msg: string }> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/v1/sites/upload-scraper`, {
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

  static async runScraper(siteId: number): Promise<TaskResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sites/${siteId}/run`, {
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
      const response = await fetch(`${API_BASE_URL}/api/v1/sites/tasks/${taskId}`, {
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
}
