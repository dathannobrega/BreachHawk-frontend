"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AuthLayout } from "@/components/templates/auth-layout"

export default function UnsubscribeLoading() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Processando sua solicitação...</p>
      </div>
    </AuthLayout>
  )
}
