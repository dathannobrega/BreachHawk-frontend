"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  actionButton?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: () => void
  }
}

export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm md:text-base text-slate-600">{description}</p>}
        </div>
        {actionButton && (
          <Button onClick={actionButton.onClick} className="mt-4 md:mt-0">
            {actionButton.icon && <actionButton.icon className="mr-2 h-4 w-4" />}
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  )
}
