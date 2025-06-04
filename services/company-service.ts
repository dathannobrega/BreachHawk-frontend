import type { Company, CompanyCreate, CompanyUpdate, CompanyStats } from "@/types/company"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class CompanyService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}/api/v1/companies${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    // Para DELETE requests que retornam 204, não há conteúdo para parsear
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async getCompanies(): Promise<Company[]> {
    return this.makeRequest<Company[]>("/")
  }

  async getCompany(id: number): Promise<Company> {
    return this.makeRequest<Company>(`/${id}`)
  }

  async createCompany(data: CompanyCreate): Promise<Company> {
    return this.makeRequest<Company>("/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCompany(id: number, data: CompanyUpdate): Promise<Company> {
    return this.makeRequest<Company>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCompany(id: number): Promise<void> {
    await this.makeRequest<void>(`/${id}`, {
      method: "DELETE",
    })
  }

  // Método para calcular estatísticas baseado nos dados
  calculateStats(companies: Company[]): CompanyStats {
    const totalCompanies = companies.length
    const activeCompanies = companies.filter((c) => c.status === "active").length
    const trialCompanies = companies.filter((c) => c.plan === "trial").length

    // Simulação de dados que viriam de outras APIs ou cálculos reais
    const totalUsers = companies.reduce((acc, company) => {
      if (company.status !== "active") return acc
      const usersByPlan = {
        trial: 5,
        basic: 15,
        professional: 30,
        enterprise: 50,
      }
      return acc + usersByPlan[company.plan]
    }, 0)

    const monthlyRevenue = companies.reduce((acc, company) => {
      if (company.status !== "active") return acc
      const revenueByPlan = {
        trial: 0,
        basic: 50000, // R$ 500,00 em centavos
        professional: 180000, // R$ 1.800,00 em centavos
        enterprise: 250000, // R$ 2.500,00 em centavos
      }
      return acc + revenueByPlan[company.plan]
    }, 0)

    return {
      totalCompanies,
      activeCompanies,
      totalUsers,
      monthlyRevenue,
      trialCompanies,
    }
  }

  // Métodos utilitários
  formatDate(dateString?: string | null): string {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100) // Assumindo que valores estão em centavos
  }

  translatePlan(plan: string): string {
    const planMap: Record<string, string> = {
      trial: "Trial",
      basic: "Básico",
      professional: "Profissional",
      enterprise: "Enterprise",
    }
    return planMap[plan] || plan
  }

  translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso",
    }
    return statusMap[status] || status
  }

  getPlanColor(plan: string): string {
    const colorMap: Record<string, string> = {
      trial: "bg-yellow-500",
      basic: "bg-green-500",
      professional: "bg-blue-500",
      enterprise: "bg-purple-500",
    }
    return colorMap[plan] || "bg-gray-500"
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      suspended: "bg-red-500",
    }
    return colorMap[status] || "bg-gray-500"
  }

  // Método para validar dados antes do envio
  validateCompanyData(data: CompanyCreate | CompanyUpdate): string[] {
    const errors: string[] = []

    if ("name" in data && data.name && data.name.trim().length < 2) {
      errors.push("Nome da empresa deve ter pelo menos 2 caracteres")
    }

    if ("domain" in data && data.domain && !data.domain.includes(".")) {
      errors.push("Domínio deve ser válido (ex: empresa.com)")
    }

    if ("contact_email" in data && data.contact_email && !data.contact_email.includes("@")) {
      errors.push("Email de contato deve ser válido")
    }

    return errors
  }
}

export const companyService = new CompanyService()
