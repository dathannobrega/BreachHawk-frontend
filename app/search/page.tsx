"use client"

import type React from "react"

import { useState } from "react"
import { Search, AlertCircle, Calendar, Globe, Eye, Database, FileText, Download, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLeakSearch } from "@/hooks/use-leak-search"
import DashboardLayout from "@/components/dashboard-layout"

export default function SearchPage() {
  const { user, isAuthenticated } = useAuth()
  const [query, setQuery] = useState("")
  const { results, loading, error, searchLeaks, clearResults } = useLeakSearch()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchLeaks(query)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar a pesquisa</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesquisa de Vazamentos</h1>
          <p className="text-gray-600">Monitore vazamentos de dados na dark web em tempo real</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Vazamentos
            </CardTitle>
            <CardDescription>
              Digite o nome da empresa, domínio ou palavra-chave para pesquisar vazamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Ex: acme, exemplo.com, dados pessoais..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? "Pesquisando..." : "Pesquisar"}
              </Button>
              {results.length > 0 && (
                <Button type="button" variant="outline" onClick={clearResults}>
                  Limpar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Pesquisando vazamentos...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Resultados da Pesquisa ({results.length})</h2>
              <Badge variant="outline">{results.length} vazamento(s) encontrado(s)</Badge>
            </div>

            <div className="grid gap-6">
              {results.map((leak, index) => (
                <Card key={`${leak.site_id}-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-red-700">{leak.company}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Globe className="h-4 w-4" />
                          <a
                            href={leak.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {leak.source_url}
                          </a>
                        </CardDescription>
                      </div>
                      <Badge variant="destructive">Vazamento</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Data de Descoberta */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Descoberto em</p>
                          <p className="text-sm text-gray-600">{formatDate(leak.found_at)}</p>
                        </div>
                      </div>

                      {/* Data de Publicação */}
                      {leak.publication_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Publicado em</p>
                            <p className="text-sm text-gray-600">{formatDate(leak.publication_date)}</p>
                          </div>
                        </div>
                      )}

                      {/* País */}
                      {leak.country && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">País</p>
                            <p className="text-sm text-gray-600">{leak.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Visualizações */}
                      {leak.views && (
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Visualizações</p>
                            <p className="text-sm text-gray-600">{leak.views.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      {/* Quantidade de Dados */}
                      {leak.amount_of_data && (
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Volume de Dados</p>
                            <p className="text-sm text-gray-600">{leak.amount_of_data}</p>
                          </div>
                        </div>
                      )}

                      {/* Downloads Disponíveis */}
                      {leak.download_links && (
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Downloads</p>
                            <Badge variant="destructive" className="text-xs">
                              Disponível
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Senha RAR */}
                      {leak.rar_password && (
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Senha RAR</p>
                            <Badge variant="outline" className="text-xs">
                              Protegido
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Informações Adicionais */}
                    {leak.information && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Informações</p>
                            <p className="text-sm text-gray-600">{leak.information}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comentários */}
                    {leak.comment && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-700 mb-1">Comentário</p>
                            <p className="text-sm text-blue-600">{leak.comment}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && !error && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vazamento encontrado</h3>
            <p className="text-gray-500 mb-4">
              Não foram encontrados vazamentos para "{query}". Tente usar termos diferentes.
            </p>
            <Button variant="outline" onClick={clearResults}>
              Nova Pesquisa
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
