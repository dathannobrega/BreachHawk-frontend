"use client"

import { useState, useEffect, useCallback } from "react"
import { SiteService } from "../services/site"
import type { Site } from "../types/site"

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [availableScrapers, setAvailableScrapers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapersLoading, setScrapersLoading] = useState(false)

  const fetchSites = useCallback(async () => {
    setLoading(true)
    try {
      const sites = await SiteService.getSites()
      setSites(sites)
    } catch (err) {
      console.error("Error fetching sites:", err)
      setError(err instanceof Error ? err.message : "Erro ao buscar sites")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAvailableScrapers = useCallback(async () => {
    setScrapersLoading(true)
    try {
      const scrapers = await SiteService.getAvailableScrapers()
      setAvailableScrapers(scrapers)
    } catch (err) {
      console.error("Error fetching scrapers:", err)
      setError(err instanceof Error ? err.message : "Erro ao buscar scrapers")
    } finally {
      setScrapersLoading(false)
    }
  }, [])

  const createSite = useCallback(async (site: Omit<Site, "id">) => {
    try {
      const newSite = await SiteService.createSite(site)
      setSites((prevSites) => [...prevSites, newSite])
    } catch (err) {
      console.error("Error creating site:", err)
      throw err
    }
  }, [])

  const updateSite = useCallback(async (site: Site) => {
    try {
      await SiteService.updateSite(site)
      setSites((prevSites) => prevSites.map((s) => (s.id === site.id ? site : s)))
    } catch (err) {
      console.error("Error updating site:", err)
      throw err
    }
  }, [])

  const deleteSite = useCallback(async (id: string) => {
    try {
      await SiteService.deleteSite(id)
      setSites((prevSites) => prevSites.filter((site) => site.id !== id))
    } catch (err) {
      console.error("Error deleting site:", err)
      throw err
    }
  }, [])

  const uploadScraper = useCallback(
    async (file: File) => {
      try {
        const result = await SiteService.uploadScraper(file)
        // Atualizar a lista de scrapers após upload bem-sucedido
        await fetchAvailableScrapers()
        return result
      } catch (err) {
        console.error("Error uploading scraper:", err)
        throw err
      }
    },
    [fetchAvailableScrapers],
  )

  const deleteScraper = useCallback(
    async (slug: string) => {
      try {
        await SiteService.deleteScraper(slug)
        // Atualizar a lista de scrapers após exclusão bem-sucedida
        await fetchAvailableScrapers()
      } catch (err) {
        console.error("Error deleting scraper:", err)
        throw err
      }
    },
    [fetchAvailableScrapers],
  )

  useEffect(() => {
    fetchSites()
    fetchAvailableScrapers()
  }, [fetchSites, fetchAvailableScrapers])

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
  }
}
