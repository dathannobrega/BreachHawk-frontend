import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function MonitoringLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
