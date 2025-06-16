"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { useTelegramAccounts } from "@/hooks/use-telegram-accounts"
import { Plus, Phone, Hash, Key, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import type { TelegramAccountCreate } from "@/types/site"

export default function TelegramAccountsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { accounts, loading, error, createAccount, updateAccount, deleteAccount, clearError } = useTelegramAccounts()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const [formData, setFormData] = useState<TelegramAccountCreate>({
    api_id: 0,
    api_hash: "",
    phone: "",
    session_string: "",
  })

  // Redirect if not authenticated or not platform admin
  if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
    router.push("/login")
    return null
  }

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "api_id" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      api_id: 0,
      api_hash: "",
      phone: "",
      session_string: "",
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createAccount(formData)
      showMessage("Conta do Telegram criada com sucesso!", "success")
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (err: any) {
      showMessage(err.message, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAccount) return

    setIsSubmitting(true)

    try {
      await updateAccount(editingAccount.id, formData)
      showMessage("Conta do Telegram atualizada com sucesso!", "success")
      setIsEditDialogOpen(false)
      setEditingAccount(null)
      resetForm()
    } catch (err: any) {
      showMessage(err.message, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta conta do Telegram?")) return

    try {
      await deleteAccount(id)
      showMessage("Conta do Telegram excluída com sucesso!", "success")
    } catch (err: any) {
      showMessage(err.message, "error")
    }
  }

  const openEditDialog = (account: any) => {
    setEditingAccount(account)
    setFormData({
      api_id: account.api_id,
      api_hash: account.api_hash,
      phone: account.phone,
      session_string: "", // session_string é write-only
    })
    setIsEditDialogOpen(true)
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-blue-700">Carregando contas do Telegram...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Contas do Telegram</h1>
            <p className="text-blue-600 mt-1">Gerencie as contas do Telegram para scraping</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Criar Conta do Telegram</DialogTitle>
                <DialogDescription>Adicione uma nova conta do Telegram para usar no scraping</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_id">API ID *</Label>
                  <Input
                    id="api_id"
                    name="api_id"
                    type="number"
                    value={formData.api_id || ""}
                    onChange={handleInputChange}
                    placeholder="123456"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_hash">API Hash *</Label>
                  <Input
                    id="api_hash"
                    name="api_hash"
                    value={formData.api_hash}
                    onChange={handleInputChange}
                    placeholder="abcdef123456..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+5511999999999"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_string">Session String (opcional)</Label>
                  <Textarea
                    id="session_string"
                    name="session_string"
                    value={formData.session_string}
                    onChange={handleInputChange}
                    placeholder="String de sessão do Telegram..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Criando...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-900">Conta #{account.id}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(account)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">API ID:</span>
                  <Badge variant="outline" className="text-blue-700">
                    {account.api_id}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">API Hash:</span>
                  <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                    {account.api_hash.substring(0, 8)}...
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Telefone:</span>
                  <span className="text-sm font-medium text-blue-700">{account.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && !loading && (
          <Card className="border-blue-200">
            <CardContent className="text-center py-12">
              <Phone className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">Nenhuma conta encontrada</h3>
              <p className="text-blue-600 mb-4">Crie sua primeira conta do Telegram para começar</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Conta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-900">Editar Conta do Telegram</DialogTitle>
              <DialogDescription>Atualize as informações da conta do Telegram</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_api_id">API ID *</Label>
                <Input
                  id="edit_api_id"
                  name="api_id"
                  type="number"
                  value={formData.api_id || ""}
                  onChange={handleInputChange}
                  placeholder="123456"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_api_hash">API Hash *</Label>
                <Input
                  id="edit_api_hash"
                  name="api_hash"
                  value={formData.api_hash}
                  onChange={handleInputChange}
                  placeholder="abcdef123456..."
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Telefone *</Label>
                <Input
                  id="edit_phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+5511999999999"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_session_string">Session String (opcional)</Label>
                <Textarea
                  id="edit_session_string"
                  name="session_string"
                  value={formData.session_string}
                  onChange={handleInputChange}
                  placeholder="String de sessão do Telegram..."
                  rows={3}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-blue-600">Deixe em branco para manter a session string atual</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingAccount(null)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
