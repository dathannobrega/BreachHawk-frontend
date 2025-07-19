import { LoadingSpinner } from "@/components/ui/loading-spinner"
import DashboardLayout from "@/components/dashboard-layout"

export default function MonitoringLoading() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="h-8 bg-slate-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="ml-4 flex-1">
                  <div className="h-6 bg-slate-200 rounded w-12 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
