import type React from "react"

interface CardTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
}

const CardTemplate: React.FC<CardTemplateProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-blue-700">{title}</div>
        {description && <p className="text-gray-700 text-base">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default CardTemplate
