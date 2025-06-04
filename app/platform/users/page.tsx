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
import { Users, Plus, Eye, Edit, Trash2, Building, Search, UserCheck, UserX, Crown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

interface PlatformUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin" | "platform_admin"
  status: "active" | "inactive" | "suspended"
  company: {
    id: number
    name: string
    domain: string
  }
  lastLogin: string
  createdAt: string
}

export default function PlatformUsers() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Form state
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "user" as const,
    status: "active" as const,
    companyId: "",
  })

  // Mock companies for dropdown
  const companies = [
    { id: 1, name: "TechCorp Solutions", domain: "techcorp.com" },
    { id: 2, name: "SecureBank Ltd", domain: "securebank.com" },
    { id: 3, name: "DataSafe Inc", domain: "datasafe.net" },
    { id: 4, name: "StartupCo", domain: "startup.co" },
  ]

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  useEffect(() => {
    if (user?.role === "platform_admin") {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter, roleFilter, companyFilter])

  const fetchUsers = async () => {
    // Simular dados dos usuários
    const mockUsers: PlatformUser[] = [
      {
        id: 1,
        username: "joao.silva",
        email: "joao@techcorp.com",
        firstName: "João",
        lastName: "Silva",
        role: "admin",
        status: "active",
        company: { id: 1, name: "TechCorp Solutions", domain: "techcorp.com" },
        lastLogin: "2023-05-15T10:30:00Z",
        createdAt: "2023-01-15T09:00:00Z",
      },
      {
        id: 2,
        username: "maria.santos",
        email: "maria@securebank.com",
        firstName: "Maria",
        lastName: "Santos",
        role: "admin",
        status: "active",
        company: { id: 2, name: "SecureBank Ltd", domain: "securebank.com" },
        lastLogin: "2023-05-14T16:45:00Z",
        createdAt: "2023-02-20T14:30:00Z",
      },
      {
        id: 3,
        username: "pedro.costa",
        email: "pedro@datasafe.net",
        firstName: "Pedro",
        lastName: "Costa",
        role: "user",
        status: "active",
        company: { id: 3, name: "DataSafe Inc", domain: "datasafe.net" },
        lastLogin: "2023-05-13T08:15:00Z",
        createdAt: "2023-03-10T11:20:00Z",
      },
      {
        id: 4,
        username: "ana.oliveira",
        email: "ana@startup.co",
        firstName: "Ana",
        lastName: "Oliveira",
        role: "user",
        status: "active",
        company: { id: 4, name: "StartupCo", domain: "startup.co" },
        lastLogin: "2023-05-12T13:20:00Z",
        createdAt: "2023-05-01T10:00:00Z",
      },
      {
        id: 5,
        username: "carlos.mendes",
        email: "carlos@techcorp.com",
        firstName: "Carlos",
        lastName: "Mendes",
        role: "user",
        status: "suspended",
        company: { id: 1, name: "TechCorp Solutions", domain: "techcorp.com" },
        lastLogin: "2023-04-20T09:30:00Z",
        createdAt: "2023-01-20T15:45:00Z",
      },
    ]
    setUsers(mockUsers)
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter((user) => user.company.id.toString() === companyFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simular criação/edição de usuário
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedCompany = companies.find((c) => c.id.toString() === userForm.companyId)

      if (selectedUser) {
        // Editar usuário existente
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  ...userForm,
                  company: selectedCompany || user.company,
                }
              : user,
          ),
        )
        setMessage("Usuário atualizado com sucesso!")
      } else {
        // Criar novo usuário
        const newUser: PlatformUser = {
          id: Date.now(),
          ...userForm,
          company: selectedCompany || companies[0],
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
        setUsers([...users, newUser])
        setMessage("Usuário criado com sucesso!")
      }

      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao salvar usuário")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setUserForm({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "user",
      status: "active",
      companyId: "",
    })
    setSelectedUser(null)
  }

  const handleEdit = (user: PlatformUser) => {
    setSelectedUser(user)
    setUserForm({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      companyId: user.company.id.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter((user) => user.id !== userId))
      setMessage("Usuário excluído com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleStatusChange = async (userId: number, newStatus: "active" | "suspended") => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: newStatus,
            }
          : user,
      ),
    )
    setMessage(`Usuário ${newStatus === "active" ? "ativado" : "suspenso"} com sucesso!`)
    setTimeout(() => setMessage(""), 3000)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "platform_admin":
        return <Crown className="h-4 w-4 text-purple-500" />
      case "admin":
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case "user":
        return <Users className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "platform_admin":
        return "Platform Admin"
      case "admin":
        return "Admin"
      case "user":
        return "Usuário"
      default:
        return role
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os usuários da plataforma</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{selectedUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                <DialogDescription>
                  {selectedUser ? "Edite as informações do usuário" : "Adicione um novo usuário à plataforma"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={userForm.firstName}
                      onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                      placeholder="Nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={userForm.lastName}
                      onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                      placeholder="Sobrenome"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="nome.usuario"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="usuario@empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Select
                    value={userForm.companyId}
                    onValueChange={(value) => setUserForm({ ...userForm, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Select
                      value={userForm.role}
                      onValueChange={(value: any) => setUserForm({ ...userForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="platform_admin">Platform Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={userForm.status}
                      onValueChange={(value: any) => setUserForm({ ...userForm, status: value })}
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
                    {saving ? "Salvando..." : selectedUser ? "Atualizar" : "Criar"}
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
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-gray-600">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                  <p className="text-gray-600">Usuários Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.role === "admin").length}</p>
                  <p className="text-gray-600">Administradores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.status === "suspended").length}
                  </p>
                  <p className="text-gray-600">Suspensos</p>
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
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>Todos os usuários cadastrados na plataforma</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuários..."
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
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="platform_admin">Platform Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Empresas</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{user.company.name}</p>
                          <p className="text-sm text-gray-500">{user.company.domain}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "suspended"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {user.status === "active" ? "Ativo" : user.status === "suspended" ? "Suspenso" : "Inativo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/platform/users/${user.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(user.id, "suspended")}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(user.id, "active")}>
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
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
