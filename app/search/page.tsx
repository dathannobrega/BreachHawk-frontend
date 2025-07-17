"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Globe,
  Building,
  Calendar,
  Eye,
  Database,
  Info,
  MessageSquare,
  Download,
  Key,
  AlertTriangle,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLeakSearch } from "@/hooks/use-leak-search"
import DashboardLayout from "@/components/dashboard-layout"
import type { LeakResult } from "@/types/leak"

export default function SearchPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { results, loading, error, search, clearResults } = useLeakSearch()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading])

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await search(searchQuery)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const LeakCard = ({ leak }: { leak: LeakResult }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            {leak.company}
          </CardTitle>
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Vazamento
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <a href={leak.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {leak.source_url}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Encontrado em:</span>
              <span>{formatDate(leak.found_at)}</span>
            </div>

            {leak.publication_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Publicado em:</span>
                <span>{formatDate(leak.publication_date)}</span>
              </div>
            )}

            {leak.country && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">País:</span>
                <span>{leak.country}</span>
              </div>
            )}

            {leak.views && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Visualizações:</span>
                <span>{leak.views.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {leak.amount_of_data && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Quantidade de dados:</span>
                <span>{leak.amount_of_data}</span>
              </div>
            )}

            {leak.download_links && (
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Links disponíveis</span>
                <Badge variant="outline">Sim</Badge>
              </div>
            )}

            {leak.rar_password && (
              <div className="flex items-center gap-2 text-sm">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Protegido por senha</span>
                <Badge variant="outline">Sim</Badge>
              </div>
            )}
          </div>
        </div>

        {leak.information && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <span className="font-medium text-sm">Informações:</span>
                <p className="text-sm text-gray-700 mt-1">{leak.information}</p>
              </div>
            </div>
          </div>
        )}

        {leak.comment && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <span className="font-medium text-sm">Comentário:</span>
                <p className="text-sm text-gray-700 mt-1">{leak.comment}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesquisar Vazamentos</h1>
          <p className="text-gray-600 mt-2">Monitore vazamentos e menções da sua empresa na dark web</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nova Pesquisa</CardTitle>
            <CardDescription>Digite o nome da empresa ou termo que você deseja monitorar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Termo de Pesquisa</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Acme Corporation, exemplo.com, dados sensíveis..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
                  {loading ? "Pesquisando..." : "Pesquisar"}
                  <Search className="h-4 w-4 ml-2" />
                </Button>
                {results.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearResults}
                    className="flex-1 md:flex-none bg-transparent"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Vazamentos Encontrados
              </h2>
              <Badge variant="secondary">
                {results.length} resultado(s) para "{searchQuery}"
              </Badge>
            </div>

            <div className="space-y-4">
              {results.map((leak, index) => (
                <LeakCard key={`${leak.site_id}-${index}`} leak={leak} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && searchQuery && !error && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vazamento encontrado</h3>
              <p className="text-gray-600">
                Não foram encontrados vazamentos para "{searchQuery}". Tente usar termos diferentes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
