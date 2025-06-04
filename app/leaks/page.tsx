"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Eye, CheckCircle, Clock, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function LeaksPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

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
  const leaks = [
    {
      id: 1,
      source: "forum-hacker.net",
      content: "Credenciais de acesso encontradas",
      date: "2023-05-15",
      status: "active",
      severity: "critical",
      type: "credentials",
      affected: "admin@empresa.com",
    },
    {
      id: 2,
      source: "darkweb-marketplace.onion",
      content: "Dados de cartão de crédito expostos",
      date: "2023-05-14",
      status: "investigating",
      severity: "high",
      type: "financial",
      affected: "4 cartões",
    },
    {
      id: 3,
      source: "breach-database.onion",
      content: "Informações pessoais de clientes",
      date: "2023-05-12",
      status: "resolved",
      severity: "medium",
      type: "personal",
      affected: "150 registros",
    },
    {
      id: 4,
      source: "hacker-forum.net",
      content: "Menção à empresa em discussão",
      date: "2023-05-10",
      status: "monitoring",
      severity: "low",
      type: "mention",
      affected: "empresa.com",
    },
  ]

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "monitoring":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "investigating":
        return "Investigando"
      case "resolved":
        return "Resolvido"
      case "monitoring":
        return "Monitorando"
      default:
        return status
    }
  }

  const filteredLeaks = leaks.filter((leak) => {
    if (filter !== "all" && leak.status !== filter) return false
    if (severityFilter !== "all" && leak.severity !== severityFilter) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vazamentos Detectados</h1>
          <p className="text-gray-600 mt-2">Monitore e gerencie vazamentos de dados da sua empresa</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {leaks.filter((l) => l.status === "active").length}
                  </p>
                  <p className="text-gray-600">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {leaks.filter((l) => l.status === "investigating").length}
                  </p>
                  <p className="text-gray-600">Investigando</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {leaks.filter((l) => l.status === "resolved").length}
                  </p>
                  <p className="text-gray-600">Resolvidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {leaks.filter((l) => l.status === "monitoring").length}
                  </p>
                  <p className="text-gray-600">Monitorando</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Vazamentos</CardTitle>
                <CardDescription>Todos os vazamentos detectados para sua empresa</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="investigating">Investigando</SelectItem>
                      <SelectItem value="resolved">Resolvidos</SelectItem>
                      <SelectItem value="monitoring">Monitorando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Severidade</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Conteúdo</TableHead>
                  <TableHead>Afetado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaks.map((leak) => (
                  <TableRow key={leak.id}>
                    <TableCell className="font-medium">{leak.source}</TableCell>
                    <TableCell>{leak.content}</TableCell>
                    <TableCell>{leak.affected}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(leak.status)}
                        <span>{getStatusLabel(leak.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(leak.severity)}`}></div>
                        <Badge
                          variant={
                            leak.severity === "critical" || leak.severity === "high" ? "destructive" : "secondary"
                          }
                        >
                          {leak.severity}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{leak.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {leak.status === "active" && (
                          <Button size="sm" variant="default">
                            Investigar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
