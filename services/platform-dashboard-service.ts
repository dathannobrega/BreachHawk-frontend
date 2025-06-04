import type { Company } from "@/types/company"
import type { PlatformUser } from "@/types/platform-user"
import { companyService } from "@/services/company-service"
import { platformUserService } from "@/services/platform-user-service"

export interface PlatformStats {
  totalCompanies: number
  totalUsers: number
  activeUsers: number
  activeCompanies: number
  monthlyRevenue: number
  activeSubscriptions: number
  growthMetrics: {
    companiesGrowth: number
    usersGrowth: number
    revenueGrowth: number
  }
}

export interface TopCompany {
  id: number
  name: string
  domain: string
  plan: string
  userCount: number
  status: string
  revenue: number
}

export interface RecentActivity {
  id: string
  type: "company_created" | "user_created" | "plan_upgrade" | "payment_received"
  company: string
  description: string
  date: string
  value?: string
}

class PlatformDashboardService {
  async getDashboardData(): Promise<{
    stats: PlatformStats
    topCompanies: TopCompany[]
    recentActivity: RecentActivity[]
  }> {
    try {
      // Buscar dados em paralelo
      const [companies, users] = await Promise.all([companyService.getCompanies(), platformUserService.getUsers()])

      // Calcular estatísticas
      const stats = this.calculateStats(companies, users)
      const topCompanies = this.getTopCompanies(companies, users)
      const recentActivity = this.generateRecentActivity(companies, users)

      return {
        stats,
        topCompanies,
        recentActivity,
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
      throw error
    }
  }

  private calculateStats(companies: Company[], users: PlatformUser[]): PlatformStats {
    const totalCompanies = companies.length
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "active").length
    const activeCompanies = companies.filter((c) => c.status === "active").length

    // Calcular receita baseada nos planos
    const planPrices = {
      trial: 0,
      basic: 29,
      professional: 99,
      enterprise: 299,
    }

    const monthlyRevenue = companies
      .filter((c) => c.status === "active")
      .reduce((total, company) => {
        return total + (planPrices[company.plan as keyof typeof planPrices] || 0)
      }, 0)

    const activeSubscriptions = companies.filter((c) => c.status === "active" && c.plan !== "trial").length

    // Simular métricas de crescimento (em produção, viria do banco de dados)
    const growthMetrics = {
      companiesGrowth: 12,
      usersGrowth: 8,
      revenueGrowth: 15,
    }

    return {
      totalCompanies,
      totalUsers,
      activeUsers,
      activeCompanies,
      monthlyRevenue,
      activeSubscriptions,
      growthMetrics,
    }
  }

  private getTopCompanies(companies: Company[], users: PlatformUser[]): TopCompany[] {
    const planPrices = {
      trial: 0,
      basic: 29,
      professional: 99,
      enterprise: 299,
    }

    return companies
      .map((company) => {
        const userCount = users.filter((u) => u.company === company.name).length
        const revenue = planPrices[company.plan as keyof typeof planPrices] || 0

        return {
          id: company.id,
          name: company.name,
          domain: company.domain,
          plan: company.plan,
          userCount,
          status: company.status,
          revenue,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  private generateRecentActivity(companies: Company[], users: PlatformUser[]): RecentActivity[] {
    const activities: RecentActivity[] = []

    // Adicionar atividades baseadas em dados reais
    companies
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 3)
      .forEach((company, index) => {
        activities.push({
          id: `company-${company.id}`,
          type: "company_created",
          company: company.name,
          description: "Nova empresa cadastrada",
          date: company.created_at || new Date().toISOString(),
          value: company.plan === "trial" ? "Trial" : `+$${this.getPlanPrice(company.plan)}`,
        })
      })

    users
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 2)
      .forEach((user) => {
        activities.push({
          id: `user-${user.id}`,
          type: "user_created",
          company: user.company || "N/A",
          description: `Novo usuário: ${user.first_name} ${user.last_name}`,
          date: user.created_at || new Date().toISOString(),
        })
      })

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }

  private getPlanPrice(plan: string): number {
    const prices = {
      trial: 0,
      basic: 29,
      professional: 99,
      enterprise: 299,
    }
    return prices[plan as keyof typeof prices] || 0
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR")
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
}

export const platformDashboardService = new PlatformDashboardService()
