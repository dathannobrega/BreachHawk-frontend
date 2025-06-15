"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FormTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  className?: string
  isLoading?: boolean
}

const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  description,
  children,
  onSubmit,
  className,
  isLoading = false,
}) => {
  return (
    <Card className={cn("w-full max-w-4xl mx-auto shadow-lg border-blue-100", className)}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="text-2xl font-bold text-blue-900">{title}</CardTitle>
        {description && <CardDescription className="text-blue-700 text-base">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <form onSubmit={onSubmit} className="space-y-6">
          <fieldset disabled={isLoading} className="space-y-6">
            {children}
          </fieldset>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormTemplate
