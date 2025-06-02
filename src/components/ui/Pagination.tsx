"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add page numbers in the middle
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <nav className={cn("flex items-center justify-center mt-4", className)} aria-label="Pagination">
      <ul className="inline-flex -space-x-px">
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "px-3 py-2 ml-0 leading-tight border rounded-l-lg",
              currentPage === 1
                ? "text-gray-300 bg-white border-gray-300 cursor-not-allowed"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700",
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </li>

        {renderPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
            ) : (
              <button
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={cn(
                  "px-3 py-2 leading-tight border",
                  currentPage === page
                    ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700",
                )}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "px-3 py-2 leading-tight border rounded-r-lg",
              currentPage === totalPages
                ? "text-gray-300 bg-white border-gray-300 cursor-not-allowed"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700",
            )}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
