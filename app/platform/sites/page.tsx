"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Globe, Plus, Play, Upload, Loader2, CheckCircle, XCircle, Trash2, ExternalLink, RefreshCw } from "lucide-react"
import { useSites } from "@/hooks/use-sites"
import { AuthType, CaptchaType, type SiteCreate } from "@/types/site"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function SitesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { sites, loading, error, createSite, uploadScraper, runScraper, getTaskStatus, fetchSites } = useSites()
  const { toast } = useToast()

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<SiteCreate>({
    links: [""],
    auth_type: AuthType.NONE,
    captcha_type: CaptchaType.NONE,
    scraper: "generic",
    needs_js: false,
  })
  const [scraperFile, setScraperFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [runningTasks, setRunningTasks] = useState<Record<number, string>>({})
  const [refreshing, setRefreshing] = useState(false)

  // Verificar autenticação
  if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
    router.push("/login")
    return null
  }

  const addUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, ""],
    }))
  }

  const removeUrlField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const updateUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((url, i) => (i === index ? value : url)),
    }))
  }

  const handleScraperUpload = async () => {
    if (!scraperFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Python",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await uploadScraper(scraperFile)
      toast({
        title: "Sucesso",
        description: result.msg,
      })
      setScraperFile(null)
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao fazer upload",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    const validLinks = formData.links.filter((link) => link.trim() !== "")
    if (validLinks.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma URL",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createSite({
        ...formData,
        links: validLinks,
      })

      toast({
        title: "Sucesso",
        description: "Site criado com sucesso!",
      })

      // Reset form
      setFormData({
        links: [""],
        auth_type: AuthType.NONE,
        captcha_type: CaptchaType.NONE,
        scraper: "generic",
        needs_js: false,
      })
      setShowCreateForm(false)

      // Refresh sites list
      await fetchSites()
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao criar site",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRunScraper = async (siteId: number) => {
    try {
      const task = await runScraper(siteId)
      setRunningTasks((prev) => ({ ...prev, [siteId]: task.task_id }))

      toast({
        title: "Scraper Iniciado",
        description: `Task ID: ${task.task_id}`,
      })

      // Poll task status
      const pollStatus = async () => {
        try {
          const status = await getTaskStatus(task.task_id)
          if (status.status === "SUCCESS") {
            setRunningTasks((prev) => {
              const newTasks = { ...prev }
              delete newTasks[siteId]
              return newTasks
            })
            toast({
              title: "Scraper Concluído",
              description: "Scraping executado com sucesso!",
            })
          } else if (status.status === "FAILURE") {
            setRunningTasks((prev) => {
              const newTasks = { ...prev }
              delete newTasks[siteId]
              return newTasks
            })
            toast({
              title: "Erro no Scraper",
              description: "Falha na execução do scraping",
              variant: "destructive",
            })
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000)
          }
        } catch (err) {
          console.error("Error polling task status:", err)
        }
      }

      setTimeout(pollStatus, 2000)
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao executar scraper",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchSites()
      toast({
        title: "Atualizado",
        description: "Lista de sites atualizada com sucesso",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a lista de sites",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const getAuthTypeBadge = (authType: AuthType) => {
    const variants = {
      [AuthType.NONE]: "secondary",
      [AuthType.BASIC]: "default",
      [AuthType.FORM]: "outline",
    } as const

    return <Badge variant={variants[authType]}>{authType}</Badge>
  }

  const getCaptchaTypeBadge = (captchaType: CaptchaType) => {
    const variants = {
      [CaptchaType.NONE]: "secondary",
      [CaptchaType.IMAGE]: "destructive",
      [CaptchaType.MATH]: "default",
      [CaptchaType.ROTATED]: "outline",
    } as const

    return <Badge variant={variants[captchaType]}>{captchaType}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Sites</h1>
            <p className="text-muted-foreground">Configure sites para scraping e monitore suas execuções</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Site
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Novo Site</CardTitle>
              <CardDescription>Configure um novo site para scraping</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Configurações Básicas</TabsTrigger>
                  <TabsTrigger value="scraper">Scraper</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>URLs do Site</Label>
                        {formData.links.map((url, index) => (
                          <div key={index} className="flex gap-2 mt-2">
                            <Input
                              placeholder="https://exemplo.com"
                              value={url}
                              onChange={(e) => updateUrl(index, e.target.value)}
                              className="flex-1"
                            />
                            {formData.links.length > 1 && (
                              <Button type="button" variant="outline" size="icon" onClick={() => removeUrlField(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addUrlField} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar URL
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="scraper" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="scraper">Nome do Scraper</Label>
                        <Input
                          id="scraper"
                          value={formData.scraper}
                          onChange={(e) => setFormData((prev) => ({ ...prev, scraper: e.target.value }))}
                          placeholder="generic"
                        />
                      </div>

                      <div>
                        <Label htmlFor="scraper-file">Upload do Scraper Python</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="scraper-file"
                            type="file"
                            accept=".py"
                            onChange={(e) => setScraperFile(e.target.files?.[0] || null)}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" onClick={handleScraperUpload} disabled={!scraperFile}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Apenas arquivos .py são aceitos</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="auth-type">Tipo de Autenticação</Label>
                        <Select
                          value={formData.auth_type}
                          onValueChange={(value: AuthType) => setFormData((prev) => ({ ...prev, auth_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={AuthType.NONE}>Nenhuma</SelectItem>
                            <SelectItem value={AuthType.BASIC}>Básica</SelectItem>
                            <SelectItem value={AuthType.FORM}>Formulário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="captcha-type">Tipo de Captcha</Label>
                        <Select
                          value={formData.captcha_type}
                          onValueChange={(value: CaptchaType) =>
                            setFormData((prev) => ({ ...prev, captcha_type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={CaptchaType.NONE}>Nenhum</SelectItem>
                            <SelectItem value={CaptchaType.IMAGE}>Imagem</SelectItem>
                            <SelectItem value={CaptchaType.MATH}>Matemático</SelectItem>
                            <SelectItem value={CaptchaType.ROTATED}>Rotacionado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="needs-js"
                        checked={formData.needs_js}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, needs_js: checked }))}
                      />
                      <Label htmlFor="needs-js">Requer JavaScript</Label>
                    </div>
                  </TabsContent>

                  <div className="flex justify-end space-x-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Criar Site
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sites Cadastrados
            </CardTitle>
            <CardDescription>Lista de todos os sites configurados para scraping</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && sites.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sites.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum site cadastrado</h3>
                <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro site para scraping</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Site
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>URLs</TableHead>
                      <TableHead>Scraper</TableHead>
                      <TableHead>Autenticação</TableHead>
                      <TableHead>Captcha</TableHead>
                      <TableHead>JavaScript</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {site.links.map((link, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <ExternalLink className="h-3 w-3" />
                                <span className="text-sm truncate max-w-[200px]">{link}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{site.scraper}</Badge>
                        </TableCell>
                        <TableCell>{getAuthTypeBadge(site.auth_type)}</TableCell>
                        <TableCell>{getCaptchaTypeBadge(site.captcha_type)}</TableCell>
                        <TableCell>
                          {site.needs_js ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRunScraper(site.id)}
                              disabled={runningTasks[site.id] !== undefined}
                            >
                              {runningTasks[site.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
