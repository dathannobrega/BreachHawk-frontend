"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
  variant?: "default" | "blue" | "success" | "warning" | "danger"
}

const CardTemplate: React.FC<CardTemplateProps> = ({
  title,
  description,
  children,
  className,
  headerActions,
  variant = "default",
}) => {
  const variantStyles = {
    default: "border-gray-200",
    blue: "border-blue-200 bg-blue-50/30",
    success: "border-green-200 bg-green-50/30",
    warning: "border-yellow-200 bg-yellow-50/30",
    danger: "border-red-200 bg-red-50/30",
  }

  const headerVariantStyles = {
    default: "bg-gray-50 border-gray-200",
    blue: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    success: "bg-gradient-to-r from-green-50 to-green-100 border-green-200",
    warning: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200",
    danger: "bg-gradient-to-r from-red-50 to-red-100 border-red-200",
  }

  const titleVariantStyles = {
    default: "text-gray-900",
    blue: "text-blue-900",
    success: "text-green-900",
    warning: "text-yellow-900",
    danger: "text-red-900",
  }

  const descriptionVariantStyles = {
    default: "text-gray-700",
    blue: "text-blue-700",
    success: "text-green-700",
    warning: "text-yellow-700",
    danger: "text-red-700",
  }

  return (
    <Card className={cn("shadow-lg", variantStyles[variant], className)}>
      <CardHeader className={cn("border-b", headerVariantStyles[variant])}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={cn("text-xl font-bold", titleVariantStyles[variant])}>{title}</CardTitle>
            {description && (
              <CardDescription className={cn("mt-1", descriptionVariantStyles[variant])}>{description}</CardDescription>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white">{children}</CardContent>
    </Card>
  )
}

export default CardTemplate
