import type React from "react"

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4">
          <span className={`inline-flex items-center text-sm ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trend}
            <svg
              className={`ml-1 h-4 w-4 ${trendUp ? "text-green-500" : "text-red-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={trendUp ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              ></path>
            </svg>
          </span>
        </div>
      )}
    </div>
  )
}

export default StatCard
