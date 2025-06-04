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
import { Building, Plus, Eye, Edit, Trash2, Users, DollarSign, Calendar, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

interface Company {
  id: number
  name: string
  domain: string
  plan: "trial" | "basic" | "professional" | "enterprise"
  status: "active" | "inactive" | "suspended"
  users: number
  monthlyRevenue: number
  createdAt: string
  lastActivity: string
  contactEmail: string
  contactName: string
}

export default function PlatformCompanies() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Form state
  const [companyForm, setCompanyForm] = useState({
    name: "",
    domain: "",
    contactName: "",
    contactEmail: "",
    plan: "trial" as const,
    status: "active" as const,
  })

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  useEffect(() => {
    if (user?.role === "platform_admin") {
      fetchCompanies()
    }
  }, [user])

  useEffect(() => {
    filterCompanies()
  }, [companies, searchTerm, statusFilter, planFilter])

  const fetchCompanies = async () => {
    // Simular dados das empresas
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: "TechCorp Solutions",
        domain: "techcorp.com",
        plan: "enterprise",
        status: "active",
        users: 45,
        monthlyRevenue: 2500,
        createdAt: "2023-01-15",
        lastActivity: "2023-05-15",
        contactEmail: "admin@techcorp.com",
        contactName: "João Silva",
      },
      {
        id: 2,
        name: "SecureBank Ltd",
        domain: "securebank.com",
        plan: "professional",
        status: "active",
        users: 32,
        monthlyRevenue: 1800,
        createdAt: "2023-02-20",
        lastActivity: "2023-05-14",
        contactEmail: "security@securebank.com",
        contactName: "Maria Santos",
      },
      {
        id: 3,
        name: "DataSafe Inc",
        domain: "datasafe.net",
        plan: "professional",
        status: "active",
        users: 28,
        monthlyRevenue: 1800,
        createdAt: "2023-03-10",
        lastActivity: "2023-05-13",
        contactEmail: "contact@datasafe.net",
        contactName: "Pedro Costa",
      },
      {
        id: 4,
        name: "StartupCo",
        domain: "startup.co",
        plan: "trial",
        status: "active",
        users: 5,
        monthlyRevenue: 0,
        createdAt: "2023-05-01",
        lastActivity: "2023-05-12",
        contactEmail: "founder@startup.co",
        contactName: "Ana Oliveira",
      },
      {
        id: 5,
        name: "OldCorp",
        domain: "oldcorp.com",
        plan: "basic",
        status: "suspended",
        users: 12,
        monthlyRevenue: 0,
        createdAt: "2022-12-01",
        lastActivity: "2023-04-20",
        contactEmail: "admin@oldcorp.com",
        contactName: "Carlos Mendes",
      },
    ]
    setCompanies(mockCompanies)
  }

  const filterCompanies = () => {
    let filtered = companies

    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()),
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
      // Simular criação/edição de empresa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (selectedCompany) {
        // Editar empresa existente
        setCompanies(
          companies.map((company) =>
            company.id === selectedCompany.id
              ? {
                  ...company,
                  ...companyForm,
                }
              : company,
          ),
        )
        setMessage("Empresa atualizada com sucesso!")
      } else {
        // Criar nova empresa
        const newCompany: Company = {
          id: Date.now(),
          ...companyForm,
          users: 0,
          monthlyRevenue: 0,
          createdAt: new Date().toISOString().split("T")[0],
          lastActivity: new Date().toISOString().split("T")[0],
        }
        setCompanies([...companies, newCompany])
        setMessage("Empresa criada com sucesso!")
      }

      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar empresa")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setCompanyForm({
      name: "",
      domain: "",
      contactName: "",
      contactEmail: "",
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
      contactName: company.contactName,
      contactEmail: company.contactEmail,
      plan: company.plan,
      status: company.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (companyId: number) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      setCompanies(companies.filter((company) => company.id !== companyId))
      setMessage("Empresa excluída com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-500"
      case "professional":
        return "bg-blue-500"
      case "basic":
        return "bg-green-500"
      case "trial":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
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
                    <Label htmlFor="contactName">Nome do Contato</Label>
                    <Input
                      id="contactName"
                      value={companyForm.contactName}
                      onChange={(e) => setCompanyForm({ ...companyForm, contactName: e.target.value })}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email do Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={companyForm.contactEmail}
                      onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
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
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
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

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.reduce((acc, company) => acc + company.users, 0)}
                  </p>
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
                    {formatCurrency(companies.reduce((acc, company) => acc + company.monthlyRevenue, 0))}
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
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.filter((c) => c.plan === "trial").length}
                  </p>
                  <p className="text-gray-600">Em Trial</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
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
                  <TableHead>Usuários</TableHead>
                  <TableHead>Receita</TableHead>
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
                        <p className="font-medium">{company.contactName}</p>
                        <p className="text-sm text-gray-500">{company.contactEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPlanColor(company.plan)}`}></div>
                        <Badge variant="outline" className="capitalize">
                          {company.plan}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)}`}></div>
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
                          {company.status === "active"
                            ? "Ativo"
                            : company.status === "suspended"
                              ? "Suspenso"
                              : "Inativo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{company.users}</TableCell>
                    <TableCell>{formatCurrency(company.monthlyRevenue)}</TableCell>
                    <TableCell>{new Date(company.createdAt).toLocaleDateString("pt-BR")}</TableCell>
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
