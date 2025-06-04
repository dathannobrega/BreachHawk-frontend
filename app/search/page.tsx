"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, Mail, Building, User, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function SearchPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("domain")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)

    // Simular busca
    setTimeout(() => {
      setResults([
        {
          id: 1,
          source: "forum-hacker.net",
          content: `Dados relacionados a: ${searchQuery}`,
          date: "2023-05-15",
          severity: "high",
          type: searchType,
        },
        {
          id: 2,
          source: "darkweb-marketplace.onion",
          content: `Menção encontrada: ${searchQuery}`,
          date: "2023-05-14",
          severity: "medium",
          type: searchType,
        },
      ])
      setSearching(false)
    }, 2000)
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "domain":
        return <Globe className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "company":
        return <Building className="h-4 w-4" />
      case "person":
        return <User className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesquisar na Dark Web</h1>
          <p className="text-gray-600 mt-2">Monitore vazamentos e menções da sua empresa</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nova Pesquisa</CardTitle>
            <CardDescription>Digite o que você deseja monitorar na dark web</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="search">Termo de Pesquisa</Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="exemplo.com, email@empresa.com, nome da empresa..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domain">Domínio</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                      <SelectItem value="person">Pessoa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={searching} className="w-full md:w-auto">
                {searching ? "Pesquisando..." : "Iniciar Pesquisa"}
                <Search className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Resultados Encontrados
              </CardTitle>
              <CardDescription>
                {results.length} resultado(s) encontrado(s) para "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSearchIcon(result.type)}
                        <span className="font-medium">{result.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(result.severity)}`}></div>
                        <Badge variant={result.severity === "high" ? "destructive" : "secondary"}>
                          {result.severity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{result.content}</p>
                    <p className="text-sm text-gray-500">{result.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
