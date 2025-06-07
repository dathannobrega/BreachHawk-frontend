"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ConfigFormTemplateProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
  isSubmitting?: boolean
  extraActions?: React.ReactNode
}

const ConfigFormTemplate: React.FC<ConfigFormTemplateProps> = ({
  title,
  description,
  icon,
  children,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  extraActions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-3">{extraActions}</div>
            <Button type="submit" disabled={isSubmitting} className="h-11 px-8">
              {isSubmitting ? "Salvando..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ConfigFormTemplate
