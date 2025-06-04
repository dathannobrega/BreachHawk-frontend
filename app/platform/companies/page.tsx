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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Plus, Eye, Edit, Trash2, Users, DollarSign, Calendar, Search, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { useCompanies } from "@/hooks/use-companies"
import { companyService } from "@/services/company-service"
import type { Company, CompanyCreate } from "@/types/company"

export default function PlatformCompanies() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { companies, stats, loading, error, createCompany, updateCompany, deleteCompany, refetch } = useCompanies()

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Form state
  const [companyForm, setCompanyForm] = useState<CompanyCreate>({
    name: "",
    domain: "",
    contact_name: "",
    contact_email: "",
    plan: "trial",
    status: "active",
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user])

  useEffect(() => {
    filterCompanies()
  }, [companies, searchTerm, statusFilter, planFilter])

  const filterCompanies = () => {
    let filtered = companies

    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.contact_email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((company) => company.status === statusFilter)
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((company) => company.plan === planFilter)
    }

    setFilteredCompanies(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (selectedCompany) {
        // Editar empresa existente
        await updateCompany(selectedCompany.id, companyForm)
        setMessage("Empresa atualizada com sucesso!")
      } else {
        // Criar nova empresa
        await createCompany(companyForm)
        setMessage("Empresa criada com sucesso!")
      }

      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar empresa")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setCompanyForm({
      name: "",
      domain: "",
      contact_name: "",
      contact_email: "",
      plan: "trial",
      status: "active",
    })
    setSelectedCompany(null)
  }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setCompanyForm({
      name: company.name,
      domain: company.domain,
      contact_name: company.contact_name,
      contact_email: company.contact_email,
      plan: company.plan,
      status: company.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (companyId: number) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await deleteCompany(companyId)
        setMessage("Empresa excluída com sucesso!")
        setTimeout(() => setMessage(""), 3000)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Erro ao excluir empresa")
        setTimeout(() => setMessage(""), 5000)
      }
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "platform_admin") return null

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Empresas</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as empresas da plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{selectedCompany ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
                  <DialogDescription>
                    {selectedCompany ? "Edite as informações da empresa" : "Adicione uma nova empresa à plataforma"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Empresa</Label>
                      <Input
                        id="name"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        placeholder="Nome da empresa"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domínio</Label>
                      <Input
                        id="domain"
                        value={companyForm.domain}
                        onChange={(e) => setCompanyForm({ ...companyForm, domain: e.target.value })}
                        placeholder="empresa.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Nome do Contato</Label>
                      <Input
                        id="contact_name"
                        value={companyForm.contact_name}
                        onChange={(e) => setCompanyForm({ ...companyForm, contact_name: e.target.value })}
                        placeholder="Nome do responsável"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email do Contato</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={companyForm.contact_email}
                        onChange={(e) => setCompanyForm({ ...companyForm, contact_email: e.target.value })}
                        placeholder="contato@empresa.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plano</Label>
                      <Select
                        value={companyForm.plan}
                        onValueChange={(value: any) => setCompanyForm({ ...companyForm, plan: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={companyForm.status}
                        onValueChange={(value: any) => setCompanyForm({ ...companyForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="suspended">Suspenso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Salvando..." : selectedCompany ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {message && !error && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                    <p className="text-gray-600">Total de Empresas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-gray-600">Total de Usuários</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {companyService.formatCurrency(stats.monthlyRevenue)}
                    </p>
                    <p className="text-gray-600">Receita Mensal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.trialCompanies}</p>
                    <p className="text-gray-600">Em Trial</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Empresas</CardTitle>
                <CardDescription>Todas as empresas cadastradas na plataforma</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar empresas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.domain}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.contact_name}</p>
                        <p className="text-sm text-gray-500">{company.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${companyService.getPlanColor(company.plan)}`}></div>
                        <Badge variant="outline" className="capitalize">
                          {companyService.translatePlan(company.plan)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${companyService.getStatusColor(company.status)}`}></div>
                        <Badge
                          variant={
                            company.status === "active"
                              ? "default"
                              : company.status === "suspended"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {companyService.translateStatus(company.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{companyService.formatDate(company.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/platform/companies/${company.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(company.id)}>
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
      </div>
    </DashboardLayout>
  )
}
