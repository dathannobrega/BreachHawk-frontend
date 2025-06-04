"use client"

import { useState, useEffect } from "react"
import type { PlatformStats, TopCompany, RecentActivity } from "@/services/platform-dashboard-service"
import { platformDashboardService } from "@/services/platform-dashboard-service"

export function usePlatformDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await platformDashboardService.getDashboardData()
      setStats(data.stats)
      setTopCompanies(data.topCompanies)
      setRecentActivity(data.recentActivity)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados do dashboard")
      console.error("Erro ao buscar dados do dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const refetch = () => {
    fetchDashboardData()
  }

  return {
    stats,
    topCompanies,
    recentActivity,
    loading,
    error,
    refetch,
  }
}
