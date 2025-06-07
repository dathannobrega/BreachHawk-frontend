"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusMessageProps {
  type: "success" | "error" | "warning" | "info"
  message: string
  onClose?: () => void
  className?: string
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-800",
    iconClassName: "text-green-600",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800",
    iconClassName: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    iconClassName: "text-yellow-600",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
    iconClassName: "text-blue-600",
  },
}

export function StatusMessage({ type, message, onClose, className }: StatusMessageProps) {
  const config = statusConfig[type]
  const Icon = config.icon

  return (
    <Alert className={cn(config.className, "animate-in slide-in-from-top-2 duration-300", className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.iconClassName)} />
        <AlertDescription className="flex-1 text-sm font-medium">{message}</AlertDescription>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        )}
      </div>
    </Alert>
  )
}
