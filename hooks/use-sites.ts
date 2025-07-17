"use client"

import { useState, useEffect, useCallback } from "react"
import { SiteService } from "@/services/site-service"
import type {
  SiteCreate,
  SiteRead,
  SiteUpdate,
  TaskResponse,
  TaskStatus,
  ScrapeLogRead,
  TelegramAccountRead,
} from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [availableScrapers, setAvailableScrapers] = useState<string[]>([])
  const [telegramAccounts, setTelegramAccounts] = useState<TelegramAccountRead[]>([])
  const [loading, setLoading] = useState(true)
  const [scrapersLoading, setScrapersLoading] = useState(true)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch sites
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true)
      const data = await SiteService.getSites()
      setSites(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar sites")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch available scrapers
  const fetchAvailableScrapers = useCallback(async () => {
    try {
      setScrapersLoading(true)
      const data = await SiteService.getAvailableScrapers()
      setAvailableScrapers(data)
    } catch (err) {
      console.error("Error fetching scrapers:", err)
      setAvailableScrapers([])
    } finally {
      setScrapersLoading(false)
    }
  }, [])

  // Fetch telegram accounts
  const fetchTelegramAccounts = useCallback(async () => {
    try {
      setTelegramLoading(true)
      const data = await SiteService.getTelegramAccounts()
      setTelegramAccounts(data)
    } catch (err) {
      console.error("Error fetching telegram accounts:", err)
      setTelegramAccounts([])
    } finally {
      setTelegramLoading(false)
    }
  }, [])

  // Create site
  const createSite = useCallback(async (site: SiteCreate): Promise<SiteRead> => {
    const newSite = await SiteService.createSite(site)
    setSites((prev) => [...prev, newSite])
    return newSite
  }, [])

  // Update site
  const updateSite = useCallback(async (id: number, site: SiteUpdate): Promise<SiteRead> => {
    const updatedSite = await SiteService.updateSite(id, site)
    setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
    return updatedSite
  }, [])

  // Patch site
  const patchSite = useCallback(async (id: number, site: Partial<SiteUpdate>): Promise<SiteRead> => {
    const updatedSite = await SiteService.patchSite(id, site)
    setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
    return updatedSite
  }, [])

  // Delete site
  const deleteSite = useCallback(async (id: number): Promise<void> => {
    await SiteService.deleteSite(id)
    setSites((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // Upload scraper
  const uploadScraper = useCallback(
    async (file: File) => {
      const result = await SiteService.uploadScraper(file)
      await fetchAvailableScrapers() // Refresh scrapers list
      return result
    },
    [fetchAvailableScrapers],
  )

  // Delete scraper
  const deleteScraper = useCallback(
    async (slug: string) => {
      await SiteService.deleteScraper(slug)
      await fetchAvailableScrapers() // Refresh scrapers list
    },
    [fetchAvailableScrapers],
  )

  // Run scraper - Atualizado para usar a nova API
  const runScraper = useCallback(async (siteId: number): Promise<TaskResponse> => {
    return await SiteService.runScraper(siteId)
  }, [])

  // Get task status
  const getTaskStatus = useCallback(async (taskId: string): Promise<TaskStatus> => {
    return await SiteService.getTaskStatus(taskId)
  }, [])

  // Get site logs - Atualizado para usar a nova API
  const getSiteLogs = useCallback(async (siteId: number): Promise<ScrapeLogRead[]> => {
    return await SiteService.getSiteLogs(siteId)
  }, [])

  // Get all logs
  const getAllLogs = useCallback(async (): Promise<ScrapeLogRead[]> => {
    return await SiteService.getAllLogs()
  }, [])

  // Get site stats - Nova funcionalidade
  const getSiteStats = useCallback(async (siteId: number) => {
    return await SiteService.getSiteStats(siteId)
  }, [])

  // Get snapshots
  const getSnapshots = useCallback(async (siteId?: number) => {
    return await SiteService.getSnapshots(siteId)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial load
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
    telegramLoading,
    error,
    createSite,
    updateSite,
    patchSite,
    deleteSite,
    uploadScraper,
    deleteScraper,
    runScraper,
    getTaskStatus,
    getSiteLogs,
    getAllLogs,
    getSiteStats,
    getSnapshots,
    fetchSites,
    fetchAvailableScrapers,
    fetchTelegramAccounts,
    clearError,
  }
}
