import type React from "react"

interface HeaderTemplateProps {
  title: string
  children?: React.ReactNode
}

const HeaderTemplate: React.FC<HeaderTemplateProps> = ({ title, children }) => {
  return (
    <header className="bg-blue-100 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">{title}</h1>
        {children}
      </div>
    </header>
  )
}

export default HeaderTemplate
