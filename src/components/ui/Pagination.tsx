"use client"

import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Limit the number of visible pages
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", ...pages.slice(totalPages - 5)]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        }`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          )
        }

        return (
          <button
            key={index}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-2 rounded-md ${
              currentPage === page
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        }`}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination
