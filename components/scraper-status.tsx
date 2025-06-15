"use client"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ScraperStatusProps {
  scrapers: string[]
  loading: boolean
  error?: string | null
}

export function ScraperStatus({ scrapers, loading, error }: ScraperStatusProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Carregando scrapers...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Erro ao carregar scrapers</span>
      </div>
    )
  }

  if (scrapers.length === 0) {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Nenhum scraper disponível</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm">{scrapers.length} scraper(s) disponível(is)</span>
      <div className="flex gap-1 ml-2">
        {scrapers.slice(0, 3).map((scraper) => (
          <Badge key={scraper} variant="outline" className="text-xs border-green-200 text-green-700">
            {scraper}
          </Badge>
        ))}
        {scrapers.length > 3 && (
          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
            +{scrapers.length - 3}
          </Badge>
        )}
      </div>
    </div>
  )
}
