"use client"

import { useState, useEffect } from "react"
import { SiteService } from "@/services/site-service"
import type { SiteRead, SiteCreate, SiteUpdate } from "@/types/site"

export const useSites = () => {
  const [sites, setSites] = useState<SiteRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SiteService.getSites()
      setSites(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar sites")
      console.error("Error fetching sites:", err)
    } finally {
      setLoading(false)
    }
  }

  const createSite = async (siteData: SiteCreate): Promise<SiteRead> => {
    try {
      // Garantir que links seja um array válido
      const siteWithLinks = {
        ...siteData,
        links: siteData.links || [],
      }

      const newSite = await SiteService.createSite(siteWithLinks)
      setSites((prev) => [...prev, newSite])
      return newSite
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateSite = async (id: number, siteData: SiteUpdate): Promise<SiteRead> => {
    try {
      const updatedSite = await SiteService.updateSite(id, siteData)
      setSites((prev) => prev.map((site) => (site.id === id ? updatedSite : site)))
      return updatedSite
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const patchSite = async (id: number, siteData: Partial<SiteUpdate>): Promise<SiteRead> => {
    try {
      const updatedSite = await SiteService.patchSite(id, siteData)
      setSites((prev) => prev.map((site) => (site.id === id ? updatedSite : site)))
      return updatedSite
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteSite = async (id: number): Promise<void> => {
    try {
      await SiteService.deleteSite(id)
      setSites((prev) => prev.filter((site) => site.id !== id))
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao excluir site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getSite = async (id: number): Promise<SiteRead> => {
    try {
      return await SiteService.getSite(id)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar site"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const runScraper = async (siteId: number) => {
    try {
      return await SiteService.runScraper(siteId)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao executar scraper"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getTaskStatus = async (taskId: string) => {
    try {
      return await SiteService.getTaskStatus(taskId)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar status da tarefa"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    fetchSites()
  }, [])

  return {
    sites,
    loading,
    error,
    fetchSites,
    createSite,
    updateSite,
    patchSite,
    deleteSite,
    getSite,
    runScraper,
    getTaskStatus,
    clearError,
  }
}
