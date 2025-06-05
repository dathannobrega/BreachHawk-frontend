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
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Plus, Play, Trash2, Eye, X, Upload, Check, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { useSites } from "@/hooks/use-sites"
import type { SiteFormData } from "@/types/site"

export default function PlatformSites() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { sites, loading, error, createSite, updateSite, deleteSite, runScraper } = useSites()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Form state
  const [siteForm, setSiteForm] = useState<SiteFormData>({
    name: "",
    urls: [{ url: "", is_primary: true }],
    scraper_name: "",
    enabled: true,
    auth_type: "none",
    captcha_type: "none",
    needs_js: false,
  })

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user, router])

  const handleAddUrl = () => {
    setSiteForm({
      ...siteForm,
      urls: [...siteForm.urls, { url: "", is_primary: false }],
    })
  }

  const handleRemoveUrl = (index: number) => {
    const newUrls = [...siteForm.urls]
    newUrls.splice(index, 1)

    // Se removermos a URL primária, definimos a primeira URL como primária
    if (siteForm.urls[index].is_primary && newUrls.length > 0) {
      newUrls[0].is_primary = true
    }

    setSiteForm({
      ...siteForm,
      urls: newUrls,
    })
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...siteForm.urls]
    newUrls[index].url = value
    setSiteForm({
      ...siteForm,
      urls: newUrls,
    })
  }

  const handlePrimaryChange = (index: number) => {
    const newUrls = siteForm.urls.map((url, i) => ({
      ...url,
      is_primary: i === index,
    }))

    setSiteForm({
      ...siteForm,
      urls: newUrls,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (file) {
      if (!file.name.endsWith(".py")) {
        setFileError("O arquivo deve ser um script Python (.py)")
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      setSiteForm({
        ...siteForm,
        scraper_file: file,
      })
    }
  }

  const validateForm = () => {
    // Verificar se o nome está preenchido
    if (!siteForm.name.trim()) {
      setMessage("O nome do site é obrigatório")
      setMessageType("error")
      return false
    }

    // Verificar se pelo menos uma URL está preenchida
    if (siteForm.urls.length === 0 || !siteForm.urls.some((url) => url.url.trim())) {
      setMessage("Pelo menos uma URL deve ser preenchida")
      setMessageType("error")
      return false
    }

    // Verificar se todas as URLs preenchidas são válidas
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    for (const urlObj of siteForm.urls) {
      if (urlObj.url.trim() && !urlRegex.test(urlObj.url)) {
        setMessage(`URL inválida: ${urlObj.url}`)
        setMessageType("error")
        return false
      }
    }

    // Verificar se o nome do scraper está preenchido
    if (!siteForm.scraper_name.trim()) {
      setMessage("O nome do scraper é obrigatório")
      setMessageType("error")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setMessage("")

    try {
      await createSite(siteForm)
      setMessage("Site criado com sucesso!")
      setMessageType("success")
      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 5000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao criar site")
      setMessageType("error")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setSiteForm({
      name: "",
      urls: [{ url: "", is_primary: true }],
      scraper_name: "",
      enabled: true,
      auth_type: "none",
      captcha_type: "none",
      needs_js: false,
    })
    setSelectedFile(null)
    setFileError(null)
  }

  const handleDeleteSite = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este site?")) {
      try {
        await deleteSite(id)
        setMessage("Site excluído com sucesso!")
        setMessageType("success")
        setTimeout(() => setMessage(""), 5000)
      } catch (error: any) {
        setMessage(error.message || "Erro ao excluir site")
        setMessageType("error")
      }
    }
  }

  const handleRunScraper = async (id: number) => {
    try {
      const result = await runScraper(id)
      setMessage(`Scraper iniciado! Task ID: ${result.task_id}`)
      setMessageType("success")
      setTimeout(() => setMessage(""), 5000)
    } catch (error: any) {
      setMessage(error.message || "Erro ao executar scraper")
      setMessageType("error")
    }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "platform_admin") return null

  return (
    <DashboardLayout>
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
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Site</DialogTitle>
                <DialogDescription>Configure um novo site para monitoramento e scraping</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Site</Label>
                      <Input
                        id="name"
                        value={siteForm.name}
                        onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                        placeholder="Ex: Fórum XYZ"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>URLs do Site</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddUrl}>
                          <Plus className="h-3 w-3 mr-1" /> Adicionar URL
                        </Button>
                      </div>

                      {siteForm.urls.map((urlObj, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              value={urlObj.url}
                              onChange={(e) => handleUrlChange(index, e.target.value)}
                              placeholder="https://exemplo.com"
                              required={index === 0}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`primary-${index}`}
                                checked={urlObj.is_primary}
                                onCheckedChange={() => handlePrimaryChange(index)}
                              />
                              <Label htmlFor={`primary-${index}`} className="text-xs">
                                Principal
                              </Label>
                            </div>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveUrl(index)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scraper_name">Nome do Scraper</Label>
                      <Input
                        id="scraper_name"
                        value={siteForm.scraper_name}
                        onChange={(e) => setSiteForm({ ...siteForm, scraper_name: e.target.value })}
                        placeholder="Ex: forum_xyz_scraper"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scraper_file">Arquivo do Scraper (Python)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="scraper_file"
                          type="file"
                          accept=".py"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex-1 border rounded-md overflow-hidden">
                          <label
                            htmlFor="scraper_file"
                            className="flex items-center justify-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4" />
                            {selectedFile ? selectedFile.name : "Selecionar arquivo Python (.py)"}
                          </label>
                        </div>
                        {selectedFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFile(null)
                              setSiteForm({ ...siteForm, scraper_file: undefined })
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {fileError && <p className="text-sm text-red-500 mt-1">{fileError}</p>}
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
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 pt-4">
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
                  </TabsContent>
                </Tabs>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Criando..." : "Criar Site"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <Alert className={`mb-6 ${messageType === "error" ? "border-red-500" : "border-green-500"}`}>
            <AlertDescription className="flex items-center gap-2">
              {messageType === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {message}
            </AlertDescription>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>URLs</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {site.urls.map((url, index) => (
                            <div key={index} className="flex items-center gap-1 truncate">
                              {url.is_primary && (
                                <Badge variant="secondary" className="h-4 px-1 text-xs">
                                  Principal
                                </Badge>
                              )}
                              <span className="truncate text-xs">{url.url}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={site.enabled ? "default" : "secondary"}>
                          {site.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{site.scraper_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {site.auth_type === "none" ? "Nenhuma" : site.auth_type === "basic" ? "Basic" : "Formulário"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{site.captcha_type === "none" ? "Nenhum" : site.captcha_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {site.needs_js ? <Badge variant="secondary">Sim</Badge> : <Badge variant="outline">Não</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunScraper(site.id!)}
                            disabled={!site.enabled}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSite(site.id!)}>
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
    </DashboardLayout>
  )
}
