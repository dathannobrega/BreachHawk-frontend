"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Globe, Key, AlertTriangle, Settings, BarChart3, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { PageHeader } from "@/components/templates/page-header"
import { StatCard } from "@/components/templates/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user, router])

  // Dados simulados
  const stats = {
    sites: 42,
    keywords: 156,
    leaks: 8,
    users: 12,
    activeScans: 3,
    systemHealth: "good",
  }

  const recentLeaks = [
    { id: 1, site: "example.com", keyword: "senha123", date: "2023-05-15", severity: "high", user: "João Silva" },
    { id: 2, site: "test.org", keyword: "api_key", date: "2023-05-14", severity: "medium", user: "Maria Santos" },
  ]

  const recentSites = [
    { id: 1, url: "example.com", status: "active", keywords: 12, lastScan: "2023-05-15", owner: "João Silva" },
    { id: 2, url: "test.org", status: "active", keywords: 8, lastScan: "2023-05-14", owner: "Maria Santos" },
  ]

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Alto</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
            Médio
          </Badge>
        )
      default:
        return <Badge variant="outline">Baixo</Badge>
    }
  }

  const getSystemHealthBadge = (health: string) => {
    if (health === "good") return <Badge className="bg-green-100 text-green-800">Bom</Badge>
    if (health === "warning") return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>
    return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
  }

  if (loading || !user || user.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard Administrativo"
        description={`Empresa: ${user.company?.name || "N/A"} | Visão geral do sistema`}
        actionButton={{
          label: "Configurações",
          icon: Settings,
          onClick: () => router.push("/admin/settings"),
        }}
      />

      <div className="mb-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 bg-white shadow-sm">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Último Dia</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          title="Sites Monitorados"
          value={stats.sites}
          icon={Globe}
          trend={{ value: "+5%", direction: "up" }}
          className="xl:col-span-2"
        />
        <StatCard
          title="Palavras-chave"
          value={stats.keywords}
          icon={Key}
          iconColorClass="text-green-600"
          iconBgClass="bg-green-100"
          trend={{ value: "+12%", direction: "up" }}
          className="xl:col-span-2"
        />
        <StatCard
          title="Vazamentos"
          value={stats.leaks}
          icon={AlertTriangle}
          iconColorClass="text-red-600"
          iconBgClass="bg-red-100"
          trend={{ value: "-3%", direction: "down" }}
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.users}
          icon={Users}
          iconColorClass="text-purple-600"
          iconBgClass="bg-purple-100"
          trend={{ value: "+2", direction: "up" }}
        />
        <StatCard
          title="Scans Ativos"
          value={stats.activeScans}
          icon={Activity}
          className="lg:col-span-1 xl:col-span-3"
        />
        <StatCard
          title="Saúde do Sistema"
          value={getSystemHealthBadge(stats.systemHealth)}
          icon={BarChart3}
          className="lg:col-span-2 xl:col-span-3"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Leaks */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Vazamentos Recentes</CardTitle>
            <CardDescription>Últimos vazamentos detectados no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeaks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-600">
                    <tr>
                      <th className="p-2 font-medium">Site</th>
                      <th className="p-2 font-medium">Keyword</th>
                      <th className="p-2 font-medium">Usuário</th>
                      <th className="p-2 font-medium">Severidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaks.map((leak) => (
                      <tr key={leak.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-2 text-slate-800 font-medium">{leak.site}</td>
                        <td className="p-2 text-slate-700">{leak.keyword}</td>
                        <td className="p-2 text-slate-700">{leak.user}</td>
                        <td className="p-2">{getSeverityBadge(leak.severity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum vazamento recente.</p>
            )}
          </CardContent>
        </Card>

        {/* Monitored Sites */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Sites Monitorados</CardTitle>
            <CardDescription>Sites atualmente sendo monitorados pela plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSites.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-600">
                    <tr>
                      <th className="p-2 font-medium">URL</th>
                      <th className="p-2 font-medium">Status</th>
                      <th className="p-2 font-medium">Proprietário</th>
                      <th className="p-2 font-medium">Keywords</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSites.map((site) => (
                      <tr key={site.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-2 text-slate-800 font-medium">{site.url}</td>
                        <td className="p-2">
                          <Badge
                            variant={site.status === "active" ? "default" : "secondary"}
                            className={site.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {site.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="p-2 text-slate-700">{site.owner}</td>
                        <td className="p-2 text-slate-700 text-center">{site.keywords}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum site monitorado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
