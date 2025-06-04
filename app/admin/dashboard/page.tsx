"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Globe, Key, AlertTriangle, TrendingUp, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "admin") return null

  // Dados simulados
  const stats = {
    sites: 42,
    keywords: 156,
    leaks: 8,
    users: 12,
  }

  const recentLeaks = [
    {
      id: 1,
      site: "example.com",
      keyword: "senha123",
      date: "2023-05-15",
      severity: "high",
      user: "João Silva",
    },
    {
      id: 2,
      site: "test.org",
      keyword: "api_key",
      date: "2023-05-14",
      severity: "medium",
      user: "Maria Santos",
    },
    {
      id: 3,
      site: "demo.net",
      keyword: "admin",
      date: "2023-05-13",
      severity: "low",
      user: "Pedro Costa",
    },
  ]

  const recentSites = [
    {
      id: 1,
      url: "example.com",
      status: "active",
      keywords: 12,
      lastScan: "2023-05-15",
      owner: "João Silva",
    },
    {
      id: 2,
      url: "test.org",
      status: "active",
      keywords: 8,
      lastScan: "2023-05-14",
      owner: "Maria Santos",
    },
    {
      id: 3,
      url: "demo.net",
      status: "inactive",
      keywords: 5,
      lastScan: "2023-05-10",
      owner: "Pedro Costa",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">
              Empresa: {user.company?.name || "Sem empresa"} | Visão geral do sistema
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => router.push("/admin/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.sites}</p>
                  <p className="text-gray-600">Sites Monitorados</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.keywords}</p>
                  <p className="text-gray-600">Palavras-chave</p>
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.leaks}</p>
                  <p className="text-gray-600">Vazamentos Detectados</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-500">-3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                  <p className="text-gray-600">Usuários</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leaks */}
          <Card>
            <CardHeader>
              <CardTitle>Vazamentos Recentes</CardTitle>
              <CardDescription>Últimos vazamentos detectados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Palavra-chave</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Severidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeaks.map((leak) => (
                    <TableRow key={leak.id}>
                      <TableCell className="font-medium">{leak.site}</TableCell>
                      <TableCell>{leak.keyword}</TableCell>
                      <TableCell>{leak.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(leak.severity)}`}></div>
                          <span className="capitalize">{leak.severity}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Sites */}
          <Card>
            <CardHeader>
              <CardTitle>Sites Monitorados</CardTitle>
              <CardDescription>Sites atualmente sendo monitorados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Keywords</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.url}</TableCell>
                      <TableCell>
                        <Badge variant={site.status === "active" ? "default" : "secondary"}>
                          {site.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{site.owner}</TableCell>
                      <TableCell>{site.keywords}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
