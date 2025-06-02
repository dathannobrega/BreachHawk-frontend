"use client"

import type React from "react"

interface Column {
  header: string
  accessor: string
  render?: (row: any) => React.ReactNode
}

interface Action {
  label: string
  onClick: (item: any) => void
  icon?: React.ReactNode
  className?: string
  disabled?: (row: any) => boolean
}

interface TableProps {
  columns: Column[]
  data: any[]
  actions?: Action[]
  emptyMessage?: string
}

const Table: React.FC<TableProps> = ({ columns, data, actions = [], emptyMessage = "Nenhum dado encontrado." }) => {
  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {actions.map((action, actionIndex) => {
                      const isDisabled = action.disabled ? action.disabled(row) : false
                      return (
                        <button
                          key={actionIndex}
                          onClick={() => !isDisabled && action.onClick(row)}
                          className={`${
                            isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : `text-primary hover:text-primary-dark ${action.className || ""}`
                          }`}
                          disabled={isDisabled}
                        >
                          {action.icon && <span className="mr-1">{action.icon}</span>}
                          {action.label}
                        </button>
                      )
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
