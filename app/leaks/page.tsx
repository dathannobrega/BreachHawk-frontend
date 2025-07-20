"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlerts, useAlertStats, useAcknowledgeAlert } from "@/hooks/use-alerts"
import type { Alert } from "@/services/alert-service"

export default function AlertsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<boolean | undefined>(undefined)

  const { data: alertsData, isLoading } = useAlerts({
    page: currentPage,
    page_size: 10,
    acknowledged: acknowledgedFilter,
    search: searchTerm,
  })

  const { data: stats } = useAlertStats()
  const acknowledgeMutation = useAcknowledgeAlert()

  const handleAcknowledge = (alertId: number, acknowledged: boolean) => {
    acknowledgeMutation.mutate({ alertId, acknowledged })
  }

  return (
    <div className="container py-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Reconhecidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.unacknowledged || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reconhecidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.acknowledged || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recentes</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.recent || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por empresa, site ou informações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select
          value={acknowledgedFilter?.toString() || "all"}
          onValueChange={(value) => {
            setAcknowledgedFilter(value === "all" ? undefined : value === "true")
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os alertas</SelectItem>
            <SelectItem value="false">Não reconhecidos</SelectItem>
            <SelectItem value="true">Reconhecidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Table>
          <TableCaption>Lista de Alertas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Informações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : alertsData?.alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum alerta encontrado.
                </TableCell>
              </TableRow>
            ) : (
              alertsData?.alerts.map((alert: Alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.company}</TableCell>
                  <TableCell>{alert.website}</TableCell>
                  <TableCell>{alert.informations}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={alert.acknowledged ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id, !alert.acknowledged)}
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {alertsData?.total_pages || 1}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === (alertsData?.total_pages || 1) || isLoading}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
