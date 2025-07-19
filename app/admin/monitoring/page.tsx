"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useMonitoredResources, useAlerts, useMonitoringStats } from "@/hooks/use-monitoring"
import { Plus, Edit, Trash2, Eye, AlertTriangle, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function MonitoringPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const {
    resources,
    loading: resourcesLoading,
    createResource,
    updateResource,
    deleteResource,
  } = useMonitoredResources()
  const { alerts, loading: alertsLoading } = useAlerts()
  const { stats, loading: statsLoading } = useMonitoringStats()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<any>(null)
  const [newKeyword, setNewKeyword] = useState("")
  const [editKeyword, setEditKeyword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Verificar permissões
  if (!user || (user.role !== "admin" && user.role !== "platform_admin")) {
    router.push("/dashboard")
    return null
  }

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyword.trim()) return

    setSubmitting(true)
    try {
      await createResource({ keyword: newKeyword.trim() })
      setNewKeyword("")
      setCreateDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Palavra-chave adicionada com sucesso!",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editKeyword.trim() || !editingResource) return

    setSubmitting(true)
    try {
      await updateResource(editingResource.id, { keyword: editKeyword.trim() })
      setEditKeyword("")
      setEditingResource(null)
      setEditDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Palavra-chave atualizada com sucesso!",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resource: any) => {
    try {
      await deleteResource(resource.id)
      toast({
        title: "Sucesso",
        description: "Palavra-chave removida com sucesso!",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (resource: any) => {
    setEditingResource(resource)
    setEditKeyword(resource.keyword)
    setEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const getSeverityBadge = (leak: any) => {
    const company = leak.company?.toLowerCase() || ""
    const info = leak.information?.toLowerCase() || ""

    if (company.includes("critical") || info.includes("password") || info.includes("credit")) {
      return <Badge variant="destructive">Crítico</Badge>
    }
    if (company.includes("high") || info.includes("email") || info.includes("personal")) {
      return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
    }
    if (company.includes("medium") || info.includes("data")) {
      return <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800">Baixo</Badge>
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Monitoramento</h1>
            <p className="text-slate-600 mt-1">Gerencie palavras-chave e visualize alertas de vazamentos</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recursos Monitorados</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats?.total_resources || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats?.total_alerts || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Últimos 7 dias</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats?.alerts_last_7_days || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats?.alerts_last_24h || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Recursos Monitorados</TabsTrigger>
            <TabsTrigger value="alerts">Alertas Gerados</TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Palavras-chave Monitoradas</CardTitle>
                    <CardDescription>Gerencie as palavras-chave que serão monitoradas nos vazamentos</CardDescription>
                  </div>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Palavra-chave
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Palavra-chave</DialogTitle>
                        <DialogDescription>
                          Digite a palavra-chave que deseja monitorar nos vazamentos
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateResource}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="keyword">Palavra-chave</Label>
                            <Input
                              id="keyword"
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              placeholder="Ex: acme, empresa, produto..."
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? <LoadingSpinner size="sm" /> : "Adicionar"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Palavra-chave</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">#{resource.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.keyword}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(resource.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(resource)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir a palavra-chave "{resource.keyword}"? Esta ação não
                                      pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteResource(resource)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {resources.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                            Nenhuma palavra-chave cadastrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Vazamentos</CardTitle>
                <CardDescription>Vazamentos detectados baseados nas palavras-chave monitoradas</CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Card key={alert.id} className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{alert.leak.company}</h3>
                                {getSeverityBadge(alert.leak)}
                              </div>
                              <p className="text-sm text-slate-600">Descoberto em: {formatDate(alert.leak.found_at)}</p>
                              <p className="text-sm text-slate-600">Alerta criado em: {formatDate(alert.created_at)}</p>
                              {alert.leak.information && <p className="text-sm">{alert.leak.information}</p>}
                              {alert.leak.comment && (
                                <p className="text-sm text-slate-600 italic">{alert.leak.comment}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {alert.leak.source_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={alert.leak.source_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Ver Fonte
                                  </a>
                                </Button>
                              )}
                              <Badge variant="secondary">Recurso #{alert.resource}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-8 text-slate-500">Nenhum alerta encontrado</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Palavra-chave</DialogTitle>
              <DialogDescription>Altere a palavra-chave monitorada</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditResource}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editKeyword">Palavra-chave</Label>
                  <Input
                    id="editKeyword"
                    value={editKeyword}
                    onChange={(e) => setEditKeyword(e.target.value)}
                    placeholder="Ex: acme, empresa, produto..."
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <LoadingSpinner size="sm" /> : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
