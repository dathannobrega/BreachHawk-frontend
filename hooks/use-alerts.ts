"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { alertService, type AlertsResponse } from "@/services/alert-service"
import { useToast } from "@/hooks/use-toast"

export function useAlerts(params?: {
  page?: number
  page_size?: number
  acknowledged?: boolean
  search?: string
}) {
  return useQuery<AlertsResponse>({
    queryKey: ["alerts", params],
    queryFn: () => alertService.getAlerts(params),
  })
}

export function useAlertStats() {
  return useQuery({
    queryKey: ["alert-stats"],
    queryFn: alertService.getAlertStats,
  })
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ alertId, acknowledged }: { alertId: number; acknowledged: boolean }) =>
      alertService.acknowledgeAlert(alertId, acknowledged),
    onSuccess: (_, { acknowledged }) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      queryClient.invalidateQueries({ queryKey: ["alert-stats"] })

      toast({
        title: acknowledged ? "Alerta reconhecido" : "Reconhecimento removido",
        description: acknowledged
          ? "O alerta foi marcado como reconhecido."
          : "O reconhecimento do alerta foi removido.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Erro ao atualizar alerta",
        variant: "destructive",
      })
    },
  })
}
