"use client"

import { useState, useEffect } from "react"
import { SiteService } from "@/services/site-service"
import type { TelegramAccountRead, TelegramAccountCreate } from "@/types/site"

export const useTelegramAccounts = () => {
  const [accounts, setAccounts] = useState<TelegramAccountRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SiteService.getTelegramAccounts()
      setAccounts(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar contas do Telegram")
      console.error("Error fetching telegram accounts:", err)
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (accountData: TelegramAccountCreate): Promise<TelegramAccountRead> => {
    try {
      const newAccount = await SiteService.createTelegramAccount(accountData)
      setAccounts((prev) => [...prev, newAccount])
      return newAccount
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar conta do Telegram"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateAccount = async (id: number, accountData: TelegramAccountCreate): Promise<TelegramAccountRead> => {
    try {
      const updatedAccount = await SiteService.updateTelegramAccount(id, accountData)
      setAccounts((prev) => prev.map((account) => (account.id === id ? updatedAccount : account)))
      return updatedAccount
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar conta do Telegram"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteAccount = async (id: number): Promise<void> => {
    try {
      await SiteService.deleteTelegramAccount(id)
      setAccounts((prev) => prev.filter((account) => account.id !== id))
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao excluir conta do Telegram"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    clearError,
  }
}
