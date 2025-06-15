"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  MessageSquare,
} from "lucide-react"
import { AuthType, CaptchaType, SiteType, type SiteCreate, type SiteRead } from "@/types/site"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { SiteLogsDialog } from "@/components/site-logs-dialog"
import FormTemplate from "@/components/templates/form-template"
import CardTemplate from "@/components/templates/card-template"
import { useSites } from "@/hooks/use-sites"
import { ScraperManagement } from "@/components/scraper-management"
import { ScraperStatus } from "@/components/scraper-status"

export default function SitesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const {
    sites,
    availableScrapers,
    telegramAccounts,
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
    fetchTelegramAccounts,
  } = useSites()
  const { toast } = useToast()

  // Form states
  const [showSiteDialog, setShowSiteDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentSiteId, setCurrentSiteId] = useState<number | null>(null)
  const [formData, setFormData] = useState<SiteCreate>({
    name: "",
    url: "",
    type: SiteType.WEBSITE,
    auth_type: AuthType.NONE,
    captcha_type: CaptchaType.NONE,
    scraper: "generic",
    needs_js: false,
    enabled: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [runningTasks, setRunningTasks] = useState<Record<number, string>>({})
  const [refreshing, setRefreshing] = useState(false)

  // Delete confirmation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<SiteRead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Logs dialog states
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [logsForSite, setLogsForSite] = useState<{ id: number; name: string } | null>(null)

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "platform_admin") {
      fetchTelegramAccounts()
    }
  }, [isAuthenticated, user, fetchTelegramAccounts])

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
      url: "",
      type: SiteType.WEBSITE,
      auth_type: AuthType.NONE,
      captcha_type: CaptchaType.NONE,
      scraper: availableScrapers.length > 0 ? availableScrapers[0] : "generic",
      needs_js: false,
      enabled: true,
    })
    setIsEditMode(false)
    setCurrentSiteId(null)
  }

  const handleOpenCreateDialog = () => {
    resetForm()
    setShowSiteDialog(true)
  }

  const handleOpenEditDialog = (site: SiteRead) => {
    setFormData({
      name: site.name,
      url: site.url,
      type: site.type,
      auth_type: site.auth_type,
      captcha_type: site.captcha_type,
      scraper: site.scraper,
      needs_js: site.needs_js,
      enabled: site.enabled ?? true,
      bypass_config: site.bypass_config,
      credentials: site.credentials,
      telegram_account: site.telegram_account,
    })
    setIsEditMode(true)
    setCurrentSiteId(site.id)
    setShowSiteDialog(true)
  }

  const handleCloseDialog = () => {
    setShowSiteDialog(false)
    setTimeout(resetForm, 300)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      if (isEditMode && currentSiteId) {
        await updateSite(currentSiteId, formData)
        toast({
          title: "Sucesso",
          description: "Site atualizado com sucesso!",
        })
      } else {
        await createSite(formData)
        toast({
          title: "Sucesso",
          description: "Site criado com sucesso!",
        })
      }

      handleCloseDialog()
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
      await fetchTelegramAccounts()
      toast({
        title: "Atualizado",
        description: "Dados atualizados com sucesso",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar os dados",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const getSiteTypeBadge = (type: SiteType) => {
    const config = {
      [SiteType.FORUM]: { variant: "default" as const, label: "Fórum", icon: MessageSquare },
      [SiteType.WEBSITE]: { variant: "secondary" as const, label: "Website", icon: Globe },
      [SiteType.TELEGRAM]: { variant: "outline" as const, label: "Telegram", icon: MessageSquare },
      [SiteType.DISCORD]: { variant: "destructive" as const, label: "Discord", icon: MessageSquare },
      [SiteType.PASTE]: { variant: "default" as const, label: "Paste", icon: FileText },
    }

    const { variant, label, icon: Icon } = config[type]
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
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
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">Gerenciamento de Sites</h1>
            <p className="text-blue-700">Configure sites para scraping e monitore suas execuções</p>
            <ScraperStatus scrapers={availableScrapers} loading={scrapersLoading} error={error} />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleOpenCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Novo Site
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scrapers Management */}
        <ScraperManagement
          availableScrapers={availableScrapers}
          scrapersLoading={scrapersLoading}
          onUploadScraper={uploadScraper}
          onDeleteScraper={deleteScraper}
          onRefresh={fetchAvailableScrapers}
        />

        {/* Site Form Dialog */}
        <Dialog open={showSiteDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="sm:max-w-[800px] bg-white border-blue-200">
            <DialogHeader className="border-b border-blue-100 pb-4">
              <DialogTitle className="text-blue-900 text-xl">
                {isEditMode ? "Editar Site" : "Cadastrar Novo Site"}
              </DialogTitle>
              <DialogDescription className="text-blue-700">
                {isEditMode ? "Atualize as informações do site" : "Configure um novo site para scraping"}
              </DialogDescription>
            </DialogHeader>

            <FormTemplate title="" onSubmit={handleSubmit} isLoading={isSubmitting} className="border-0 shadow-none">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name" className="text-blue-900 font-medium">
                    Nome do Site *
                  </Label>
                  <Input
                    id="site-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Facebook, LinkedIn, etc."
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-url" className="text-blue-900 font-medium">
                    URL Principal *
                  </Label>
                  <Input
                    id="site-url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://exemplo.com"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-blue-50">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Básico
                  </TabsTrigger>
                  <TabsTrigger
                    value="scraper"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Scraper
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Avançado
                  </TabsTrigger>
                  <TabsTrigger
                    value="config"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Configuração
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-type" className="text-blue-900 font-medium">
                        Tipo do Site
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: SiteType) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SiteType.WEBSITE}>Website</SelectItem>
                          <SelectItem value={SiteType.FORUM}>Fórum</SelectItem>
                          <SelectItem value={SiteType.TELEGRAM}>Telegram</SelectItem>
                          <SelectItem value={SiteType.DISCORD}>Discord</SelectItem>
                          <SelectItem value={SiteType.PASTE}>Paste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scraper" className="text-blue-900 font-medium">
                        Scraper
                      </Label>
                      <Select
                        value={formData.scraper}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, scraper: value }))}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enabled: checked }))}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="enabled" className="text-blue-900 font-medium">
                      Site Ativo
                    </Label>
                  </div>
                </TabsContent>

                <TabsContent value="scraper" className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="needs-js"
                      checked={formData.needs_js}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, needs_js: checked }))}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="needs-js" className="text-blue-900 font-medium">
                      Requer JavaScript
                    </Label>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-type" className="text-blue-900 font-medium">
                        Tipo de Autenticação
                      </Label>
                      <Select
                        value={formData.auth_type}
                        onValueChange={(value: AuthType) => setFormData((prev) => ({ ...prev, auth_type: value }))}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AuthType.NONE}>Nenhuma</SelectItem>
                          <SelectItem value={AuthType.BASIC}>Básica</SelectItem>
                          <SelectItem value={AuthType.FORM}>Formulário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="captcha-type" className="text-blue-900 font-medium">
                        Tipo de Captcha
                      </Label>
                      <Select
                        value={formData.captcha_type}
                        onValueChange={(value: CaptchaType) =>
                          setFormData((prev) => ({ ...prev, captcha_type: value }))
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
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

                  {formData.type === SiteType.TELEGRAM && (
                    <div className="space-y-2">
                      <Label htmlFor="telegram-account" className="text-blue-900 font-medium">
                        Conta do Telegram
                      </Label>
                      <Select
                        value={formData.telegram_account?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            telegram_account: value ? Number.parseInt(value) : undefined,
                          }))
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          {telegramAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              Conta {account.id} (API ID: {account.api_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="config" className="space-y-4 pt-4">
                  {formData.auth_type !== AuthType.NONE && (
                    <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                      <h4 className="font-medium text-blue-900">Credenciais de Autenticação</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-blue-900 font-medium">
                            Usuário
                          </Label>
                          <Input
                            id="username"
                            value={formData.credentials?.username || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                credentials: { ...prev.credentials, username: e.target.value },
                              }))
                            }
                            placeholder="Nome de usuário"
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-blue-900 font-medium">
                            Senha
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.credentials?.password || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                credentials: { ...prev.credentials, password: e.target.value },
                              }))
                            }
                            placeholder="Senha"
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="token" className="text-blue-900 font-medium">
                          Token (Opcional)
                        </Label>
                        <Input
                          id="token"
                          value={formData.credentials?.token || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              credentials: { ...prev.credentials, token: e.target.value },
                            }))
                          }
                          placeholder="Token de acesso"
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                    <h4 className="font-medium text-blue-900">Configurações de Bypass</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="use-proxies"
                          checked={formData.bypass_config?.use_proxies || false}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              bypass_config: { ...prev.bypass_config, use_proxies: checked },
                            }))
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="use-proxies" className="text-blue-900 font-medium">
                          Usar Proxies
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="rotate-user-agent"
                          checked={formData.bypass_config?.rotate_user_agent || false}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              bypass_config: { ...prev.bypass_config, rotate_user_agent: checked },
                            }))
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="rotate-user-agent" className="text-blue-900 font-medium">
                          Rotacionar User Agent
                        </Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="captcha-solver" className="text-blue-900 font-medium">
                          Solucionador de Captcha
                        </Label>
                        <Input
                          id="captcha-solver"
                          value={formData.bypass_config?.captcha_solver || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bypass_config: { ...prev.bypass_config, captcha_solver: e.target.value },
                            }))
                          }
                          placeholder="Ex: 2captcha, anticaptcha"
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-3 pt-6 border-t border-blue-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEditMode ? "Atualizar" : "Criar"} Site
                </Button>
              </div>
            </FormTemplate>
          </DialogContent>
        </Dialog>

        {/* Delete Site Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="border-red-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-900">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-red-700">
                Tem certeza que deseja excluir o site "{siteToDelete?.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteSite}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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
        <CardTemplate
          title="Sites Cadastrados"
          description="Lista de todos os sites configurados para scraping"
          variant="blue"
          headerActions={<Globe className="h-5 w-5 text-blue-600" />}
        >
          {loading && sites.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-blue-400 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-blue-900">Nenhum site cadastrado</h3>
              <p className="text-blue-700 mb-4">Comece adicionando seu primeiro site para scraping</p>
              <Button onClick={handleOpenCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Site
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-blue-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="w-16 text-blue-900 font-semibold">ID</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Nome</TableHead>
                    <TableHead className="text-blue-900 font-semibold">URL</TableHead>
                    <TableHead className="w-32 text-blue-900 font-semibold">Tipo</TableHead>
                    <TableHead className="w-32 text-blue-900 font-semibold">Scraper</TableHead>
                    <TableHead className="w-32 text-blue-900 font-semibold">Autenticação</TableHead>
                    <TableHead className="w-32 text-blue-900 font-semibold">Captcha</TableHead>
                    <TableHead className="w-24 text-center text-blue-900 font-semibold">Status</TableHead>
                    <TableHead className="w-24 text-center text-blue-900 font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium text-blue-900">{site.id}</TableCell>
                      <TableCell className="font-medium text-blue-900">{site.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-3 w-3 text-blue-500" />
                          <span className="text-sm truncate max-w-[200px] text-blue-700" title={site.url}>
                            {site.url}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getSiteTypeBadge(site.type)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {site.scraper}
                        </Badge>
                      </TableCell>
                      <TableCell>{getAuthTypeBadge(site.auth_type)}</TableCell>
                      <TableCell>{getCaptchaTypeBadge(site.captcha_type)}</TableCell>
                      <TableCell className="text-center">
                        {site.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-blue-200">
                              <DropdownMenuItem
                                onClick={() => handleOpenEditDialog(site)}
                                className="text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleShowLogs(site)}
                                className="text-blue-700 hover:bg-blue-50"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Logs
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRunScraper(site.id)}
                                disabled={runningTasks[site.id] !== undefined}
                                className="text-green-700 hover:bg-green-50"
                              >
                                {runningTasks[site.id] ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2" />
                                )}
                                Executar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteSite(site)}
                                className="text-red-700 hover:bg-red-50"
                              >
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
        </CardTemplate>
      </div>
    </DashboardLayout>
  )
}
</
