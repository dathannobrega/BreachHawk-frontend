import type { Invoice, Payment, Subscription, BillingStats } from "@/types/billing"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class BillingService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}/api/v1/billing${endpoint}`, {
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

    return response.json()
  }

  async getInvoices(): Promise<Invoice[]> {
    return this.makeRequest<Invoice[]>("/invoices")
  }

  async getPayments(): Promise<Payment[]> {
    return this.makeRequest<Payment[]>("/payments")
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return this.makeRequest<Subscription[]>("/subscriptions")
  }

  // Método para calcular estatísticas baseado nos dados reais do Stripe
  calculateStats(invoices: Invoice[], payments: Payment[], subscriptions: Subscription[]): BillingStats {
    const totalRevenue = payments
      .filter((p) => p.status === "succeeded")
      .reduce((acc, payment) => acc + payment.amount, 0)

    const pendingAmount = invoices
      .filter((i) => i.status === "open")
      .reduce((acc, invoice) => acc + invoice.amount_due, 0)

    const overdueAmount = invoices
      .filter((i) => {
        if (!i.due_date || i.status !== "open") return false
        const dueDate = new Date(i.due_date * 1000)
        return dueDate < new Date()
      })
      .reduce((acc, invoice) => acc + invoice.amount_due, 0)

    const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length

    // Calcular crescimento mensal baseado nos pagamentos dos últimos 2 meses
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    const lastMonthRevenue = payments
      .filter((p) => {
        const paymentDate = new Date(p.created * 1000)
        return p.status === "succeeded" && paymentDate >= lastMonth && paymentDate < now
      })
      .reduce((acc, payment) => acc + payment.amount, 0)

    const twoMonthsAgoRevenue = payments
      .filter((p) => {
        const paymentDate = new Date(p.created * 1000)
        return p.status === "succeeded" && paymentDate >= twoMonthsAgo && paymentDate < lastMonth
      })
      .reduce((acc, payment) => acc + payment.amount, 0)

    const monthlyGrowth =
      twoMonthsAgoRevenue > 0 ? ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100 : 0

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      activeSubscriptions,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100, // Arredondar para 2 casas decimais
    }
  }

  // Método para converter timestamp Unix para Date
  formatDate(timestamp?: number | null): string {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleDateString("pt-BR")
  }

  formatDateTime(timestamp?: number | null): string {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleString("pt-BR")
  }

  // Método para formatar moeda (Stripe amounts são em centavos)
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100)
  }

  // Métodos para traduzir status do Stripe
  translateInvoiceStatus(status?: string | null): string {
    if (!status) return "Desconhecido"
    const statusMap: Record<string, string> = {
      draft: "Rascunho",
      open: "Pendente",
      paid: "Pago",
      void: "Cancelado",
      uncollectible: "Incobrável",
    }
    return statusMap[status] || status
  }

  translatePaymentStatus(status?: string | null): string {
    if (!status) return "Desconhecido"
    const statusMap: Record<string, string> = {
      requires_payment_method: "Requer Método de Pagamento",
      requires_confirmation: "Requer Confirmação",
      requires_action: "Requer Ação",
      processing: "Processando",
      requires_capture: "Requer Captura",
      canceled: "Cancelado",
      succeeded: "Concluído",
    }
    return statusMap[status] || status
  }

  translateSubscriptionStatus(status?: string | null): string {
    if (!status) return "Desconhecido"
    const statusMap: Record<string, string> = {
      incomplete: "Incompleto",
      incomplete_expired: "Incompleto Expirado",
      trialing: "Trial",
      active: "Ativo",
      past_due: "Em Atraso",
      canceled: "Cancelado",
      unpaid: "Não Pago",
    }
    return statusMap[status] || status
  }

  // Método para obter ícone baseado no status
  getStatusIcon(status?: string | null): string {
    if (!status) return "Clock"
    switch (status) {
      case "paid":
      case "succeeded":
      case "active":
        return "CheckCircle"
      case "open":
      case "processing":
      case "trialing":
        return "Clock"
      case "void":
      case "canceled":
      case "uncollectible":
      case "past_due":
        return "XCircle"
      default:
        return "Clock"
    }
  }

  // Método para obter variante do badge
  getStatusVariant(status?: string | null): "default" | "destructive" | "secondary" {
    if (!status) return "secondary"
    switch (status) {
      case "paid":
      case "succeeded":
      case "active":
        return "default"
      case "void":
      case "canceled":
      case "uncollectible":
      case "past_due":
        return "destructive"
      default:
        return "secondary"
    }
  }
}

export const billingService = new BillingService()
