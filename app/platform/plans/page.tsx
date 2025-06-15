"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/templates/page-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { StatusMessage } from "@/components/ui/status-message"
import { Plus, RefreshCw, Edit, Trash2, Package, User, Building } from "lucide-react"
import type { Plan, PlanCreate } from "@/types/plan"
import DashboardLayout from "@/components/dashboard-layout"

// Serviço de planos com URL correta
const planService = {
  async getAll(): Promise<Plan[]> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const token = localStorage.getItem("access_token")

      if (!token) {
        throw new Error("Token de acesso não encontrado")
      }

      const response = await fetch(`${API_BASE_URL}/api/companies/plans/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.")
        }
        if (response.status === 403) {
          throw new Error("Acesso negado. Apenas platform admins podem acessar.")
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Erro ao buscar planos:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Não foi possível carregar os planos. Verifique sua conexão.")
    }
  },

  async create(data: PlanCreate): Promise<Plan> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const token = localStorage.getItem("access_token")

      if (!token) {
        throw new Error("Token de acesso não encontrado")
      }

      const response = await fetch(`${API_BASE_URL}/api/companies/plans/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.")
        }
        if (response.status === 403) {
          throw new Error("Acesso negado. Apenas platform admins podem criar planos.")
        }
        if (response.status === 422) {
          const errorData = await response.json()
          throw new Error(`Dados inválidos: ${errorData.detail || "Verifique os campos"}`)
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao criar plano:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Não foi possível criar o plano. Tente novamente.")
    }
  },

  async update(id: number, data: Partial<PlanCreate>): Promise<Plan> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const token = localStorage.getItem("access_token")

      if (!token) {
        throw new Error("Token de acesso não encontrado")
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/plans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.")
        }
        if (response.status === 403) {
          throw new Error("Acesso negado. Apenas platform admins podem editar planos.")
        }
        if (response.status === 404) {
          throw new Error("Plano não encontrado.")
        }
        if (response.status === 422) {
          const errorData = await response.json()
          throw new Error(`Dados inválidos: ${errorData.detail || "Verifique os campos"}`)
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao atualizar plano:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Não foi possível atualizar o plano. Tente novamente.")
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const token = localStorage.getItem("access_token")

      if (!token) {
        throw new Error("Token de acesso não encontrado")
      }

      const response = await fetch(`${API_BASE_URL}/api/companies/plans/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.")
        }
        if (response.status === 403) {
          throw new Error("Acesso negado. Apenas platform admins podem excluir planos.")
        }
        if (response.status === 404) {
          throw new Error("Plano não encontrado.")
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Não foi possível excluir o plano. Tente novamente.")
    }
  },
}

// Hook para gerenciar planos
function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await planService.getAll()
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const createPlan = async (data: PlanCreate) => {
    const newPlan = await planService.create(data)
    setPlans((prev) => [...prev, newPlan])
    return newPlan
  }

  const updatePlan = async (id: number, data: Partial<PlanCreate>) => {
    const updatedPlan = await planService.update(id, data)
    setPlans((prev) => prev.map((p) => (p.id === id ? updatedPlan : p)))
    return updatedPlan
  }

  const deletePlan = async (id: number) => {
    await planService.delete(id)
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  useEffect(() => {
    loadPlans()
  }, [])

  return { plans, loading, error, loadPlans, createPlan, updatePlan, deletePlan }
}

// Componente de card de plano
function PlanCard({
  plan,
  onEdit,
  onDelete,
}: { plan: Plan; onEdit: (plan: Plan) => void; onDelete: (plan: Plan) => void }) {
  const getScopeLabel = (scope: "user" | "company") => {
    return scope === "user" ? "Individual" : "Empresarial"
  }

  const getScopeBadgeColor = (scope: "user" | "company") => {
    return scope === "user" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const getScopeIcon = (scope: "user" | "company") => {
    return scope === "user" ? User : Building
  }

  const ScopeIcon = getScopeIcon(plan.scope)

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="p-6">
        {/* Header do card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 leading-tight">{plan.name}</h3>
              <div className="flex items-center mt-1">
                <ScopeIcon className="w-3 h-3 mr-1" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScopeBadgeColor(plan.scope)}`}>
                  {getScopeLabel(plan.scope)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do plano */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600 font-medium">Itens Monitorados</span>
            <span className="text-sm font-semibold text-slate-900">{plan.max_monitored_items}</span>
          </div>
          {plan.scope === "company" && (
            <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 font-medium">Máx. Usuários</span>
              <span className="text-sm font-semibold text-slate-900">
                {plan.max_users ? plan.max_users : "Ilimitado"}
              </span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex space-x-2 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Componente de formulário de plano
function PlanForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initialData?: Plan
  onSubmit: (data: PlanCreate) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<PlanCreate>(
    initialData || {
      name: "",
      scope: "user",
      max_monitored_items: 10,
      max_users: null,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nome do Plano *
        </label>
        <input
          id="name"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Plano Pro"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="scope" className="block text-sm font-medium text-slate-700">
          Escopo *
        </label>
        <select
          id="scope"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.scope}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              scope: e.target.value as "user" | "company",
              max_users: e.target.value === "user" ? null : prev.max_users || 1,
            }))
          }
        >
          <option value="user">Individual</option>
          <option value="company">Empresarial</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="max_monitored_items" className="block text-sm font-medium text-slate-700">
          Máximo de Itens Monitorados *
        </label>
        <input
          id="max_monitored_items"
          type="number"
          min="1"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.max_monitored_items}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              max_monitored_items: Number.parseInt(e.target.value) || 1,
            }))
          }
          required
        />
      </div>

      {formData.scope === "company" && (
        <div className="space-y-2">
          <label htmlFor="max_users" className="block text-sm font-medium text-slate-700">
            Máximo de Usuários
          </label>
          <input
            id="max_users"
            type="number"
            min="1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.max_users || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                max_users: Number.parseInt(e.target.value) || null,
              }))
            }
            placeholder="Ex: 10 (deixe vazio para ilimitado)"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {initialData ? "Atualizar" : "Criar"} Plano
        </Button>
      </div>
    </form>
  )
}

