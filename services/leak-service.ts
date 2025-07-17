import type { LeakSearchResponse } from "@/types/leak"
import { getAuthHeaders } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export async function searchLeaks(query: string): Promise<LeakSearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leaks/search/?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()

      if (response.status === 400) {
        throw new Error("Consulta de pesquisa é obrigatória")
      }

      if (response.status === 403) {
        throw new Error("Cota de pesquisa excedida")
      }

      throw new Error(error.detail || "Erro ao pesquisar vazamentos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching leaks:", error)
    throw error
  }
}
