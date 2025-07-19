"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Plus, Trash2, Search, Eye, Calendar, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useMonitoredResources, useAlerts } from "@/hooks/use-monitoring"
import DashboardLayout from "@/components/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MonitoringPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [newKeyword, setNewKeyword] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    createResource,
    deleteResource,
  } = useMonitoredResources()

  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading])

  useEffect(() => {
    if (user && !["admin", "platform_admin"].includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !["admin", "platform_admin"].includes(user.role)) {
    return null
  }

  const handleCreateResource = async () => {
    if (!newKeyword.trim()) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await createResource({ keyword: newKeyword.trim() })
      setNewKeyword("")
      setIsDialogOpen(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Erro ao criar recurso")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResource = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este recurso monitorado?")) return

    try {
      await deleteResource(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao excluir recurso")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeverityColor = (company: string) => {
    // Lógica simples para determinar severidade baseada no nome da empresa
    const keywords = ["admin", "root", "password", "database", "api"]
    const hasHighRisk = keywords.some((keyword) => company.toLowerCase().includes(keyword))
    return hasHighRisk ? "bg-red-500" : "bg-yellow-500"
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Monitoramento de Recursos</h1>
          <p className="text-slate-600 mt-2">Gerencie palavras-chave monitoradas e visualize alertas de vazamentos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-900">{resources.length}</p>
                  <p className="text-slate-600">Recursos Monitorados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-orange-900">{alerts.length}</p>
                  <p className="text-slate-600">Total de Alertas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-900">
                    {
                      alerts.filter(
                        (alert) => new Date(alert.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ).length
                    }
                  </p>
                  <p className="text-slate-600">Últimos 7 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-900">
                    {
                      alerts.filter((alert) => new Date(alert.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                        .length
                    }
                  </p>
                  <p className="text-slate-600">Últimas 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Recursos Monitorados</TabsTrigger>
            <TabsTrigger value="alerts">Alertas Gerados</TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-900">Palavras-chave Monitoradas</CardTitle>
                    <CardDescription>Gerencie as palavras-chave que serão monitoradas nos vazamentos</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Palavra-chave
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Palavra-chave</DialogTitle>
                        <DialogDescription>
                          Adicione uma nova palavra-chave para monitoramento de vazamentos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="keyword">Palavra-chave</Label>
                          <Input
                            id="keyword"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Ex: acme, empresa, dominio.com"
                            className="mt-1"
                          />
                        </div>
                        {submitError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{submitError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateResource}
                          disabled={isSubmitting || !newKeyword.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Criando...
                            </>
                          ) : (
                            "Criar"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : resourcesError ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{resourcesError}</AlertDescription>
                  </Alert>
                ) : resources.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Nenhuma palavra-chave monitorada</p>
                    <p className="text-sm text-slate-500 mt-1">Adicione palavras-chave para começar o monitoramento</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Palavra-chave</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Alertas Gerados</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {resource.keyword}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(resource.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {alerts.filter((alert) => alert.resource === resource.id).length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Alertas de Vazamentos</CardTitle>
                <CardDescription>
                  Vazamentos detectados que correspondem às suas palavras-chave monitoradas
                </CardDescription>
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
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Nenhum alerta gerado</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Os alertas aparecerão aqui quando vazamentos forem detectados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Card key={alert.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.leak.company)}`} />
                                <h3 className="font-semibold text-slate-900">{alert.leak.company}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Recurso #{alert.resource}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-600">
                                    <strong>Encontrado em:</strong> {formatDate(alert.leak.found_at)}
                                  </p>
                                  <p className="text-slate-600">
                                    <strong>Alerta criado:</strong> {formatDate(alert.created_at)}
                                  </p>
                                  {alert.leak.country && (
                                    <p className="text-slate-600">
                                      <strong>País:</strong> {alert.leak.country}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  {alert.leak.views && (
                                    <p className="text-slate-600">
                                      <strong>Visualizações:</strong> {alert.leak.views}
                                    </p>
                                  )}
                                  {alert.leak.amount_of_data && (
                                    <p className="text-slate-600">
                                      <strong>Quantidade de dados:</strong> {alert.leak.amount_of_data}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {alert.leak.information && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-700">
                                    <strong>Informações:</strong> {alert.leak.information}
                                  </p>
                                </div>
                              )}

                              {alert.leak.comment && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">
                                    <strong>Comentário:</strong> {alert.leak.comment}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(alert.leak.source_url, "_blank")}
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
