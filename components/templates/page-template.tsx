import type React from "react"

interface PageTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, description, children }) => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default PageTemplate
