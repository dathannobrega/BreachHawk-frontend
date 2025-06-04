// Tipos baseados nos schemas do backend
export interface Invoice {
  id: string
  customer?: string | null
  amount_due: number
  status?: string | null
  due_date?: number | null
}

export interface Payment {
  id: string
  amount: number
  status?: string | null
  created: number
}

export interface Subscription {
  id: string
  customer?: string | null
  status?: string | null
  current_period_end?: number | null
}

// Tipos para estatísticas calculadas
export interface BillingStats {
  totalRevenue: number
  pendingAmount: number
  overdueAmount: number
  activeSubscriptions: number
  monthlyGrowth: number
}

// Tipos para filtros
export interface BillingFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  customer?: string
}
