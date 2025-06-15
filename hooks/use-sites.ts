"use client"

import { useState, useEffect, useCallback } from "react"
import { SiteService } from "@/services/site-service"
import type {
  SiteRead,
  SiteCreate,
  SiteUpdate,
  ScrapeLogRead,
  TaskResponse,
  TaskStatus,
  ScraperUploadResponse,
  TelegramAccount,
} from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [availableScrapers, setAvailableScrapers] = useState<string[]>([])
  const [telegramAccounts, setTelegramAccounts] = useState<TelegramAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [scrapersLoading, setScrapersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await SiteService.getSites()
      setSites(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar sites")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAvailableScrapers = useCallback(async () => {
    setScrapersLoading(true)
    try {
      const data = await SiteService.getAvailableScrapers()
      setAvailableScrapers(data)
    } catch (err) {
      console.error("Error fetching scrapers:", err)
      setAvailableScrapers([])
    } finally {
      setScrapersLoading(false)
    }
  }, [])

  const fetchTelegramAccounts = useCallback(async () => {
    try {
      const data = await SiteService.getTelegramAccounts()
      setTelegramAccounts(data)
    } catch (err) {
      console.error("Error fetching telegram accounts:", err)
      setTelegramAccounts([])
    }
  }, [])

  const createSite = useCallback(async (site: SiteCreate): Promise<SiteRead> => {
    const newSite = await SiteService.createSite(site)
    setSites((prev) => [...prev, newSite])
    return newSite
  }, [])

  const updateSite = useCallback(async (id: number, site: SiteUpdate): Promise<SiteRead> => {
    const updatedSite = await SiteService.updateSite(id, site)
    setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
    return updatedSite
  }, [])

  const patchSite = useCallback(async (id: number, site: Partial<SiteUpdate>): Promise<SiteRead> => {
    const updatedSite = await SiteService.patchSite(id, site)
    setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
    return updatedSite
  }, [])

  const deleteSite = useCallback(async (id: number): Promise<void> => {
    await SiteService.deleteSite(id)
    setSites((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const uploadScraper = useCallback(async (file: File): Promise<ScraperUploadResponse> => {
    return await SiteService.uploadScraper(file)
  }, [])

  const deleteScraper = useCallback(async (slug: string): Promise<void> => {
    await SiteService.deleteScraper(slug)
    setAvailableScrapers((prev) => prev.filter((s) => s !== slug))
  }, [])

  const runScraper = useCallback(async (siteId: number): Promise<TaskResponse> => {
    return await SiteService.runScraper(siteId)
  }, [])

  const getTaskStatus = useCallback(async (taskId: string): Promise<TaskStatus> => {
    return await SiteService.getTaskStatus(taskId)
  }, [])

  const getSiteLogs = useCallback(async (siteId?: number): Promise<ScrapeLogRead[]> => {
    return await SiteService.getSiteLogs(siteId)
  }, [])

  const createTelegramAccount = useCallback(async (account: Omit<TelegramAccount, "id">): Promise<TelegramAccount> => {
    const newAccount = await SiteService.createTelegramAccount(account)
    setTelegramAccounts((prev) => [...prev, newAccount])
    return newAccount
  }, [])

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
    patchSite,
    deleteSite,
    uploadScraper,
    deleteScraper,
    runScraper,
    getTaskStatus,
    getSiteLogs,
    createTelegramAccount,
    fetchSites,
    fetchAvailableScrapers,
    fetchTelegramAccounts,
  }
}
