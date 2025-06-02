import type React from "react"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, className }) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end">
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <div className={cn("ml-2 flex items-center text-sm", trendUp ? "text-green-600" : "text-red-600")}>
            {trendUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
