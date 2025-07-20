import DashboardLayout from "@/components/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ResourcesLoading() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    </DashboardLayout>
  )
}
