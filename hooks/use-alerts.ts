"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertService, type AlertsResponse, type AlertStats } from "@/services/alert-service"
import { useToast } from "@/hooks/use-toast"

export function useAlerts(params?: {
  page?: number
  page_size?: number
  acknowledged?: boolean
  search?: string
}) {
  return useQuery<AlertsResponse>({
    queryKey: ["alerts", params],
    queryFn: () => AlertService.getAlerts(params),
    staleTime: 30000, // 30 seconds
  })
}

export function useAlertStats() {
  return useQuery<AlertStats>({
    queryKey: ["alert-stats"],
    queryFn: () => AlertService.getAlertStats(),
    staleTime: 60000, // 1 minute
  })
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ alertId, acknowledged }: { alertId: number; acknowledged: boolean }) =>
      AlertService.acknowledgeAlert(alertId, acknowledged),
    onSuccess: (data, variables) => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      queryClient.invalidateQueries({ queryKey: ["alert-stats"] })

      toast({
        title: variables.acknowledged ? "Alerta reconhecido" : "Reconhecimento removido",
        description: variables.acknowledged
          ? "O alerta foi marcado como reconhecido."
          : "O reconhecimento do alerta foi removido.",
      })
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do alerta.",
        variant: "destructive",
      })
    },
  })
}
