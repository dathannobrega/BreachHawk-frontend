"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Users, DollarSign, TrendingUp, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function PlatformDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "platform_admin") return null

  // Dados simulados para admin da plataforma
  const platformStats = {
    totalCompanies: 156,
    totalUsers: 2847,
    monthlyRevenue: 45600,
    activeSubscriptions: 142,
  }

  const revenueData = [
    { month: "Jan", revenue: 32000, subscriptions: 120 },
    { month: "Fev", revenue: 38000, subscriptions: 135 },
    { month: "Mar", revenue: 45600, subscriptions: 142 },
  ]

  const topCompanies = [
    {
      id: 1,
      name: "TechCorp Solutions",
      plan: "Enterprise",
      users: 45,
      revenue: 2500,
      status: "active",
    },
    {
      id: 2,
      name: "SecureBank Ltd",
      plan: "Professional",
      users: 32,
      revenue: 1800,
      status: "active",
    },
    {
      id: 3,
      name: "DataSafe Inc",
      plan: "Professional",
      users: 28,
      revenue: 1800,
      status: "trial",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      company: "TechCorp Solutions",
      action: "Upgrade to Enterprise",
      date: "2023-05-15",
      value: "+$1000",
    },
    {
      id: 2,
      company: "NewStartup Co",
      action: "New Registration",
      date: "2023-05-14",
      value: "+$299",
    },
    {
      id: 3,
      company: "SecureBank Ltd",
      action: "Payment Received",
      date: "2023-05-13",
      value: "+$1800",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

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
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{platformStats.totalCompanies}</p>
                  <p className="text-gray-600">Empresas Cadastradas</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12%</span>
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
                  <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers}</p>
                  <p className="text-gray-600">Usuários Ativos</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+8%</span>
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
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.monthlyRevenue)}</p>
                  <p className="text-gray-600">Receita Mensal</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+15%</span>
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
                  <p className="text-2xl font-bold text-gray-900">{platformStats.activeSubscriptions}</p>
                  <p className="text-gray-600">Assinaturas Ativas</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                          <Badge variant={company.status === "active" ? "default" : "secondary"} className="text-xs">
                            {company.status === "active" ? "Ativo" : "Trial"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{company.plan}</Badge>
                      </TableCell>
                      <TableCell>{company.users}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(company.revenue)}</TableCell>
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
              <CardDescription>Últimas transações e eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.company}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{activity.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Receita e assinaturas nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">{data.month}</span>
                    </div>
                    <div>
                      <p className="font-medium">Receita: {formatCurrency(data.revenue)}</p>
                      <p className="text-sm text-gray-600">Assinaturas: {data.subscriptions}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.revenue / 50000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
