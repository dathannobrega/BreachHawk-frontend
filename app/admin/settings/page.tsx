"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Users, Palette, Globe, Upload, Trash2, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function AdminSettings() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("company")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Company settings
  const [companySettings, setCompanySettings] = useState({
    name: user?.company?.name || "",
    domain: user?.company?.domain || "",
    logo: user?.company?.logo || "",
    description: "",
    website: "",
    phone: "",
    address: "",
  })

  // Branding settings
  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    logoUrl: "",
    faviconUrl: "",
    customCss: "",
    showBranding: true,
  })

  // Users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "João Silva",
      email: "joao@empresa.com",
      role: "user",
      status: "active",
      lastLogin: "2023-05-15",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-05-14",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@empresa.com",
      role: "user",
      status: "inactive",
      lastLogin: "2023-05-10",
    },
  ])

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "admin") return null

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações da empresa salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Configurações de marca salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const handleUserAction = (userId: number, action: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: action === "activate" ? "active" : action === "deactivate" ? "inactive" : user.status,
            }
          : user,
      ),
    )
    setMessage(`Usuário ${action === "activate" ? "ativado" : "desativado"} com sucesso!`)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações Administrativas</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações da sua empresa e usuários</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Marca
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domínios
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Configure as informações básicas da sua empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input
                        id="companyName"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                        placeholder="Digite o nome da empresa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDomain">Domínio Principal</Label>
                      <Input
                        id="companyDomain"
                        value={companySettings.domain}
                        onChange={(e) => setCompanySettings({ ...companySettings, domain: e.target.value })}
                        placeholder="exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Website</Label>
                      <Input
                        id="companyWebsite"
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                        placeholder="https://www.exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Telefone</Label>
                      <Input
                        id="companyPhone"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Descrição</Label>
                    <Textarea
                      id="companyDescription"
                      value={companySettings.description}
                      onChange={(e) => setCompanySettings({ ...companySettings, description: e.target.value })}
                      placeholder="Descreva sua empresa..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Endereço</Label>
                    <Textarea
                      id="companyAddress"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                      placeholder="Endereço completo da empresa"
                      rows={2}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Personalização da Marca</CardTitle>
                <CardDescription>Customize a aparência da plataforma para sua empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBrandingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL do Logo</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="logoUrl"
                        value={brandingSettings.logoUrl}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, logoUrl: e.target.value })}
                        placeholder="https://exemplo.com/logo.png"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customCss">CSS Personalizado</Label>
                    <Textarea
                      id="customCss"
                      value={brandingSettings.customCss}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, customCss: e.target.value })}
                      placeholder="/* Adicione seu CSS personalizado aqui */"
                      rows={6}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showBranding"
                      checked={brandingSettings.showBranding}
                      onCheckedChange={(checked) => setBrandingSettings({ ...brandingSettings, showBranding: checked })}
                    />
                    <Label htmlFor="showBranding">Mostrar marca da empresa na interface</Label>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Personalização"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>Gerencie os usuários da sua empresa</CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Admin" : "Usuário"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUserAction(user.id, user.status === "active" ? "deactivate" : "activate")
                              }
                            >
                              {user.status === "active" ? "Desativar" : "Ativar"}
                            </Button>
                            <Button size="sm" variant="outline">
                              Editar
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Management */}
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Domínios</CardTitle>
                <CardDescription>Configure os domínios monitorados pela sua empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Adicionar novo domínio (ex: exemplo.com)" className="flex-1" />
                    <Button>Adicionar</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Domínios Monitorados</h4>
                    <div className="space-y-2">
                      {["exemplo.com", "test.org", "demo.net"].map((domain, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{domain}</span>
                            <Badge variant="default">Ativo</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              Configurar
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
