"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface Action {
  label: string
  onClick: (item: any) => void
  className?: string
  disabled?: (item: any) => boolean
}

interface TableProps {
  columns: Column[]
  data: any[]
  actions?: Action[]
  emptyMessage?: string
  className?: string
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  actions,
  emptyMessage = "Nenhum dado encontrado.",
  className,
}) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3">
                {column.label}
              </th>
            ))}
            {actions && actions.length > 0 && <th className="px-6 py-3">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {actions.map((action, actionIndex) => {
                        const isDisabled = action.disabled ? action.disabled(row) : false
                        return (
                          <button
                            key={actionIndex}
                            onClick={() => !isDisabled && action.onClick(row)}
                            className={cn(
                              "text-sm font-medium",
                              isDisabled ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:underline",
                              action.className,
                            )}
                            disabled={isDisabled}
                          >
                            {action.label}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b">
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
