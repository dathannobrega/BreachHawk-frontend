"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, AlertTriangle, CheckCircle, Globe, Mail, Building, User, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { PageHeader } from "@/components/templates/page-header"
import { StatCard } from "@/components/templates/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function UserDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Dados simulados
  const stats = {
    searches: 24,
    protectedDomains: 3,
    leaksDetected: 2,
    leaksResolved: 1,
  }

  const recentSearches = [
    { id: 1, query: "meu-dominio.com.br", type: "domain", date: "2023-05-15", results: 5 },
    { id: 2, query: "email@empresa.com", type: "email", date: "2023-05-14", results: 2 },
    { id: 3, query: "nome da empresa", type: "company", date: "2023-05-12", results: 8 },
  ]

  const recentLeaks = [
    {
      id: 1,
      source: "forum-hacker.net",
      content: "Credenciais de acesso",
      date: "2023-05-10",
      status: "resolved",
      severity: "high",
    },
    {
      id: 2,
      source: "darkweb-marketplace.onion",
      content: "Dados de cartão de crédito",
      date: "2023-05-08",
      status: "active",
      severity: "critical",
    },
  ]

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "domain":
        return <Globe className="h-4 w-4 text-slate-500" />
      case "email":
        return <Mail className="h-4 w-4 text-slate-500" />
      case "company":
        return <Building className="h-4 w-4 text-slate-500" />
      case "person":
        return <User className="h-4 w-4 text-slate-500" />
      default:
        return <Search className="h-4 w-4 text-slate-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
            Alto
          </Badge>
        )
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

  if (loading || !user) {
    // O DashboardLayout já tem um spinner, mas podemos adicionar um placeholder aqui se necessário.
    return null
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`Bem-vindo, ${user.first_name || user.username}!`}
        description="Aqui está um resumo da sua proteção digital."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          title="Pesquisas Realizadas"
          value={stats.searches}
          icon={Search}
          description="No último mês"
          trend={{ value: "+5%", direction: "up" }}
        />
        <StatCard
          title="Domínios Protegidos"
          value={stats.protectedDomains}
          icon={Shield}
          iconColorClass="text-green-600"
          iconBgClass="bg-green-100"
        />
        <StatCard
          title="Vazamentos Detectados"
          value={stats.leaksDetected}
          icon={AlertTriangle}
          iconColorClass="text-red-600"
          iconBgClass="bg-red-100"
          trend={{ value: "-2", direction: "down" }}
        />
        <StatCard
          title="Vazamentos Resolvidos"
          value={stats.leaksResolved}
          icon={CheckCircle}
          iconColorClass="text-green-600"
          iconBgClass="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Searches */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Pesquisas Recentes</CardTitle>
            <CardDescription>Suas últimas atividades de busca na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSearches.length > 0 ? (
              <ul className="space-y-3">
                {recentSearches.map((search) => (
                  <li
                    key={search.id}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getSearchIcon(search.type)}
                      <div>
                        <p className="font-medium text-slate-800">{search.query}</p>
                        <p className="text-xs text-slate-500">{search.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{search.results} resultados</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhuma pesquisa recente.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => router.push("/search")}>
              <Search className="mr-2 h-4 w-4" /> Nova Pesquisa
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/settings#domains")}>
              <Globe className="mr-2 h-4 w-4" /> Gerenciar Domínios
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/leaks")}>
              <Shield className="mr-2 h-4 w-4" /> Ver Vazamentos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leaks */}
      <Card className="mt-6 md:mt-8 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Vazamentos Recentes</CardTitle>
          <CardDescription>Vazamentos detectados que requerem sua atenção.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLeaks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-600">
                  <tr>
                    <th className="p-2 font-medium">Fonte</th>
                    <th className="p-2 font-medium">Conteúdo</th>
                    <th className="p-2 font-medium">Data</th>
                    <th className="p-2 font-medium">Severidade</th>
                    <th className="p-2 font-medium">Status</th>
                    <th className="p-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaks.map((leak) => (
                    <tr key={leak.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-slate-800">{leak.source}</td>
                      <td className="p-2 text-slate-700">{leak.content}</td>
                      <td className="p-2 text-slate-500">{leak.date}</td>
                      <td className="p-2">{getSeverityBadge(leak.severity)}</td>
                      <td className="p-2">
                        <Badge
                          variant={leak.status === "active" ? "destructive" : "default"}
                          className={leak.status === "resolved" ? "bg-green-100 text-green-800" : ""}
                        >
                          {leak.status === "active" ? "Ativo" : "Resolvido"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/leaks/${leak.id}`)}>
                          Detalhes <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Nenhum vazamento recente. Você está seguro!</p>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
