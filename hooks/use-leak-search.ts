"use client"

import { useState } from "react"
import { searchLeaks } from "@/services/leak-service"
import type { LeakResult } from "@/types/leak"

export function useLeakSearch() {
  const [results, setResults] = useState<LeakResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setError("Digite um termo para pesquisar")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await searchLeaks(query)
      setResults(response.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao pesquisar")
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
    search,
    clearResults,
  }
}
