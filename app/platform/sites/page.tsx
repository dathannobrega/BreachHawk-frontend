"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Globe,
  Plus,
  Play,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Edit,
  MoreHorizontal,
  FileText,
  Settings,
} from "lucide-react"
import { useSites } from "@/hooks/use-sites"
import { AuthType, CaptchaType, type SiteCreate, type SiteRead } from "@/types/site"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { SiteLogsDialog } from "@/components/site-logs-dialog"

export default function SitesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const {
    sites,
    availableScrapers,
    loading,
    scrapersLoading,
    error,
    createSite,
    updateSite,
    deleteSite,
    uploadScraper,
    deleteScraper,
    runScraper,
    getTaskStatus,
    fetchSites,
    fetchAvailableScrapers,
  } = useSites()
  const { toast } = useToast()

  // Form states
  const [showSiteDialog, setShowSiteDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentSiteId, setCurrentSiteId] = useState<number | null>(null)
  const [formData, setFormData] = useState<SiteCreate>({
    name: "",
    links: [""],
    auth_type: AuthType.NONE,
    captcha_type: CaptchaType.NONE,
    scraper: "generic",
    needs_js: false,
  })
  const [scraperFile, setScraperFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [runningTasks, setRunningTasks] = useState<Record<number, string>>({})
  const [refreshing, setRefreshing] = useState(false)

  // Delete confirmation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<SiteRead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Logs dialog states
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [logsForSite, setLogsForSite] = useState<{ id: number; name: string } | null>(null)

  // Scraper management states
  const [showScraperDeleteDialog, setShowScraperDeleteDialog] = useState(false)
  const [scraperToDelete, setScraperToDelete] = useState<string | null>(null)
  const [isDeletingScraper, setIsDeletingScraper] = useState(false)

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user, router])

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "platform_admin") {
    return null
  }

  const resetForm = () => {
    setFormData({
      name: "",
      links: [""],
      auth_type: AuthType.NONE,
      captcha_type: CaptchaType.NONE,
      scraper: availableScrapers.length > 0 ? availableScrapers[0] : "generic",
      needs_js: false,
    })
    setScraperFile(null)
    setIsEditMode(false)
    setCurrentSiteId(null)
    // Reset file input
    const fileInput = document.getElementById("scraper-file") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleOpenCreateDialog = () => {
    resetForm()
    setShowSiteDialog(true)
  }

  const handleOpenEditDialog = (site: SiteRead) => {
    setFormData({
      name: site.name,
      links: [...site.links],
      auth_type: site.auth_type,
      captcha_type: site.captcha_type,
      scraper: site.scraper,
      needs_js: site.needs_js,
    })
    setIsEditMode(true)
    setCurrentSiteId(site.id)
    setShowSiteDialog(true)
  }

  const handleCloseDialog = () => {
    setShowSiteDialog(false)
    setTimeout(resetForm, 300) // Reset after dialog animation
  }

  const handleDeleteSite = (site: SiteRead) => {
    setSiteToDelete(site)
    setShowDeleteDialog(true)
  }

  const confirmDeleteSite = async () => {
    if (!siteToDelete) return

    setIsDeleting(true)
    try {
      await deleteSite(siteToDelete.id)
      toast({
        title: "Sucesso",
        description: "Site excluído com sucesso!",
      })
      setShowDeleteDialog(false)
      setSiteToDelete(null)
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao excluir site",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShowLogs = (site: SiteRead) => {
    setLogsForSite({ id: site.id, name: site.name })
    setShowLogsDialog(true)
  }

  const handleDeleteScraper = (slug: string) => {
    setScraperToDelete(slug)
    setShowScraperDeleteDialog(true)
  }

  const confirmDeleteScraper = async () => {
    if (!scraperToDelete) return

    setIsDeletingScraper(true)
    try {
      await deleteScraper(scraperToDelete)
      toast({
        title: "Sucesso",
        description: "Scraper excluído com sucesso!",
      })
      setShowScraperDeleteDialog(false)
      setScraperToDelete(null)
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao excluir scraper",
        variant: "destructive",
      })
    } finally {
      setIsDeletingScraper(false)
    }
  }

  const addUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, ""],
    }))
  }

  const removeUrlField = (index: number) => {
    if (formData.links.length > 1) {
      setFormData((prev) => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index),
      }))
    }
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

    setIsUploadingFile(true)
    try {
      const result = await uploadScraper(scraperFile)
      toast({
        title: "Sucesso",
        description: `${result.msg} - Slug: ${result.slug}`,
      })
      setScraperFile(null)
      // Reset file input
      const fileInput = document.getElementById("scraper-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Atualiza a lista de scrapers disponíveis
      await fetchAvailableScrapers()
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao fazer upload",
        variant: "destructive",
      })
    } finally {
      setIsUploadingFile(false)
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Nome do site é obrigatório",
        variant: "destructive",
      })
      return false
    }

    const validLinks = formData.links.filter((link) => link.trim() !== "")
    if (validLinks.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Adicione pelo menos uma URL válida",
        variant: "destructive",
      })
      return false
    }

    if (!formData.scraper.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Nome do scraper é obrigatório",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const validLinks = formData.links.filter((link) => link.trim() !== "")
      const siteData = {
        ...formData,
        links: validLinks,
      }

      if (isEditMode && currentSiteId) {
        await updateSite(currentSiteId, siteData)
        toast({
          title: "Sucesso",
          description: "Site atualizado com sucesso!",
        })
      } else {
        await createSite(siteData)
        toast({
          title: "Sucesso",
          description: "Site criado com sucesso!",
        })
      }

      handleCloseDialog()
      // Refresh sites list
      await fetchSites()
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : `Erro ao ${isEditMode ? "atualizar" : "criar"} site`,
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
          } else if (status.status === "PENDING" || status.status === "STARTED") {
            // Continue polling
            setTimeout(pollStatus, 2000)
          }
        } catch (err) {
          console.error("Error polling task status:", err)
          setRunningTasks((prev) => {
            const newTasks = { ...prev }
            delete newTasks[siteId]
            return newTasks
          })
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
      await fetchAvailableScrapers()
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
    const config = {
      [AuthType.NONE]: { variant: "secondary" as const, label: "Nenhuma" },
      [AuthType.BASIC]: { variant: "default" as const, label: "Básica" },
      [AuthType.FORM]: { variant: "outline" as const, label: "Formulário" },
    }

    const { variant, label } = config[authType]
    return <Badge variant={variant}>{label}</Badge>
  }

  const getCaptchaTypeBadge = (captchaType: CaptchaType) => {
    const config = {
      [CaptchaType.NONE]: { variant: "secondary" as const, label: "Nenhum" },
      [CaptchaType.IMAGE]: { variant: "destructive" as const, label: "Imagem" },
      [CaptchaType.MATH]: { variant: "default" as const, label: "Matemático" },
      [CaptchaType.ROTATED]: { variant: "outline" as const, label: "Rotacionado" },
    }

    const { variant, label } = config[captchaType]
    return <Badge variant={variant}>{label}</Badge>
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
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Site
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scrapers Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Scrapers Disponíveis
            </CardTitle>
            <CardDescription>Gerencie os scrapers personalizados do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {scrapersLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Carregando scrapers...</span>
                  </div>
                ) : availableScrapers.length > 0 ? (
                  availableScrapers.map((scraper) => (
                    <div key={scraper} className="flex items-center gap-1">
                      <Badge variant="outline">{scraper}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDeleteScraper(scraper)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Nenhum scraper disponível</span>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  id="scraper-file"
                  type="file"
                  accept=".py"
                  onChange={(e) => setScraperFile(e.target.files?.[0] || null)}
                  className="flex-1"
                  disabled={isUploadingFile}
                />
                <Button variant="outline" onClick={handleScraperUpload} disabled={!scraperFile || isUploadingFile}>
                  {isUploadingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Scraper
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas arquivos .py são aceitos. O scraper deve registrar-se no registry.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Site Form Dialog */}
        <Dialog open={showSiteDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="sm:max-w-[600px] bg-background">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Site" : "Cadastrar Novo Site"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Atualize as informações do site" : "Configure um novo site para scraping"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Site Name */}
              <div className="space-y-2">
                <Label htmlFor="site-name" className="text-sm font-medium">
                  Nome do Site
                </Label>
                <Input
                  id="site-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Facebook, LinkedIn, etc."
                  className="w-full"
                />
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">URLs</TabsTrigger>
                  <TabsTrigger value="scraper">Scraper</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">URLs do Site</Label>
                      <div className="space-y-2 mt-2">
                        {formData.links.map((url, index) => (
                          <div key={index} className="flex gap-2">
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
                        <Button type="button" variant="outline" size="sm" onClick={addUrlField} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar URL
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="scraper" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scraper" className="text-sm font-medium">
                        Scraper
                      </Label>
                      <Select
                        value={formData.scraper}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, scraper: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione um scraper" />
                        </SelectTrigger>
                        <SelectContent>
                          {scrapersLoading ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Carregando scrapers...</span>
                            </div>
                          ) : availableScrapers.length > 0 ? (
                            availableScrapers.map((scraper) => (
                              <SelectItem key={scraper} value={scraper}>
                                {scraper}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              Nenhum scraper disponível. Faça upload de um.
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="auth-type" className="text-sm font-medium">
                        Tipo de Autenticação
                      </Label>
                      <Select
                        value={formData.auth_type}
                        onValueChange={(value: AuthType) => setFormData((prev) => ({ ...prev, auth_type: value }))}
                      >
                        <SelectTrigger className="mt-2">
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
                      <Label htmlFor="captcha-type" className="text-sm font-medium">
                        Tipo de Captcha
                      </Label>
                      <Select
                        value={formData.captcha_type}
                        onValueChange={(value: CaptchaType) =>
                          setFormData((prev) => ({ ...prev, captcha_type: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
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
                    <Label htmlFor="needs-js" className="text-sm font-medium">
                      Requer JavaScript
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEditMode ? "Atualizar" : "Criar"} Site
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Site Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o site "{siteToDelete?.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteSite}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Scraper Confirmation Dialog */}
        <AlertDialog open={showScraperDeleteDialog} onOpenChange={setShowScraperDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão do Scraper</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o scraper "{scraperToDelete}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteScraper}
                disabled={isDeletingScraper}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingScraper && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Site Logs Dialog */}
        <SiteLogsDialog
          siteId={logsForSite?.id || null}
          siteName={logsForSite?.name || ""}
          open={showLogsDialog}
          onOpenChange={setShowLogsDialog}
        />

        {/* Sites Table */}
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
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sites.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum site cadastrado</h3>
                <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro site para scraping</p>
                <Button onClick={handleOpenCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Site
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>URLs</TableHead>
                      <TableHead className="w-32">Scraper</TableHead>
                      <TableHead className="w-32">Autenticação</TableHead>
                      <TableHead className="w-32">Captcha</TableHead>
                      <TableHead className="w-24 text-center">JavaScript</TableHead>
                      <TableHead className="w-24 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.id}</TableCell>
                        <TableCell className="font-medium">{site.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {site.links.slice(0, 2).map((link, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[200px]" title={link}>
                                  {link}
                                </span>
                              </div>
                            ))}
                            {site.links.length > 2 && (
                              <div className="text-xs text-muted-foreground">+{site.links.length - 2} mais</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{site.scraper}</Badge>
                        </TableCell>
                        <TableCell>{getAuthTypeBadge(site.auth_type)}</TableCell>
                        <TableCell>{getCaptchaTypeBadge(site.captcha_type)}</TableCell>
                        <TableCell className="text-center">
                          {site.needs_js ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenEditDialog(site)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShowLogs(site)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver Logs
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRunScraper(site.id)}
                                  disabled={runningTasks[site.id] !== undefined}
                                >
                                  {runningTasks[site.id] ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <Play className="h-4 w-4 mr-2" />
                                  )}
                                  Executar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteSite(site)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
