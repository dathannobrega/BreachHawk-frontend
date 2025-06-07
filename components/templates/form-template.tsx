"use client"

import type React from "react"

interface FormTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const FormTemplate: React.FC<FormTemplateProps> = ({ title, description, children, onSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  )
}

export default FormTemplate
