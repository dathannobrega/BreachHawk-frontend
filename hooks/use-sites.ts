"use client"

import { useState, useEffect } from "react"
import { SiteService } from "@/services/site-service"
import type {
  SiteCreate,
  SiteRead,
  SiteUpdate,
  TaskResponse,
  TaskStatus,
  ScrapeLogRead,
  ScraperUploadResponse,
} from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [availableScrapers, setAvailableScrapers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [scrapersLoading, setScrapersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = async () => {
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
  }

  const fetchAvailableScrapers = async () => {
    setScrapersLoading(true)
    try {
      const scrapers = await SiteService.getAvailableScrapers()
      setAvailableScrapers(scrapers)
      return scrapers
    } catch (err) {
      console.error("Error fetching scrapers:", err)
      return []
    } finally {
      setScrapersLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
    fetchAvailableScrapers()
  }, [])

  const createSite = async (site: SiteCreate): Promise<SiteRead> => {
    try {
      const newSite = await SiteService.createSite(site)
      setSites((prev) => [...prev, newSite])
      return newSite
    } catch (err) {
      throw err
    }
  }

  const updateSite = async (id: number, site: SiteUpdate): Promise<SiteRead> => {
    try {
      const updatedSite = await SiteService.updateSite(id, site)
      setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
      return updatedSite
    } catch (err) {
      throw err
    }
  }

  const deleteSite = async (id: number): Promise<void> => {
    try {
      await SiteService.deleteSite(id)
      setSites((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      throw err
    }
  }

  const uploadScraper = async (file: File): Promise<ScraperUploadResponse> => {
    try {
      const result = await SiteService.uploadScraper(file)
      // Atualiza a lista de scrapers disponíveis após o upload
      await fetchAvailableScrapers()
      return result
    } catch (err) {
      throw err
    }
  }

  const deleteScraper = async (slug: string): Promise<void> => {
    try {
      await SiteService.deleteScraper(slug)
      setAvailableScrapers((prev) => prev.filter((s) => s !== slug))
    } catch (err) {
      throw err
    }
  }

  const runScraper = async (siteId: number): Promise<TaskResponse> => {
    try {
      return await SiteService.runScraper(siteId)
    } catch (err) {
      throw err
    }
  }

  const getTaskStatus = async (taskId: string): Promise<TaskStatus> => {
    try {
      return await SiteService.getTaskStatus(taskId)
    } catch (err) {
      throw err
    }
  }

  const getSiteLogs = async (siteId: number): Promise<ScrapeLogRead[]> => {
    try {
      return await SiteService.getSiteLogs(siteId)
    } catch (err) {
      throw err
    }
  }

  return {
    sites,
    availableScrapers,
    loading,
    scrapersLoading,
    error,
    fetchSites,
    fetchAvailableScrapers,
    createSite,
    updateSite,
    deleteSite,
    uploadScraper,
    deleteScraper,
    runScraper,
    getTaskStatus,
    getSiteLogs,
  }
}
