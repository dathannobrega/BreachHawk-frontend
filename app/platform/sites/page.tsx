"use client"

import type React from "react"

import { Plus, Trash2, Globe } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createSite, deleteSite, getSites, updateSite } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Paginator } from "@/components/paginator"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import type { SiteCreate, SiteRead, SiteUpdate, AuthType, CaptchaType, SiteType } from "@/types/site"

const ITEMS_PER_PAGE = 10

function SitesPage() {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<SiteRead | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingSiteId, setDeletingSiteId] = useState<number | null>(null)
  const [formData, setFormData] = useState<SiteCreate>({
    name: "",
    links: [{ url: "" }], // Inicializar com pelo menos um link
    type: "website" as SiteType,
    auth_type: "none" as AuthType,
    captcha_type: "none" as CaptchaType,
    scraper: "generic",
    needs_js: false,
    enabled: true,
    bypass_config: null,
    credentials: null,
    telegram_account: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data: sitesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sites", page],
    queryFn: () => getSites(page, ITEMS_PER_PAGE),
  })

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { url: "" }],
    }))
  }

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const updateLink = (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, url } : link)),
    }))
  }

  const openEditDialog = (site: SiteRead) => {
    setEditingSite(site)
    setFormData({
      name: site.name,
      links: site.links.length > 0 ? site.links : [{ url: "" }],
      type: site.type,
      auth_type: site.auth_type,
      captcha_type: site.captcha_type,
      scraper: site.scraper,
      needs_js: site.needs_js,
      enabled: site.enabled,
      bypass_config: site.bypass_config,
      credentials: site.credentials,
      telegram_account: site.telegram_account,
    })
    setIsEditDialogOpen(true)
  }

  const createSiteMutation = useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] })
      toast({
        title: "Sucesso",
        description: "Site criado com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Houve um erro ao criar o site.",
      })
    },
  })

  const updateSiteMutation = useMutation({
    mutationFn: updateSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] })
      toast({
        title: "Sucesso",
        description: "Site atualizado com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Houve um erro ao atualizar o site.",
      })
    },
  })

  const deleteSiteMutation = useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] })
      toast({
        title: "Sucesso",
        description: "Site excluído com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Houve um erro ao excluir o site.",
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (editingSite) {
      await updateSiteMutation.mutateAsync({ id: editingSite.id, data: formData as SiteUpdate })
    } else {
      await createSiteMutation.mutateAsync(formData)
    }

    setIsSubmitting(false)
    setIsEditDialogOpen(false)
  }

  const handleOpenDeleteDialog = (id: number) => {
    setDeletingSiteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingSiteId) {
      await deleteSiteMutation.mutateAsync(deletingSiteId)
      setIsDeleteDialogOpen(false)
      setDeletingSiteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sites</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar Site</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Site</DialogTitle>
              <DialogDescription>Crie um novo site para monitoramento.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>URLs *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLink} disabled={isSubmitting}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar URL
                  </Button>
                </div>
                {formData.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, e.target.value)}
                      placeholder="https://exemplo.com"
                      required
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    {formData.links.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLink(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo *
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, type: value as SiteType })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auth_type" className="text-right">
                  Autenticação
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, auth_type: value as AuthType })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="bearer">Bearer</SelectItem>
                    <SelectItem value="oauth2">OAuth2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="captcha_type" className="text-right">
                  Captcha
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, captcha_type: value as CaptchaType })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="recaptcha_v2">reCAPTCHA v2</SelectItem>
                    <SelectItem value="recaptcha_v3">reCAPTCHA v3</SelectItem>
                    <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scraper" className="text-right">
                  Scraper
                </Label>
                <Input
                  id="scraper"
                  value={formData.scraper}
                  onChange={(e) => setFormData({ ...formData, scraper: e.target.value })}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="needs_js" className="text-right">
                  Precisa de JS
                </Label>
                <Switch
                  id="needs_js"
                  checked={formData.needs_js}
                  onCheckedChange={(checked) => setFormData({ ...formData, needs_js: checked })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enabled" className="text-right">
                  Ativo
                </Label>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bypass_config" className="text-right">
                  Configuração de Bypass
                </Label>
                <Textarea
                  id="bypass_config"
                  value={formData.bypass_config || ""}
                  onChange={(e) => setFormData({ ...formData, bypass_config: e.target.value })}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credentials" className="text-right">
                  Credenciais
                </Label>
                <Textarea
                  id="credentials"
                  value={formData.credentials || ""}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telegram_account" className="text-right">
                  Conta Telegram
                </Label>
                <Input
                  id="telegram_account"
                  value={formData.telegram_account || ""}
                  onChange={(e) => setFormData({ ...formData, telegram_account: e.target.value })}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>Uma lista dos seus sites.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          {isError && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Erro ao carregar os sites.
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            sitesData?.results.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.type}</TableCell>
                <TableCell>{site.enabled ? "Ativo" : "Inativo"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">URLs:</span>
                    <div className="flex flex-col gap-1">
                      {site.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {link.url}
                        </a>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(site)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(site.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              {sitesData && (
                <Paginator
                  page={page}
                  totalItems={sitesData.count}
                  itemsPerPage={ITEMS_PER_PAGE}
                  url="/platform/sites"
                />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSite ? "Editar Site" : "Adicionar Site"}</DialogTitle>
            <DialogDescription>
              {editingSite ? "Edite os detalhes do site." : "Crie um novo site para monitoramento."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>URLs *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLink} disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar URL
                </Button>
              </div>
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="https://exemplo.com"
                    required
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  {formData.links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLink(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo *
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, type: value as SiteType })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="auth_type" className="text-right">
                Autenticação
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, auth_type: value as AuthType })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="bearer">Bearer</SelectItem>
                  <SelectItem value="oauth2">OAuth2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captcha_type" className="text-right">
                Captcha
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, captcha_type: value as CaptchaType })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="recaptcha_v2">reCAPTCHA v2</SelectItem>
                  <SelectItem value="recaptcha_v3">reCAPTCHA v3</SelectItem>
                  <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scraper" className="text-right">
                Scraper
              </Label>
              <Input
                id="scraper"
                value={formData.scraper}
                onChange={(e) => setFormData({ ...formData, scraper: e.target.value })}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="needs_js" className="text-right">
                Precisa de JS
              </Label>
              <Switch
                id="needs_js"
                checked={formData.needs_js}
                onCheckedChange={(checked) => setFormData({ ...formData, needs_js: checked })}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enabled" className="text-right">
                Ativo
              </Label>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bypass_config" className="text-right">
                Configuração de Bypass
              </Label>
              <Textarea
                id="bypass_config"
                value={formData.bypass_config || ""}
                onChange={(e) => setFormData({ ...formData, bypass_config: e.target.value })}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credentials" className="text-right">
                Credenciais
              </Label>
              <Textarea
                id="credentials"
                value={formData.credentials || ""}
                onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telegram_account" className="text-right">
                Conta Telegram
              </Label>
              <Input
                id="telegram_account"
                value={formData.telegram_account || ""}
                onChange={(e) => setFormData({ ...formData, telegram_account: e.target.value })}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Site</DialogTitle>
            <DialogDescription>Tem certeza de que deseja excluir este site?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SitesPage
