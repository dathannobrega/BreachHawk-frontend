import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function MonitoringLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="h-8 bg-slate-200 rounded w-80 mb-2 animate-pulse"></div>
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
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <div className="h-10 bg-slate-200 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 bg-slate-200 rounded w-60 mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-80 animate-pulse"></div>
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
    </div>
  )
}
