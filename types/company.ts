// Atualizar para corresponder exatamente aos schemas Pydantic
export type PlanType = "trial" | "basic" | "professional" | "enterprise"
export type CompanyStatus = "active" | "inactive" | "suspended"

export interface Company {
  id: number
  name: string
  domain: string
  contact_name?: string | null
  contact_email?: string | null
  plan: PlanType
  status: CompanyStatus
  created_at?: string | null
}

export interface CompanyCreate {
  name: string
  domain: string
  contact_name?: string | null
  contact_email?: string | null
  plan?: PlanType
  status?: CompanyStatus
}

export interface CompanyUpdate {
  name?: string | null
  domain?: string | null
  contact_name?: string | null
  contact_email?: string | null
  plan?: PlanType | null
  status?: CompanyStatus | null
}

export interface CompanyStats {
  totalCompanies: number
  activeCompanies: number
  totalUsers: number
  monthlyRevenue: number
  trialCompanies: number
}
