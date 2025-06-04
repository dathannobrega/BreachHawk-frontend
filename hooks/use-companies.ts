"use client"

import { useState, useEffect } from "react"
import type { Company, CompanyCreate, CompanyUpdate, CompanyStats } from "@/types/company"
import { companyService } from "@/services/company-service"

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState<CompanyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      const companiesData = await companyService.getCompanies()
      setCompanies(companiesData)

      // Calcular estatísticas
      const calculatedStats = companyService.calculateStats(companiesData)
      setStats(calculatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar empresas")
      console.error("Erro ao buscar empresas:", err)
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (data: CompanyCreate): Promise<Company> => {
    try {
      const newCompany = await companyService.createCompany(data)
      setCompanies((prev) => [...prev, newCompany])

      // Recalcular estatísticas
      const updatedStats = companyService.calculateStats([...companies, newCompany])
      setStats(updatedStats)

      return newCompany
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar empresa"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCompany = async (id: number, data: CompanyUpdate): Promise<Company> => {
    try {
      const updatedCompany = await companyService.updateCompany(id, data)
      setCompanies((prev) => prev.map((company) => (company.id === id ? updatedCompany : company)))

      // Recalcular estatísticas
      const updatedCompanies = companies.map((company) => (company.id === id ? updatedCompany : company))
      const updatedStats = companyService.calculateStats(updatedCompanies)
      setStats(updatedStats)

      return updatedCompany
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar empresa"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCompany = async (id: number): Promise<void> => {
    try {
      await companyService.deleteCompany(id)
      const updatedCompanies = companies.filter((company) => company.id !== id)
      setCompanies(updatedCompanies)

      // Recalcular estatísticas
      const updatedStats = companyService.calculateStats(updatedCompanies)
      setStats(updatedStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir empresa"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getCompany = async (id: number): Promise<Company> => {
    try {
      return await companyService.getCompany(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar empresa"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const refetch = () => {
    fetchCompanies()
  }

  return {
    companies,
    stats,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    refetch,
  }
}
