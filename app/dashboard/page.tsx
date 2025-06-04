"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, AlertTriangle, CheckCircle, Globe, Mail, Building, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function UserDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  // Dados simulados
  const stats = {
    searches: 24,
    protectedDomains: 3,
    leaksDetected: 2,
    leaksResolved: 1,
  }

  const recentSearches = [
    {
      id: 1,
      query: "meu-dominio.com.br",
      type: "domain",
      date: "2023-05-15",
      results: 5,
    },
    {
      id: 2,
      query: "email@empresa.com",
      type: "email",
      date: "2023-05-14",
      results: 2,
    },
    {
      id: 3,
      query: "nome da empresa",
      type: "company",
      date: "2023-05-12",
      results: 8,
    },
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
        return <Globe className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "company":
        return <Building className="h-4 w-4" />
      case "person":
        return <User className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user.firstName || user.username}!</h1>
          <p className="text-gray-600 mt-2">Aqui está um resumo da sua proteção digital.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.searches}</p>
                  <p className="text-gray-600">Pesquisas realizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.protectedDomains}</p>
                  <p className="text-gray-600">Domínios protegidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.leaksDetected}</p>
                  <p className="text-gray-600">Vazamentos detectados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.leaksResolved}</p>
                  <p className="text-gray-600">Vazamentos resolvidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pesquisas Recentes</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/search")}>
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSearches.map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getSearchIcon(search.type)}
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-sm text-gray-600">{search.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{search.results} resultados</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leaks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vazamentos Recentes</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/leaks")}>
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaks.map((leak) => (
                  <div key={leak.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{leak.source}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(leak.severity)}`}></div>
                        <Badge variant={leak.status === "active" ? "destructive" : "secondary"}>
                          {leak.status === "active" ? "Ativo" : "Resolvido"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{leak.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{leak.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Proteja mais domínios</h3>
                <p className="opacity-90">
                  Adicione mais domínios e e-mails para monitoramento contínuo e proteção avançada.
                </p>
              </div>
              <Button variant="secondary" onClick={() => router.push("/search")}>
                Nova Pesquisa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
