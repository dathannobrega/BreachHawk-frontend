"use client"

import { useState, useEffect, useCallback } from "react"
import { SiteService } from "@/services/site-service"
import type { SiteRead, SiteCreate, SiteUpdate, TaskResponse, TaskStatus, TelegramAccountRead } from "@/types/site"

export const useSites = () => {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [availableScrapers, setAvailableScrapers] = useState<string[]>([])
  const [telegramAccounts, setTelegramAccounts] = useState<TelegramAccountRead[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [scrapersLoading, setScrapersLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = useCallback(async () => {
    setLoading(true)
    try {
      const data = await SiteService.getSites()
      // Adaptar resposta da API
      if (Array.isArray(data)) {
        setSites(data)
      } else if (data.results) {
        setSites(data.results)
      } else {
        setSites([])
      }
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to fetch sites")
      setSites([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAvailableScrapers = useCallback(async () => {
    setScrapersLoading(true)
    try {
      const data = await SiteService.getAvailableScrapers()
      setAvailableScrapers(data)
      setError(null)
    } catch (err: any) {
      console.warn("Failed to fetch available scrapers:", err.message)
      setAvailableScrapers(["generic"]) // Fallback para scrapers básicos
    } finally {
      setScrapersLoading(false)
    }
  }, [])

  const fetchTelegramAccounts = useCallback(async () => {
    try {
      const data = await SiteService.getTelegramAccounts()
      setTelegramAccounts(data)
    } catch (err: any) {
      console.warn("Failed to fetch Telegram accounts:", err.message)
      setTelegramAccounts([]) // Não mostrar erro para Telegram se não for crítico
    }
  }, [])

  const createSite = useCallback(async (site: SiteCreate) => {
    try {
      const newSite = await SiteService.createSite(site)
      setSites((prev) => [...prev, newSite])
      return newSite
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateSite = useCallback(async (id: number, site: SiteUpdate) => {
    try {
      const updatedSite = await SiteService.updateSite(id, site)
      setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
      return updatedSite
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteSite = useCallback(async (id: number) => {
    try {
      await SiteService.deleteSite(id)
      setSites((prev) => prev.filter((s) => s.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const uploadScraper = useCallback(
    async (file: File) => {
      try {
        const result = await SiteService.uploadScraper(file)
        await fetchAvailableScrapers()
        return result
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [fetchAvailableScrapers],
  )

  const deleteScraper = useCallback(
    async (slug: string) => {
      try {
        await SiteService.deleteScraper(slug)
        await fetchAvailableScrapers()
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [fetchAvailableScrapers],
  )

  const runScraper = useCallback(async (siteId: number): Promise<TaskResponse> => {
    try {
      return await SiteService.runScraper(siteId)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const getTaskStatus = useCallback(async (taskId: string): Promise<TaskStatus> => {
    try {
      return await SiteService.getTaskStatus(taskId)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Inicializar dados apenas uma vez
  useEffect(() => {
    fetchSites()
    fetchAvailableScrapers()
  }, [fetchSites, fetchAvailableScrapers])

  return {
    sites,
    availableScrapers,
    telegramAccounts,
    loading,
    scrapersLoading,
    error,
    createSite,
    updateSite,
    deleteSite,
    uploadScraper,
    deleteScraper,
    runScraper,
    getTaskStatus,
    fetchSites,
    fetchAvailableScrapers,
    fetchTelegramAccounts,
    clearError,
  }
}
