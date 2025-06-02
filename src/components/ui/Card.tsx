import type React from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card
