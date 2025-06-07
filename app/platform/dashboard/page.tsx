"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Building, Users, DollarSign, CreditCard, RefreshCw, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { PageHeader } from "@/components/templates/page-header"
import { StatCard } from "@/components/templates/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { usePlatformDashboard } from "@/hooks/use-platform-dashboard"
import { platformDashboardService } from "@/services/platform-dashboard-service"
import { Alert, AlertDescription } from "@/components/ui/alert" // Import Alert

export default function PlatformDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { stats, topCompanies, recentActivity, loading, error, refetch } = usePlatformDashboard()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user, router])

  if (authLoading || loading || !user || user.role !== "platform_admin") {
    return null // DashboardLayout handles loading/auth state
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard da Plataforma"
        description="Visão geral completa do BreachHawk."
        actionButton={{
          label: loading ? "Atualizando..." : "Atualizar Dados",
          icon: RefreshCw,
          onClick: refetch,
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Empresas Cadastradas"
            value={stats.totalCompanies}
            icon={Building}
            trend={{ value: `+${stats.growthMetrics.companiesGrowth}%`, direction: "up" }}
          />
          <StatCard
            title="Usuários Totais"
            value={stats.totalUsers}
            icon={Users}
            iconColorClass="text-green-600"
            iconBgClass="bg-green-100"
            description={`${stats.activeUsers} ativos`}
          />
          <StatCard
            title="Receita Mensal"
            value={platformDashboardService.formatCurrency(stats.monthlyRevenue)}
            icon={DollarSign}
            iconColorClass="text-green-600"
            iconBgClass="bg-green-100"
            trend={{ value: `+${stats.growthMetrics.revenueGrowth}%`, direction: "up" }}
          />
          <StatCard
            title="Assinaturas Ativas"
            value={stats.activeSubscriptions}
            icon={CreditCard}
            iconColorClass="text-purple-600"
            iconBgClass="bg-purple-100"
            description={`${stats.activeCompanies} empresas ativas`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Top Companies */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Principais Clientes</CardTitle>
            <CardDescription>Empresas com maior receita e atividade na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {topCompanies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-600">
                    <tr>
                      <th className="p-2 font-medium">Empresa</th>
                      <th className="p-2 font-medium">Plano</th>
                      <th className="p-2 font-medium text-center">Usuários</th>
                      <th className="p-2 font-medium text-right">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCompanies.map((company) => (
                      <tr key={company.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-2">
                          <div className="font-medium text-slate-800">{company.name}</div>
                          <div className="text-xs text-slate-500">{company.domain}</div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{platformDashboardService.translatePlan(company.plan)}</Badge>
                        </td>
                        <td className="p-2 text-center text-slate-700">{company.userCount}</td>
                        <td className="p-2 text-right font-medium text-green-700">
                          {platformDashboardService.formatCurrency(company.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhuma empresa para exibir.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações importantes na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Activity className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-800">{activity.company}</p>
                      <p className="text-xs text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {platformDashboardService.formatDate(activity.date)}
                      </p>
                    </div>
                    {activity.value && (
                      <div className="ml-auto text-right">
                        <p className="font-medium text-sm text-green-600">{activity.value}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhuma atividade recente.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart / Plan Summary */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Resumo de Planos</CardTitle>
          <CardDescription>Distribuição de empresas e receita por plano.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["trial", "basic", "professional", "enterprise"].map((plan) => {
              const companiesInPlan = topCompanies.filter((c) => c.plan === plan).length
              const revenue = topCompanies.filter((c) => c.plan === plan).reduce((sum, c) => sum + c.revenue, 0)

              return (
                <div key={plan} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-primary-700">{platformDashboardService.translatePlan(plan)}</h3>
                    <Badge variant="secondary">{companiesInPlan} empresas</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {platformDashboardService.formatCurrency(revenue)}
                  </p>
                  <p className="text-xs text-slate-500">Receita total do plano</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
