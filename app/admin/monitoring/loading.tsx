import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function MonitoringLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="lg" />
        <p className="text-slate-700 font-medium">Carregando monitoramento...</p>
      </div>
    </div>
  )
}
