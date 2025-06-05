"use client"

import { useState, useEffect, useCallback } from "react"
import { siteService } from "@/services/site-service"
import type { SiteCreate, SiteRead } from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await siteService.listSites()
      setSites(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }, [])

  const createSite = useCallback(async (siteData: SiteCreate) => {
    try {
      setError(null)
      const newSite = await siteService.createSite(siteData)
      setSites((prev) => [...prev, newSite])
      return newSite
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const uploadScraper = useCallback(async (file: File) => {
    try {
      setError(null)
      return await siteService.uploadScraper(file)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer upload do scraper"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const runScraper = useCallback(async (siteId: number) => {
    try {
      setError(null)
      return await siteService.runScraper(siteId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao executar scraper"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getTaskStatus = useCallback(async (taskId: string) => {
    try {
      setError(null)
      return await siteService.getTaskStatus(taskId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao obter status da task"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  return {
    sites,
    loading,
    error,
    fetchSites,
    createSite,
    uploadScraper,
    runScraper,
    getTaskStatus,
  }
}
