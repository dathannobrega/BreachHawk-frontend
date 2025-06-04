"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Users, DollarSign, TrendingUp, CreditCard, RefreshCw, UserCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { usePlatformDashboard } from "@/hooks/use-platform-dashboard"
import { platformDashboardService } from "@/services/platform-dashboard-service"

export default function PlatformDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { stats, topCompanies, recentActivity, loading, error, refetch } = usePlatformDashboard()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user])

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "platform_admin") return null

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard da Plataforma</h1>
            <p className="text-gray-600 mt-2">Visão geral completa do BreachHawk</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Platform Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                    <p className="text-gray-600">Empresas Cadastradas</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+{stats.growthMetrics.companiesGrowth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-gray-600">Usuários Totais</p>
                    <div className="flex items-center mt-1">
                      <UserCheck className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-xs text-blue-500">{stats.activeUsers} ativos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {platformDashboardService.formatCurrency(stats.monthlyRevenue)}
                    </p>
                    <p className="text-gray-600">Receita Mensal</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+{stats.growthMetrics.revenueGrowth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                    <p className="text-gray-600">Assinaturas Ativas</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{stats.activeCompanies} empresas ativas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Principais Clientes</CardTitle>
              <CardDescription>Empresas com maior receita</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-gray-500">{company.domain}</p>
                          <Badge
                            variant={company.status === "active" ? "default" : "secondary"}
                            className="text-xs mt-1"
                          >
                            {platformDashboardService.translateStatus(company.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{platformDashboardService.translatePlan(company.plan)}</Badge>
                      </TableCell>
                      <TableCell>{company.userCount}</TableCell>
                      <TableCell className="font-medium">
                        {platformDashboardService.formatCurrency(company.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.company}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{platformDashboardService.formatDate(activity.date)}</p>
                    </div>
                    {activity.value && (
                      <div className="text-right">
                        <p className="font-medium text-green-600">{activity.value}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Planos</CardTitle>
            <CardDescription>Distribuição de empresas por plano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["trial", "basic", "professional", "enterprise"].map((plan) => {
                const companiesInPlan = topCompanies.filter((c) => c.plan === plan).length
                const revenue = topCompanies.filter((c) => c.plan === plan).reduce((sum, c) => sum + c.revenue, 0)

                return (
                  <div key={plan} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{platformDashboardService.translatePlan(plan)}</h3>
                      <Badge variant="outline">{companiesInPlan}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {platformDashboardService.formatCurrency(revenue)}
                    </p>
                    <p className="text-sm text-gray-600">Receita total</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
