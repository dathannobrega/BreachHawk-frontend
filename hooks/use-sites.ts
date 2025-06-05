"use client"

import { useState, useEffect } from "react"
import { SiteService } from "@/services/site-service"
import type { SiteCreate, SiteRead, TaskResponse, TaskStatus } from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchSites()
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

  const updateSite = async (id: number, site: SiteCreate): Promise<SiteRead> => {
    try {
      const updatedSite = await SiteService.updateSite(id, site)
      setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)))
      return updatedSite
    } catch (err) {
      throw err
    }
  }

  const uploadScraper = async (file: File): Promise<{ msg: string }> => {
    try {
      return await SiteService.uploadScraper(file)
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

  return {
    sites,
    loading,
    error,
    fetchSites,
    createSite,
    updateSite,
    uploadScraper,
    runScraper,
    getTaskStatus,
  }
}
