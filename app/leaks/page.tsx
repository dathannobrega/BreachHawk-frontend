"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Paginator } from "@/components/paginator"
import { useAlerts, useAlertStats, useAcknowledgeAlert } from "@/hooks/use-alerts"
import { useLanguage } from "@/contexts/language-context"
import { getTranslations } from "@/lib/i18n"
import {
  AlertTriangle,
  Search,
  ExternalLink,
  Calendar,
  MapPin,
  Eye,
  Download,
  Key,
  Check,
  X,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function LeaksPage() {
  const { language } = useLanguage()
  const t = getTranslations(language)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const {
    data: alertsData,
    isLoading,
    error,
  } = useAlerts({
    page: currentPage,
    page_size: 10,
    acknowledged: acknowledgedFilter === "all" ? undefined : acknowledgedFilter === "true",
    search: search || undefined,
  })

  const { data: stats } = useAlertStats()
  const acknowledgeMutation = useAcknowledgeAlert()

  const getSeverityLevel = (leak: any) => {
    const content = `${leak.information || ""} ${leak.comment || ""}`.toLowerCase()
    const criticalKeywords = ["password", "credit", "admin", "root", "database", "api", "token"]
    const highKeywords = ["email", "personal", "phone", "address", "user", "account"]
    const mediumKeywords = ["data", "info", "file", "document"]

    if (criticalKeywords.some((keyword) => content.includes(keyword))) {
      return "critical"
    } else if (highKeywords.some((keyword) => content.includes(keyword))) {
      return "high"
    } else if (mediumKeywords.some((keyword) => content.includes(keyword))) {
      return "medium"
    }
    return "low"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Crítico"
      case "high":
        return "Alto"
      case "medium":
        return "Médio"
      default:
        return "Baixo"
    }
  }

  const handleAcknowledge = (alertId: number, currentStatus: boolean) => {
    acknowledgeMutation.mutate({
      alertId,
      acknowledged: !currentStatus,
    })
  }

  const filteredAlerts = alertsData?.results?.filter((alert) => {
    if (severityFilter !== "all") {
      const severity = getSeverityLevel(alert.leak)
      if (severity !== severityFilter) return false
    }
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t.sidebar.leaks}</h1>
            <p className="text-slate-600 mt-1">Monitore e gerencie alertas de vazamentos detectados</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Alertas</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Não Reconhecidos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.unacknowledged}</p>
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Críticos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Reconhecidos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.acknowledged}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por empresa, informações ou comentários..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={acknowledgedFilter} onValueChange={setAcknowledgedFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="false">Não Reconhecidos</SelectItem>
                  <SelectItem value="true">Reconhecidos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Severidades</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar alertas. Tente novamente.</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAlerts && filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const severity = getSeverityLevel(alert.leak)
              return (
                <Card
                  key={alert.id}
                  className={cn("transition-all duration-200", alert.acknowledged && "bg-slate-50 opacity-75")}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{alert.leak.company}</h3>
                            <Badge className={getSeverityColor(severity)}>{getSeverityLabel(severity)}</Badge>
                            {alert.acknowledged && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Reconhecido
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(alert.leak.found_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                            {alert.leak.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {alert.leak.country}
                              </div>
                            )}
                            {alert.leak.views && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {alert.leak.views.toLocaleString()} visualizações
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={alert.acknowledged ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id, alert.acknowledged)}
                          disabled={acknowledgeMutation.isPending}
                        >
                          {alert.acknowledged ? (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Desmarcar
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Reconhecer
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Content */}
                      {alert.leak.information && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900">Informações:</h4>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{alert.leak.information}</p>
                        </div>
                      )}

                      {alert.leak.comment && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900">Comentário:</h4>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{alert.leak.comment}</p>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200">
                        {alert.leak.source_url && (
                          <a
                            href={alert.leak.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Ver Fonte
                          </a>
                        )}

                        {alert.leak.download_links && (
                          <div className="flex items-center gap-1 text-orange-600 text-sm">
                            <Download className="h-4 w-4" />
                            Links de Download Disponíveis
                          </div>
                        )}

                        {alert.leak.rar_password && (
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <Key className="h-4 w-4" />
                            Senha RAR: {alert.leak.rar_password}
                          </div>
                        )}

                        {alert.leak.amount_of_data && (
                          <div className="flex items-center gap-1 text-slate-600 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            Volume: {alert.leak.amount_of_data}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum alerta encontrado</h3>
              <p className="text-slate-600">Não há alertas que correspondam aos filtros selecionados.</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {alertsData && alertsData.count > 10 && (
          <Paginator
            currentPage={currentPage}
            totalPages={Math.ceil(alertsData.count / 10)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
