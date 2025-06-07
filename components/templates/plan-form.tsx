"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Plan, PlanCreate, PlanScope } from "@/types/plan"

interface PlanFormProps {
  initialData?: Plan
  onSubmit: (data: PlanCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PlanForm({ initialData, onSubmit, onCancel, isLoading = false }: PlanFormProps) {
  const [formData, setFormData] = useState<PlanCreate>({
    name: initialData?.name || "",
    scope: initialData?.scope || "user",
    max_monitored_items: initialData?.max_monitored_items || 10,
    max_users: initialData?.max_users || null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (formData.max_monitored_items < 1) {
      newErrors.max_monitored_items = "Deve ser maior que 0"
    }

    if (formData.scope === "company" && formData.max_users !== null && formData.max_users < 1) {
      newErrors.max_users = "Deve ser maior que 0 ou deixe vazio para ilimitado"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleScopeChange = (scope: PlanScope) => {
    setFormData((prev) => ({
      ...prev,
      scope,
      max_users: scope === "user" ? null : prev.max_users || 1,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-slate-700">
          Nome do Plano *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Plano Pro Individual"
          className={errors.name ? "border-red-300 focus:border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope" className="text-sm font-medium text-slate-700">
          Escopo *
        </Label>
        <Select value={formData.scope} onValueChange={handleScopeChange} disabled={isLoading}>
          <SelectTrigger className={errors.scope ? "border-red-300 focus:border-red-500" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Individual (Usuário único)</SelectItem>
            <SelectItem value="company">Empresarial (Múltiplos usuários)</SelectItem>
          </SelectContent>
        </Select>
        {errors.scope && <p className="text-sm text-red-600">{errors.scope}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_monitored_items" className="text-sm font-medium text-slate-700">
          Máximo de Itens Monitorados *
        </Label>
        <Input
          id="max_monitored_items"
          type="number"
          min="1"
          value={formData.max_monitored_items}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              max_monitored_items: Number.parseInt(e.target.value) || 1,
            }))
          }
          className={errors.max_monitored_items ? "border-red-300 focus:border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.max_monitored_items && <p className="text-sm text-red-600">{errors.max_monitored_items}</p>}
      </div>

      {formData.scope === "company" && (
        <div className="space-y-2">
          <Label htmlFor="max_users" className="text-sm font-medium text-slate-700">
            Máximo de Usuários
          </Label>
          <Input
            id="max_users"
            type="number"
            min="1"
            value={formData.max_users || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                max_users: Number.parseInt(e.target.value) || null,
              }))
            }
            placeholder="Deixe vazio para ilimitado"
            className={errors.max_users ? "border-red-300 focus:border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.max_users && <p className="text-sm text-red-600">{errors.max_users}</p>}
          <p className="text-xs text-slate-500">Deixe vazio para permitir usuários ilimitados</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="hover:bg-slate-50">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !formData.name.trim()} className="bg-blue-600 hover:bg-blue-700">
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {initialData ? "Atualizar" : "Criar"} Plano
        </Button>
      </div>
    </form>
  )
}
