import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
  className?: string
  iconColorClass?: string // e.g., "text-blue-500"
  iconBgClass?: string // e.g., "bg-blue-100"
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconColorClass = "text-primary-600",
  iconBgClass = "bg-primary-100",
}: StatCardProps) {
  const trendColor =
    trend?.direction === "up" ? "text-green-600" : trend?.direction === "down" ? "text-red-600" : "text-slate-600"

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", iconBgClass)}>
          <Icon className={cn("h-5 w-5", iconColorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        {trend && (
          <p className={cn("text-xs mt-2", trendColor)}>
            {trend.value} {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
