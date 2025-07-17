import type { LeakSearchResponse, LeakSearchError } from "@/types/leak"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class LeakService {
  static async searchLeaks(query: string): Promise<LeakSearchResponse> {
    try {
      if (!query.trim()) {
        throw new Error("Query é obrigatória")
      }

      const encodedQuery = encodeURIComponent(query.trim())
      const response = await fetch(`${API_BASE_URL}/api/leaks/search/?q=${encodedQuery}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const error: LeakSearchError = await response.json()

        if (response.status === 400) {
          throw new Error("Query é obrigatória")
        } else if (response.status === 403) {
          throw new Error("Cota de pesquisa excedida. Tente novamente mais tarde.")
        } else {
          throw new Error(error.detail || "Erro ao realizar pesquisa")
        }
      }

      return await response.json()
    } catch (error) {
      console.error("Error searching leaks:", error)
      throw error
    }
  }
}
