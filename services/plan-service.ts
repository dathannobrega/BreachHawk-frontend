import { getAuthHeaders } from "@/lib/utils"
import type { Plan, PlanCreate, PlanUpdate } from "@/types/plan"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class PlanService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api/v1${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
    }

    // Handle 204 No Content for DELETE requests
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async getAll(): Promise<Plan[]> {
    return this.request<Plan[]>("/plans")
  }

  async getById(id: number): Promise<Plan> {
    return this.request<Plan>(`/plans/${id}`)
  }

  async create(data: PlanCreate): Promise<Plan> {
    return this.request<Plan>("/plans", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: PlanUpdate): Promise<Plan> {
    return this.request<Plan>(`/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<void> {
    return this.request<void>(`/plans/${id}`, {
      method: "DELETE",
    })
  }
}

export const planService = new PlanService()
