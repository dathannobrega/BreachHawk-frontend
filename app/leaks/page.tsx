"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAlerts } from "@/hooks/use-monitoring"
import {
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Building,
  Globe,
  Eye,
  CheckCircle,
  Clock,
  Download,
  Key,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Alert as UIAlert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function LeaksPage() {
  const { alerts, loading, error, acknowledgeAlert } = useAlerts()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [acknowledgedFilter, setAcknowledgedFilter] = useState("all")

  const getSeverityLevel = (leak: any) => {
    const company = leak.company?.toLowerCase() || ""
    const info = leak.information?.toLowerCase() || ""
    const comment = leak.comment?.toLowerCase() || ""

    // Palavras-chave críticas
    const criticalKeywords = ["password", "credit", "card", "admin", "root", "database", "api", "token"]
    const highKeywords = ["email", "personal", "phone", "address", "user", "account"]
    const mediumKeywords = ["data", "info", "file", "document"]

    const text = `${company} ${info} ${comment}`.toLowerCase()

    if (criticalKeywords.some((keyword) => text.includes(keyword))) {
      return { level: "critical", label: "Crítico", color: "bg-red-100 text-red-800" }
    }
    if (highKeywords.some((keyword) => text.includes(keyword))) {
      return { level: "high", label: "Alto", color: "bg-orange-100 text-orange-800" }
    }
    if (mediumKeywords.some((keyword) => text.includes(keyword))) {
      return { level: "medium", label: "Médio", color: "bg-yellow-100 text-yellow-800" }
    }
    return { level: "low", label: "Baixo", color: "bg-blue-100 text-blue-800" }
  }

  const getStatus = (leak: any) => {
    const foundDate = new Date(leak.found_at)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - foundDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff <= 1) return { status: "new", label: "Novo", color: "bg-green-100 text-green-800" }
    if (daysDiff <= 7) return { status: "recent", label: "Recente", color: "bg-blue-100 text-blue-800" }
    if (daysDiff <= 30) return { status: "active", label: "Ativo", color: "bg-yellow-100 text-yellow-800" }
    return { status: "old", label: "Antigo", color: "bg-slate-100 text-slate-800" }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      !searchTerm ||
      alert.leak.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.leak.information?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.leak.comment?.toLowerCase().includes(searchTerm.toLowerCase())

    const severity = getSeverityLevel(alert.leak)
    const matchesSeverity = severityFilter === "all" || severity.level === severityFilter

    const status = getStatus(alert.leak)
    const matchesStatus = statusFilter === "all" || status.status === statusFilter

    const matchesAcknowledged =
      acknowledgedFilter === "all" ||
      (acknowledgedFilter === "acknowledged" && alert.acknowledged) ||
      (acknowledgedFilter === "unacknowledged" && !alert.acknowledged)

    return matchesSearch && matchesSeverity && matchesStatus && matchesAcknowledged
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const getStatsData = () => {
    const total = alerts.length
    const critical = alerts.filter((alert) => getSeverityLevel(alert.leak).level === "critical").length
    const recent = alerts.filter(
      (alert) => getStatus(alert.leak).status === "new" || getStatus(alert.leak).status === "recent",
    ).length
    const unacknowledged = alerts.filter((alert) => !alert.acknowledged).length
    const companies = new Set(alerts.map((alert) => alert.leak.company)).size

    return { total, critical, recent, unacknowledged, companies }
  }

  const handleAcknowledge = async (alertId: number, acknowledged: boolean) => {
    try {
      await acknowledgeAlert(alertId, acknowledged)
      toast({
        title: acknowledged ? "Alerta reconhecido" : "Reconhecimento removido",
        description: acknowledged ? "O alerta foi marcado como reconhecido" : "O reconhecimento do alerta foi removido",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status do alerta",
        variant: "destructive",
      })
    }
  }

  const stats = getStatsData()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vazamentos Detectados</h1>
            <p className="text-slate-600 mt-1">
              Monitore vazamentos de dados relacionados aos seus recursos monitorados
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recentes</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Reconhecidos</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unacknowledged}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Afetadas</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.companies}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por empresa, informação ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as severidades</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="recent">Recente</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="old">Antigo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={acknowledgedFilter} onValueChange={setAcknowledgedFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Reconhecimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="acknowledged">Reconhecidos</SelectItem>
                  <SelectItem value="unacknowledged">Não reconhecidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leaks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <UIAlert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <br />
                <small className="text-xs opacity-75">
                  Nota: Durante o desenvolvimento, dados de exemplo são exibidos quando a API não está disponível.
                </small>
              </AlertDescription>
            </UIAlert>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-slate-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhum vazamento encontrado com os filtros aplicados</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              const severity = getSeverityLevel(alert.leak)
              const status = getStatus(alert.leak)

              return (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    severity.level === "critical"
                      ? "border-l-red-500"
                      : severity.level === "high"
                        ? "border-l-orange-500"
                        : severity.level === "medium"
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                  } ${alert.acknowledged ? "bg-slate-50" : ""}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-slate-900">{alert.leak.company}</h3>
                          <Badge className={severity.color}>{severity.label}</Badge>
                          <Badge className={status.color}>{status.label}</Badge>
                          <Badge variant="outline">Alerta #{alert.id}</Badge>
                          {alert.acknowledged && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reconhecido
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Descoberto: {formatDate(alert.leak.found_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Alerta: {formatDate(alert.created_at)}</span>
                          </div>
                          {alert.leak.country && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span>País: {alert.leak.country}</span>
                            </div>
                          )}
                          {alert.leak.views && (
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>Visualizações: {alert.leak.views.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        {alert.leak.information && (
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-sm">
                              <strong>Informações:</strong> {alert.leak.information}
                            </p>
                          </div>
                        )}

                        {alert.leak.comment && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm italic">
                              <strong>Comentário:</strong> {alert.leak.comment}
                            </p>
                          </div>
                        )}

                        {alert.leak.amount_of_data && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>
                              <strong>Quantidade de dados:</strong> {alert.leak.amount_of_data}
                            </span>
                          </div>
                        )}

                        {alert.leak.download_links && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-700">
                              <Download className="h-4 w-4 inline mr-1" />
                              <strong>Links de download disponíveis</strong>
                            </p>
                          </div>
                        )}

                        {alert.leak.rar_password && (
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-sm text-orange-700">
                              <Key className="h-4 w-4 inline mr-1" />
                              <strong>Senha RAR:</strong> {alert.leak.rar_password}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        {alert.leak.source_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={alert.leak.source_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Fonte
                            </a>
                          </Button>
                        )}

                        <Button
                          variant={alert.acknowledged ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id, !alert.acknowledged)}
                        >
                          {alert.acknowledged ? (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              Desmarcar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reconhecer
                            </>
                          )}
                        </Button>

                        <Badge variant="secondary" className="text-xs">
                          Recurso #{alert.resource}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
