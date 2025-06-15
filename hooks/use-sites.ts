"use client"

import { useState, useEffect } from "react"
import { SiteService } from "@/services/site"

interface Site {
  id: string
  name: string
  url: string
}

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await SiteService.getAllSites()
        setSites(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  return { sites, loading, error }
}