export default function PlansPage() {
  const { plans, loading, error, loadPlans, createPlan, updatePlan, deletePlan } = usePlans()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  const handleCreate = async (data: PlanCreate) => {
    try {
      setFormLoading(true)
      await createPlan(data)
      setIsCreateModalOpen(false)
      toast({
        title: "Sucesso",
        description: "Plano criado com sucesso!",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao criar plano",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data: PlanCreate) => {
    if (!editingPlan) return

    try {
      setFormLoading(true)
      await updatePlan(editingPlan.id, data)
      setIsEditModalOpen(false)
      setEditingPlan(null)
      toast({
        title: "Sucesso",
        description: "Plano atualizado com sucesso!",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao atualizar plano",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!planToDelete) return

    try {
      await deletePlan(planToDelete.id)
      setPlanToDelete(null)
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso!",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao excluir plano",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan)
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (plan: Plan) => {
    setPlanToDelete(plan)
  }

  const PlansContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-600">Carregando planos...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <StatusMessage
          type="error"
          title="Erro ao carregar planos"
          description={error}
          action={
            <Button onClick={loadPlans} variant="outline" className="hover:bg-blue-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          }
        />
      )
    }

    return (
      <>
        <PageHeader
          title="Gerenciamento de Planos"
          description="Gerencie os planos de assinatura da plataforma. Crie e configure planos para usuários individuais e empresas."
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={loadPlans} className="hover:bg-blue-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Plano
              </Button>
            </div>
          }
        />

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum plano encontrado</h3>
              <p className="text-slate-600 mb-6">
                Comece criando seu primeiro plano de assinatura para a plataforma. Defina limites e configure opções
                para usuários e empresas.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Plano
                </Button>
                <div className="text-sm text-slate-500">
                  Você pode criar planos para usuários individuais ou empresas
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Botão flutuante adicional para criar plano quando há planos existentes */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {plans.length} plano{plans.length !== 1 ? "s" : ""} encontrado{plans.length !== 1 ? "s" : ""}
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Plano
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onEdit={openEditModal} onDelete={openDeleteDialog} />
              ))}
            </div>
          </div>
        )}

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">Criar Novo Plano</DialogTitle>
              <DialogDescription className="text-slate-600">
                Crie um novo plano de assinatura para a plataforma. Defina os limites e escopo do plano.
              </DialogDescription>
            </DialogHeader>
            <PlanForm onSubmit={handleCreate} onCancel={() => setIsCreateModalOpen(false)} isLoading={formLoading} />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">Editar Plano</DialogTitle>
              <DialogDescription className="text-slate-600">
                Faça alterações no plano selecionado. As mudanças serão aplicadas imediatamente.
              </DialogDescription>
            </DialogHeader>
            {editingPlan && (
              <PlanForm
                initialData={editingPlan}
                onSubmit={handleEdit}
                onCancel={() => {
                  setIsEditModalOpen(false)
                  setEditingPlan(null)
                }}
                isLoading={formLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                Tem certeza que deseja excluir o plano "{planToDelete?.name}"? Esta ação não pode ser desfeita e pode
                afetar usuários que estão usando este plano.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-slate-50">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir Plano
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <DashboardLayout>
      <PlansContent />
    </DashboardLayout>
  )
}
