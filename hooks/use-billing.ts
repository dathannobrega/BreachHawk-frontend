"use client"

import { useState, useEffect } from "react"
import type { Invoice, Payment, Subscription, BillingStats } from "@/types/billing"
import { billingService } from "@/services/billing-service"

export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<BillingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [invoicesData, paymentsData, subscriptionsData] = await Promise.all([
        billingService.getInvoices(),
        billingService.getPayments(),
        billingService.getSubscriptions(),
      ])

      setInvoices(invoicesData)
      setPayments(paymentsData)
      setSubscriptions(subscriptionsData)

      // Calcular estatísticas
      const calculatedStats = billingService.calculateStats(invoicesData, paymentsData, subscriptionsData)
      setStats(calculatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados de faturamento")
      console.error("Erro ao buscar dados de billing:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => {
    fetchData()
  }

  return {
    invoices,
    payments,
    subscriptions,
    stats,
    loading,
    error,
    refetch,
  }
}
