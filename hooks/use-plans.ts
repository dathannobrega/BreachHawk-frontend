"use client"

import { useState, useEffect } from "react"
import { planService } from "@/services/plan-service"
import type { Plan, PlanCreate, PlanUpdate } from "@/types/plan"

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await planService.getAll()
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar planos")
      console.error("Error loading plans:", err)
    } finally {
      setLoading(false)
    }
  }

  const createPlan = async (data: PlanCreate): Promise<Plan> => {
    const newPlan = await planService.create(data)
    setPlans((prev) => [...prev, newPlan])
    return newPlan
  }

  const updatePlan = async (id: number, data: PlanUpdate): Promise<Plan> => {
    const updatedPlan = await planService.update(id, data)
    setPlans((prev) => prev.map((plan) => (plan.id === id ? updatedPlan : plan)))
    return updatedPlan
  }

  const deletePlan = async (id: number): Promise<void> => {
    await planService.delete(id)
    setPlans((prev) => prev.filter((plan) => plan.id !== id))
  }

  useEffect(() => {
    loadPlans()
  }, [])

  return {
    plans,
    loading,
    error,
    loadPlans,
    createPlan,
    updatePlan,
    deletePlan,
  }
}
