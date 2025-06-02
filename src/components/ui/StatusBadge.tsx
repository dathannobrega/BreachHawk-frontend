import type React from "react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "success" | "warning" | "danger" | "info"
  text: string
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, className }) => {
  const statusClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusClasses[status], className)}>
      {text}
    </span>
  )
}

export default StatusBadge
