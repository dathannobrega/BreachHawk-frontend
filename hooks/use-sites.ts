"use client"

import { useState, useEffect, useCallback } from "react"
import { siteService } from "@/services/site-service"
import type { SiteFormData, SiteResponse } from "@/types/site"

export function useSites() {
  const [sites, setSites] = useState<SiteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSites = useCallback(async (page = 1, size = 10) => {
    setLoading(true)
    setError(null)
    try {
      const response = await siteService.getSites(page, size)
      setSites(response.items)
      setTotalItems(response.total)
      setCurrentPage(response.page)
      setPageSize(response.size)
      setTotalPages(response.pages)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar sites")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSites(currentPage, pageSize)
  }, [fetchSites, currentPage, pageSize])

  const getSite = async (id: number) => {
    try {
      return await siteService.getSite(id)
    } catch (err: any) {
      setError(err.message || `Erro ao carregar site ${id}`)
      throw err
    }
  }

  const createSite = async (siteData: SiteFormData) => {
    try {
      const newSite = await siteService.createSite(siteData)
      await fetchSites(currentPage, pageSize)
      return newSite
    } catch (err: any) {
      setError(err.message || "Erro ao criar site")
      throw err
    }
  }

  const updateSite = async (id: number, siteData: SiteFormData) => {
    try {
      const updatedSite = await siteService.updateSite(id, siteData)
      await fetchSites(currentPage, pageSize)
      return updatedSite
    } catch (err: any) {
      setError(err.message || `Erro ao atualizar site ${id}`)
      throw err
    }
  }

  const deleteSite = async (id: number) => {
    try {
      await siteService.deleteSite(id)
      await fetchSites(currentPage, pageSize)
    } catch (err: any) {
      setError(err.message || `Erro ao excluir site ${id}`)
      throw err
    }
  }

  const runScraper = async (id: number) => {
    try {
      return await siteService.runScraper(id)
    } catch (err: any) {
      setError(err.message || `Erro ao executar scraper para o site ${id}`)
      throw err
    }
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
  }

  const changePageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    sites,
    loading,
    error,
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    fetchSites,
    getSite,
    createSite,
    updateSite,
    deleteSite,
    runScraper,
    changePage,
    changePageSize,
  }
}
