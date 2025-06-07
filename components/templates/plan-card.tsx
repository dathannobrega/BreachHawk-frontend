"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, User, Building, Edit, Trash2 } from "lucide-react"
import type { Plan, PlanScope } from "@/types/plan"

interface PlanCardProps {
  plan: Plan
  onEdit: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const getScopeLabel = (scope: PlanScope) => {
    return scope === "user" ? "Individual" : "Empresarial"
  }

  const getScopeIcon = (scope: PlanScope) => {
    return scope === "user" ? User : Building
  }

  const getScopeBadgeColor = (scope: PlanScope) => {
    return scope === "user"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200"
  }

  const ScopeIcon = getScopeIcon(plan.scope)

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">{plan.name}</CardTitle>
            </div>
          </div>
          <Badge className={`${getScopeBadgeColor(plan.scope)} font-medium`}>
            <ScopeIcon className="w-3 h-3 mr-1" />
            {getScopeLabel(plan.scope)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-600">Itens Monitorados:</span>
            <span className="text-sm font-bold text-slate-900">{plan.max_monitored_items.toLocaleString()}</span>
          </div>
          {plan.scope === "company" && (
            <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Máx. Usuários:</span>
              <span className="text-sm font-bold text-slate-900">
                {plan.max_users ? plan.max_users.toLocaleString() : "Ilimitado"}
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          >
            <Edit className="h-3 w-3 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
