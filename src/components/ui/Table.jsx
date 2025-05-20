"use client"

import "../../styles/ui/table.css"

const Table = ({ columns, data, actions }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {actions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{column.render ? column.render(row) : row[column.accessor]}</td>
              ))}
              {actions && (
                <td className="actions">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="action-btn"
                      onClick={() => action.onClick(row)}
                      title={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
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
