"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMonitoring, useCreateResource, useUpdateResource, useDeleteResource } from "@/hooks/use-monitoring"
import { Target, Plus, Search, Edit, Trash2, Calendar, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { MonitoredResource } from "@/types/monitoring"

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<MonitoredResource | null>(null)
  const [formData, setFormData] = useState({
    keyword: "",
    description: "",
    is_active: true,
  })

  const { data: resources, isLoading } = useMonitoring()
  const createMutation = useCreateResource()
  const updateMutation = useUpdateResource()
  const deleteMutation = useDeleteResource()
  const { toast } = useToast()

  // Filtrar recursos baseado na busca
  const filteredResources =
    resources?.filter(
      (resource) =>
        resource.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  // Estatísticas
  const totalResources = resources?.length || 0
  const activeResources = resources?.filter((r) => r.is_active).length || 0
  const inactiveResources = totalResources - activeResources

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.keyword.trim()) {
      toast({
        title: "Erro",
        description: "Palavra-chave é obrigatória",
        variant: "destructive",
      })
      return
    }

    try {
      await createMutation.mutateAsync(formData)
      setIsCreateDialogOpen(false)
      setFormData({ keyword: "", description: "", is_active: true })
      toast({
        title: "Sucesso",
        description: "Recurso criado com sucesso",
      })
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingResource || !formData.keyword.trim()) {
      toast({
        title: "Erro",
        description: "Palavra-chave é obrigatória",
        variant: "destructive",
      })
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: editingResource.id,
        data: formData,
      })
      setIsEditDialogOpen(false)
      setEditingResource(null)
      setFormData({ keyword: "", description: "", is_active: true })
      toast({
        title: "Sucesso",
        description: "Recurso atualizado com sucesso",
      })
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleEdit = (resource: MonitoredResource) => {
    setEditingResource(resource)
    setFormData({
      keyword: resource.keyword,
      description: resource.description || "",
      is_active: resource.is_active,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast({
        title: "Sucesso",
        description: "Recurso excluído com sucesso",
      })
    } catch (error) {
      // Erro já tratado no hook
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recursos Monitorados</h1>
            <p className="text-muted-foreground">Gerencie palavras-chave e recursos para monitoramento de vazamentos</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Recurso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Recurso</DialogTitle>
                <DialogDescription>Adicione uma nova palavra-chave ou recurso para monitoramento</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Palavra-chave *</Label>
                    <Input
                      id="keyword"
                      value={formData.keyword}
                      onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                      placeholder="Ex: empresa.com, API key, database"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição opcional do recurso..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Ativo</Label>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Criando..." : "Criar Recurso"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recursos Ativos</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeResources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recursos Inativos</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{inactiveResources}</div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por palavra-chave ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Lista de Recursos */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "Nenhum recurso encontrado" : "Nenhum recurso cadastrado"}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? "Tente ajustar os termos de busca"
                    : "Comece criando seu primeiro recurso para monitoramento"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Recurso
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.keyword}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={resource.is_active ? "default" : "secondary"}>
                            {resource.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o recurso "{resource.keyword}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(resource.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    )}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Criado: {formatDate(resource.created_at)}
                      </div>
                      {resource.updated_at !== resource.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Atualizado: {formatDate(resource.updated_at)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Recurso</DialogTitle>
              <DialogDescription>Atualize as informações do recurso monitorado</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-keyword">Palavra-chave *</Label>
                  <Input
                    id="edit-keyword"
                    value={formData.keyword}
                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                    placeholder="Ex: empresa.com, API key, database"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição opcional do recurso..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="edit-is_active">Ativo</Label>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
