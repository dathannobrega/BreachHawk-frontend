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
import { Users, Plus, Eye, Edit, Trash2, Building, Search, UserCheck, UserX, Crown, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { usePlatformUsers } from "@/hooks/use-platform-users"
import { useCompanies } from "@/hooks/use-companies"
import { platformUserService } from "@/services/platform-user-service"
import type { PlatformUser, PlatformUserCreate } from "@/types/platform-user"

export default function PlatformUsers() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { users, stats, loading, error, createUser, updateUser, deleteUser, updateUserStatus, refetch } =
    usePlatformUsers()
  const { companies } = useCompanies()

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
  const [userForm, setUserForm] = useState<PlatformUserCreate>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
    status: "active",
    company: "",
    job_title: "",
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, user])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter, roleFilter, companyFilter])

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.company || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter((user) => user.company === companyFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (selectedUser) {
        // Editar usuário existente - não incluir password se estiver vazio
        const updateData = { ...userForm }
        if (!updateData.password) {
          delete updateData.password
        }
        await updateUser(selectedUser.id, updateData)
        setMessage("Usuário atualizado com sucesso!")
      } else {
        // Criar novo usuário
        await createUser(userForm)
        setMessage("Usuário criado com sucesso!")
      }

      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar usuário")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setUserForm({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "user",
      status: "active",
      company: "",
      job_title: "",
    })
    setSelectedUser(null)
  }

  const handleEdit = (user: PlatformUser) => {
    setSelectedUser(user)
    setUserForm({
      username: user.username,
      email: user.email,
      password: "", // Não preencher a senha
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      company: user.company,
      job_title: user.job_title,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(userId)
        setMessage("Usuário excluído com sucesso!")
        setTimeout(() => setMessage(""), 3000)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Erro ao excluir usuário")
        setTimeout(() => setMessage(""), 5000)
      }
    }
  }

  const handleStatusChange = async (userId: number, newStatus: "active" | "suspended") => {
    try {
      await updateUserStatus(userId, newStatus)
      setMessage(`Usuário ${newStatus === "active" ? "ativado" : "suspenso"} com sucesso!`)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao atualizar status")
      setTimeout(() => setMessage(""), 5000)
    }
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

  // Get unique companies for filter
  const uniqueCompanies = Array.from(new Set(users.map((user) => user.company).filter(Boolean)))

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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os usuários da plataforma</p>
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
                      <Label htmlFor="first_name">Nome</Label>
                      <Input
                        id="first_name"
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                        placeholder="Nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Sobrenome</Label>
                      <Input
                        id="last_name"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
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
                    <Label htmlFor="password">
                      {selectedUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="••••••••"
                      required={!selectedUser}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={userForm.company}
                        onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                        placeholder="Nome da empresa"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Cargo</Label>
                      <Input
                        id="job_title"
                        value={userForm.job_title}
                        onChange={(e) => setUserForm({ ...userForm, job_title: e.target.value })}
                        placeholder="Cargo do usuário"
                        required
                      />
                    </div>
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
                    <Users className="h-6 w-6 text-blue-600" />
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
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.suspendedUsers}</p>
                    <p className="text-gray-600">Suspensos</p>
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
                    {uniqueCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
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
                        <p className="font-medium">{platformUserService.getFullName(user)}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{user.company}</p>
                          <p className="text-sm text-gray-500">{user.job_title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <Badge variant="outline">{platformUserService.translateRole(user.role)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${platformUserService.getStatusColor(user.status)}`}
                        ></div>
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
                          {platformUserService.translateStatus(user.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{platformUserService.formatDate(user.last_login)}</TableCell>
                    <TableCell>{platformUserService.formatDate(user.created_at)}</TableCell>
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
