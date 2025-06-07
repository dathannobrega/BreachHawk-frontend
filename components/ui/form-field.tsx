"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FormFieldProps {
  label: string
  type?: string
  name?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon?: LucideIcon
  required?: boolean
  disabled?: boolean
  error?: string
  description?: string
  className?: string
}

export function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  error,
  description,
  className,
}: FormFieldProps) {
  const id = name || label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            "h-11 transition-all duration-200",
            Icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          aria-invalid={error ? "true" : "false"}
        />

        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {description && !error && (
        <p id={`${id}-description`} className="text-xs text-slate-500">
          {description}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
          {error}
        </p>
      )}
    </div>
  )
}
