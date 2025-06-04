"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, Plus, Play, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Site {
  id: number
  url: string
  auth_type: "none" | "basic" | "form"
  captcha_type: "none" | "image" | "math" | "rotated"
  enabled: boolean
  created_at: string
  scraper: string
  needs_js: boolean
}

interface SiteMetrics {
  id: number
  site_id: number
  timestamp: string
  retries: number
  permanent_fail: boolean
}

export default function AdminSites() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<Site[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [loadingSites, setLoadingSites] = useState(true)

  // Form state
  const [siteForm, setSiteForm] = useState({
    url: "",
    auth_type: "none" as const,
    captcha_type: "none" as const,
    enabled: true,
    scraper: "generic",
    needs_js: false,
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchSites()
    }
  }, [user])

  const fetchSites = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/sites/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSites(data)
      }
    } catch (error) {
      console.error("Erro ao carregar sites:", error)
    } finally {
      setLoadingSites(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`${apiUrl}/api/v1/sites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(siteForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erro ao criar site")
      }

      const newSite = await response.json()
      setSites([...sites, newSite])
      setMessage("Site criado com sucesso!")
      setIsDialogOpen(false)
      setSiteForm({
        url: "",
        auth_type: "none",
        captcha_type: "none",
        enabled: true,
        scraper: "generic",
        needs_js: false,
      })
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao criar site")
    } finally {
      setSaving(false)
    }
  }

  const handleRunScraper = async (siteId: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/sites/${siteId}/run`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao executar scraper")
      }

      const result = await response.json()
      setMessage(`Scraper iniciado! Task ID: ${result.task_id}`)
      setTimeout(() => setMessage(""), 5000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao executar scraper")
    }
  }

  if (loading || loadingSites) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Sites</h1>
            <p className="text-gray-600 mt-2">Configure e monitore sites para scraping</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Site
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Site</DialogTitle>
                <DialogDescription>Configure um novo site para monitoramento e scraping</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL do Site</Label>
                  <Input
                    id="url"
                    type="url"
                    value={siteForm.url}
                    onChange={(e) => setSiteForm({ ...siteForm, url: e.target.value })}
                    placeholder="https://exemplo.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auth_type">Tipo de Autenticação</Label>
                    <Select
                      value={siteForm.auth_type}
                      onValueChange={(value: any) => setSiteForm({ ...siteForm, auth_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="form">Formulário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captcha_type">Tipo de Captcha</Label>
                    <Select
                      value={siteForm.captcha_type}
                      onValueChange={(value: any) => setSiteForm({ ...siteForm, captcha_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="math">Matemático</SelectItem>
                        <SelectItem value="rotated">Rotacionado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scraper">Scraper</Label>
                  <Input
                    id="scraper"
                    value={siteForm.scraper}
                    onChange={(e) => setSiteForm({ ...siteForm, scraper: e.target.value })}
                    placeholder="generic"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requer JavaScript</Label>
                    <p className="text-sm text-gray-500">Site precisa de JS para funcionar</p>
                  </div>
                  <Switch
                    checked={siteForm.needs_js}
                    onCheckedChange={(checked) => setSiteForm({ ...siteForm, needs_js: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Habilitado</Label>
                    <p className="text-sm text-gray-500">Site ativo para scraping</p>
                  </div>
                  <Switch
                    checked={siteForm.enabled}
                    onCheckedChange={(checked) => setSiteForm({ ...siteForm, enabled: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Criando..." : "Criar Site"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Sites Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sites Configurados
            </CardTitle>
            <CardDescription>Lista de todos os sites configurados para monitoramento</CardDescription>
          </CardHeader>
          <CardContent>
            {sites.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum site configurado</h3>
                <p className="text-gray-500 mb-4">Adicione seu primeiro site para começar o monitoramento</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Site
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Autenticação</TableHead>
                    <TableHead>Captcha</TableHead>
                    <TableHead>Scraper</TableHead>
                    <TableHead>JavaScript</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          {site.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={site.enabled ? "default" : "secondary"}>
                          {site.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {site.auth_type === "none" ? "Nenhuma" : site.auth_type === "basic" ? "Basic" : "Formulário"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{site.captcha_type === "none" ? "Nenhum" : site.captcha_type}</Badge>
                      </TableCell>
                      <TableCell>{site.scraper}</TableCell>
                      <TableCell>
                        {site.needs_js ? <Badge variant="secondary">Sim</Badge> : <Badge variant="outline">Não</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunScraper(site.id)}
                            disabled={!site.enabled}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
