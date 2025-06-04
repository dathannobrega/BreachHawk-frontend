"use client"

import { useState, useEffect } from "react"
import type { PlatformUser, PlatformUserCreate, PlatformUserUpdate, UserStats } from "@/types/platform-user"
import { platformUserService } from "@/services/platform-user-service"

export function usePlatformUsers() {
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const usersData = await platformUserService.getUsers()
      setUsers(usersData)

      // Calcular estatísticas
      const calculatedStats = platformUserService.calculateStats(usersData)
      setStats(calculatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários")
      console.error("Erro ao buscar usuários:", err)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (data: PlatformUserCreate): Promise<PlatformUser> => {
    try {
      const newUser = await platformUserService.createUser(data)
      setUsers((prev) => [...prev, newUser])

      // Recalcular estatísticas
      const updatedStats = platformUserService.calculateStats([...users, newUser])
      setStats(updatedStats)

      return newUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar usuário"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateUser = async (id: number, data: PlatformUserUpdate): Promise<PlatformUser> => {
    try {
      const updatedUser = await platformUserService.updateUser(id, data)
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))

      // Recalcular estatísticas
      const updatedUsers = users.map((user) => (user.id === id ? updatedUser : user))
      const updatedStats = platformUserService.calculateStats(updatedUsers)
      setStats(updatedStats)

      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await platformUserService.deleteUser(id)
      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)

      // Recalcular estatísticas
      const updatedStats = platformUserService.calculateStats(updatedUsers)
      setStats(updatedStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir usuário"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getUser = async (id: number): Promise<PlatformUser> => {
    try {
      return await platformUserService.getUser(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar usuário"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateUserStatus = async (id: number, status: "active" | "suspended"): Promise<void> => {
    try {
      await updateUser(id, { status })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar status do usuário"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const refetch = () => {
    fetchUsers()
  }

  return {
    users,
    stats,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updateUserStatus,
    refetch,
  }
}
