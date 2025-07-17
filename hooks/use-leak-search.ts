"use client"

import { useState } from "react"
import type { LeakResult } from "@/types/leak"
import { LeakService } from "@/services/leak-service"

export function useLeakSearch() {
  const [results, setResults] = useState<LeakResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchLeaks = async (query: string) => {
    if (!query.trim()) {
      setError("Digite um termo para pesquisar")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await LeakService.searchLeaks(query)
      setResults(response.results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao realizar pesquisa"
      setError(errorMessage)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setError(null)
  }

  return {
    results,
    loading,
    error,
    searchLeaks,
    clearResults,
  }
}
