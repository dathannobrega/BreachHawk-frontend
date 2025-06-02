"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Buscar...", value, onChange, className }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
