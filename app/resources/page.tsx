"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useMonitoredResources } from "@/hooks/use-monitoring"
import { Target, Plus, Search, Edit, Trash2, AlertTriangle, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
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

export default function ResourcesPage() {
  const { resources, loading, error, createResource, updateResource, deleteResource } = useMonitoredResources()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    keyword: "",
  })

  const filteredResources = resources.filter((resource) =>
    resource.keyword.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async () => {
    if (!formData.keyword.trim()) {
      toast({
        title: "Erro",
        description: "A palavra-chave é obrigatória",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      console.log("Página: Iniciando criação de recurso:", formData)
      await createResource({
        keyword: formData.keyword.trim(),
      })

      toast({
        title: "Sucesso",
        description: "Recurso criado com sucesso. Um scan inicial foi iniciado automaticamente.",
      })

      setIsCreateDialogOpen(false)
      setFormData({ keyword: "" })
    } catch (error: any) {
      console.error("Página: Erro na criação:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar recurso",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async () => {
    if (!formData.keyword.trim()) {
      toast({
        title: "Erro",
        description: "A palavra-chave é obrigatória",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      console.log("Página: Iniciando atualização de recurso:", { id: editingResource.id, data: formData })
      await updateResource(editingResource.id, {
        keyword: formData.keyword.trim(),
      })

      toast({
        title: "Sucesso",
        description: "Recurso atualizado com sucesso",
      })

      setIsEditDialogOpen(false)
      setEditingResource(null)
      setFormData({ keyword: "" })
    } catch (error: any) {
      console.error("Página: Erro na atualização:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar recurso",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: number, keyword: string) => {
    if (!confirm(`Tem certeza que deseja excluir o recurso "${keyword}"?`)) {
      return
    }

    try {
      console.log("Página: Iniciando deleção de recurso:", id)
      await deleteResource(id)
      toast({
        title: "Sucesso",
        description: "Recurso excluído com sucesso",
      })
    } catch (error: any) {
      console.error("Página: Erro na deleção:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir recurso",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (resource: any) => {
    console.log("Página: Abrindo dialog de edição para:", resource)
    setEditingResource(resource)
    setFormData({
      keyword: resource.keyword,
    })
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  console.log("Página: Estado atual:", { resources, loading, error })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recursos Monitorados</h1>
            <p className="text-slate-600 mt-1">Gerencie as palavras-chave que você deseja monitorar</p>
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
                <DialogDescription>
                  Adicione uma nova palavra-chave para monitoramento de vazamentos. Um scan inicial será executado
                  automaticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyword">Palavra-chave *</Label>
                  <Input
                    id="keyword"
                    value={formData.keyword}
                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                    placeholder="Ex: minha-empresa, email@empresa.com"
                    disabled={isCreating}
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Digite uma palavra-chave, nome de empresa ou email para monitorar
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Criando...
                    </>
                  ) : (
                    "Criar Recurso"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Recursos Monitorados</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {resources.length === 0
                  ? "Nenhum recurso sendo monitorado"
                  : `${resources.length} ${resources.length === 1 ? "recurso ativo" : "recursos ativos"}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar recursos por palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-2 text-slate-600">Carregando recursos...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <br />
                <small className="text-xs opacity-75 mt-2 block">
                  Verifique se a API está rodando e se você está autenticado.
                </small>
              </AlertDescription>
            </Alert>
          ) : filteredResources.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-slate-500">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <p>
                    {searchTerm
                      ? "Nenhum recurso encontrado com os termos de busca"
                      : "Nenhum recurso monitorado ainda"}
                  </p>
                  {!searchTerm && (
                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Recurso
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg text-slate-900">{resource.keyword}</h3>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        <Badge variant="outline">ID #{resource.id}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Criado: {formatDate(resource.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(resource)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resource.id, resource.keyword)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Recurso</DialogTitle>
              <DialogDescription>Atualize a palavra-chave do recurso monitorado</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-keyword">Palavra-chave *</Label>
                <Input
                  id="edit-keyword"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  placeholder="Ex: minha-empresa, email@empresa.com"
                  disabled={isUpdating}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
                Cancelar
              </Button>
              <Button onClick={handleEdit} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
