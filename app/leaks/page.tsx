"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Eye, CheckCircle, Clock, Filter, ExternalLink, Calendar, Globe, Database } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAlerts } from "@/hooks/use-monitoring"
import DashboardLayout from "@/components/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LeaksPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeverityLevel = (leak: any) => {
    const riskKeywords = ["password", "admin", "root", "database", "api", "credit", "card"]
    const hasHighRisk = riskKeywords.some(
      (keyword) =>
        leak.company.toLowerCase().includes(keyword) ||
        leak.information?.toLowerCase().includes(keyword) ||
        leak.comment?.toLowerCase().includes(keyword),
    )

    if (hasHighRisk) return "critical"
    if (leak.views && leak.views > 1000) return "high"
    if (leak.amount_of_data) return "medium"
    return "low"
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

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getStatusFromDate = (foundAt: string) => {
    const foundDate = new Date(foundAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - foundDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff <= 7) return "active"
    if (daysDiff <= 30) return "investigating"
    return "monitoring"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "monitoring":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Recente"
      case "investigating":
        return "Investigando"
      case "monitoring":
        return "Monitorando"
      default:
        return status
    }
  }

  // Converter alertas para o formato de leaks
  const leaks = alerts.map((alert) => ({
    id: alert.leak.id,
    source: new URL(alert.leak.source_url).hostname,
    content: alert.leak.information || "Vazamento detectado",
    date: alert.leak.found_at.split("T")[0],
    status: getStatusFromDate(alert.leak.found_at),
    severity: getSeverityLevel(alert.leak),
    type: "data",
    affected: alert.leak.company,
    company: alert.leak.company,
    source_url: alert.leak.source_url,
    views: alert.leak.views,
    country: alert.leak.country,
    amount_of_data: alert.leak.amount_of_data,
    comment: alert.leak.comment,
    publication_date: alert.leak.publication_date,
    found_at: alert.leak.found_at,
    alert_id: alert.id,
    resource_id: alert.resource,
    alert_created_at: alert.created_at,
  }))

  const filteredLeaks = leaks.filter((leak) => {
    if (filter !== "all" && leak.status !== filter) return false
    if (severityFilter !== "all" && leak.severity !== severityFilter) return false
    return true
  })

  const stats = {
    active: leaks.filter((l) => l.status === "active").length,
    investigating: leaks.filter((l) => l.status === "investigating").length,
    monitoring: leaks.filter((l) => l.status === "monitoring").length,
    resolved: 0, // Não temos status "resolved" nos dados reais
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Vazamentos Detectados</h1>
          <p className="text-slate-600 mt-2">
            Monitore vazamentos de dados relacionados às suas palavras-chave monitoradas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-red-900">{stats.active}</p>
                  <p className="text-slate-600">Recentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-yellow-900">{stats.investigating}</p>
                  <p className="text-slate-600">Investigando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-900">{stats.monitoring}</p>
                  <p className="text-slate-600">Monitorando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-900">{leaks.length}</p>
                  <p className="text-slate-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">Lista de Vazamentos</CardTitle>
                <CardDescription>Vazamentos detectados relacionados às suas palavras-chave monitoradas</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Recentes</SelectItem>
                      <SelectItem value="investigating">Investigando</SelectItem>
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
            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : alertsError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{alertsError}</AlertDescription>
              </Alert>
            ) : filteredLeaks.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Nenhum vazamento encontrado</p>
                <p className="text-sm text-slate-500 mt-1">
                  {filter !== "all" || severityFilter !== "all"
                    ? "Tente ajustar os filtros para ver mais resultados"
                    : "Os vazamentos aparecerão aqui quando forem detectados"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaks.map((leak) => (
                  <Card key={leak.alert_id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(leak.severity)}`} />
                            <h3 className="font-semibold text-slate-900">{leak.company}</h3>
                            <Badge className={getSeverityBadge(leak.severity)}>{leak.severity}</Badge>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(leak.status)}
                              <span className="text-sm text-slate-600">{getStatusLabel(leak.status)}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Alerta #{leak.alert_id}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="space-y-1">
                              <p className="text-slate-600">
                                <Globe className="h-4 w-4 inline mr-1" />
                                <strong>Fonte:</strong> {leak.source}
                              </p>
                              <p className="text-slate-600">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                <strong>Encontrado:</strong> {formatDate(leak.found_at)}
                              </p>
                              <p className="text-slate-600">
                                <strong>Alerta criado:</strong> {formatDate(leak.alert_created_at)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              {leak.country && (
                                <p className="text-slate-600">
                                  <strong>País:</strong> {leak.country}
                                </p>
                              )}
                              {leak.views && (
                                <p className="text-slate-600">
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  <strong>Visualizações:</strong> {leak.views.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1">
                              {leak.amount_of_data && (
                                <p className="text-slate-600">
                                  <Database className="h-4 w-4 inline mr-1" />
                                  <strong>Dados:</strong> {leak.amount_of_data}
                                </p>
                              )}
                              {leak.publication_date && (
                                <p className="text-slate-600">
                                  <strong>Publicado:</strong> {formatDate(leak.publication_date)}
                                </p>
                              )}
                            </div>
                          </div>

                          {leak.content && leak.content !== "Vazamento detectado" && (
                            <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                              <p className="text-sm text-slate-700">
                                <strong>Conteúdo:</strong> {leak.content}
                              </p>
                            </div>
                          )}

                          {leak.comment && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-700">
                                <strong>Comentário:</strong> {leak.comment}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(leak.source_url, "_blank")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Fonte
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
