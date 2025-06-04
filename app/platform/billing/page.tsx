"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Building,
  Search,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

interface Invoice {
  id: number
  companyId: number
  companyName: string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled"
  dueDate: string
  paidDate?: string
  plan: string
  period: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
}

interface Payment {
  id: number
  companyId: number
  companyName: string
  amount: number
  method: "credit_card" | "bank_transfer" | "pix"
  status: "completed" | "processing" | "failed"
  date: string
  invoiceId: number
}

interface Subscription {
  id: number
  companyId: number
  companyName: string
  plan: "trial" | "basic" | "professional" | "enterprise"
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate: string
  monthlyAmount: number
  nextBilling: string
}

export default function PlatformBilling() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("month")

  // Mock data
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      companyId: 1,
      companyName: "TechCorp Solutions",
      amount: 2500,
      status: "paid",
      dueDate: "2023-05-15",
      paidDate: "2023-05-14",
      plan: "Enterprise",
      period: "2023-05",
      items: [{ description: "Plano Enterprise - Maio 2023", quantity: 1, unitPrice: 2500, total: 2500 }],
    },
    {
      id: 2,
      companyId: 2,
      companyName: "SecureBank Ltd",
      amount: 1800,
      status: "paid",
      dueDate: "2023-05-20",
      paidDate: "2023-05-19",
      plan: "Professional",
      period: "2023-05",
      items: [{ description: "Plano Professional - Maio 2023", quantity: 1, unitPrice: 1800, total: 1800 }],
    },
    {
      id: 3,
      companyId: 3,
      companyName: "DataSafe Inc",
      amount: 1800,
      status: "pending",
      dueDate: "2023-05-25",
      plan: "Professional",
      period: "2023-05",
      items: [{ description: "Plano Professional - Maio 2023", quantity: 1, unitPrice: 1800, total: 1800 }],
    },
    {
      id: 4,
      companyId: 5,
      companyName: "OldCorp",
      amount: 999,
      status: "overdue",
      dueDate: "2023-04-15",
      plan: "Basic",
      period: "2023-04",
      items: [{ description: "Plano Basic - Abril 2023", quantity: 1, unitPrice: 999, total: 999 }],
    },
  ])

  const [payments] = useState<Payment[]>([
    {
      id: 1,
      companyId: 1,
      companyName: "TechCorp Solutions",
      amount: 2500,
      method: "credit_card",
      status: "completed",
      date: "2023-05-14T10:30:00Z",
      invoiceId: 1,
    },
    {
      id: 2,
      companyId: 2,
      companyName: "SecureBank Ltd",
      amount: 1800,
      method: "bank_transfer",
      status: "completed",
      date: "2023-05-19T14:20:00Z",
      invoiceId: 2,
    },
    {
      id: 3,
      companyId: 4,
      companyName: "StartupCo",
      amount: 299,
      method: "pix",
      status: "processing",
      date: "2023-05-20T09:15:00Z",
      invoiceId: 5,
    },
  ])

  const [subscriptions] = useState<Subscription[]>([
    {
      id: 1,
      companyId: 1,
      companyName: "TechCorp Solutions",
      plan: "enterprise",
      status: "active",
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      monthlyAmount: 2500,
      nextBilling: "2023-06-15",
    },
    {
      id: 2,
      companyId: 2,
      companyName: "SecureBank Ltd",
      plan: "professional",
      status: "active",
      startDate: "2023-02-20",
      endDate: "2024-02-20",
      monthlyAmount: 1800,
      nextBilling: "2023-06-20",
    },
    {
      id: 3,
      companyId: 3,
      companyName: "DataSafe Inc",
      plan: "professional",
      status: "active",
      startDate: "2023-03-10",
      endDate: "2024-03-10",
      monthlyAmount: 1800,
      nextBilling: "2023-06-10",
    },
    {
      id: 4,
      companyId: 4,
      companyName: "StartupCo",
      plan: "trial",
      status: "active",
      startDate: "2023-05-01",
      endDate: "2023-06-01",
      monthlyAmount: 0,
      nextBilling: "2023-06-01",
    },
  ])

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "platform_admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "platform_admin") return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
      case "expired":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago"
      case "pending":
        return "Pendente"
      case "overdue":
        return "Vencido"
      case "cancelled":
        return "Cancelado"
      case "completed":
        return "Concluído"
      case "processing":
        return "Processando"
      case "failed":
        return "Falhou"
      case "active":
        return "Ativo"
      case "expired":
        return "Expirado"
      default:
        return status
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "bank_transfer":
        return "Transferência Bancária"
      case "pix":
        return "PIX"
      default:
        return method
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

  // Calculate stats
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((acc, payment) => acc + payment.amount, 0)
  const pendingAmount = invoices.filter((i) => i.status === "pending").reduce((acc, invoice) => acc + invoice.amount, 0)
  const overdueAmount = invoices.filter((i) => i.status === "overdue").reduce((acc, invoice) => acc + invoice.amount, 0)
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financeiro e Faturamento</h1>
          <p className="text-gray-600 mt-2">Gerencie pagamentos, faturas e assinaturas da plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  <p className="text-gray-600">Receita Total</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
                  <p className="text-gray-600">Pendente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(overdueAmount)}</p>
                  <p className="text-gray-600">Em Atraso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
                  <p className="text-gray-600">Assinaturas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices */}
              <Card>
                <CardHeader>
                  <CardTitle>Faturas Recentes</CardTitle>
                  <CardDescription>Últimas faturas emitidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(invoice.status)}
                          <div>
                            <p className="font-medium">{invoice.companyName}</p>
                            <p className="text-sm text-gray-500">
                              {invoice.plan} - {invoice.period}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                          <p className="text-sm text-gray-500">{getStatusLabel(invoice.status)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos Recentes</CardTitle>
                  <CardDescription>Últimos pagamentos recebidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium">{payment.companyName}</p>
                            <p className="text-sm text-gray-500">{getPaymentMethodLabel(payment.method)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Faturas</CardTitle>
                    <CardDescription>Gerencie todas as faturas da plataforma</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar faturas..."
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
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="overdue">Vencido</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices
                      .filter((invoice) => {
                        if (statusFilter !== "all" && invoice.status !== statusFilter) return false
                        if (searchTerm && !invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                          return false
                        return true
                      })
                      .map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">#{invoice.id.toString().padStart(6, "0")}</p>
                              <p className="text-sm text-gray-500">{invoice.period}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span>{invoice.companyName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{invoice.plan}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(invoice.status)}
                              <Badge
                                variant={
                                  invoice.status === "paid"
                                    ? "default"
                                    : invoice.status === "overdue"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {getStatusLabel(invoice.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
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

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pagamentos</CardTitle>
                    <CardDescription>Histórico de todos os pagamentos</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar pagamentos..."
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
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Fatura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .filter((payment) => {
                        if (statusFilter !== "all" && payment.status !== statusFilter) return false
                        if (searchTerm && !payment.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                          return false
                        return true
                      })
                      .map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <span className="font-mono">#{payment.id.toString().padStart(6, "0")}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span>{payment.companyName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getPaymentMethodLabel(payment.method)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(payment.status)}
                              <Badge
                                variant={
                                  payment.status === "completed"
                                    ? "default"
                                    : payment.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {getStatusLabel(payment.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              #{payment.invoiceId.toString().padStart(6, "0")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assinaturas</CardTitle>
                    <CardDescription>Gerencie todas as assinaturas ativas</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar assinaturas..."
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
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
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
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor Mensal</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Próximo Faturamento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions
                      .filter((subscription) => {
                        if (statusFilter !== "all" && subscription.status !== statusFilter) return false
                        if (searchTerm && !subscription.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                          return false
                        return true
                      })
                      .map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span>{subscription.companyName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getPlanColor(subscription.plan)}`}></div>
                              <Badge variant="outline" className="capitalize">
                                {subscription.plan}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(subscription.status)}
                              <Badge
                                variant={
                                  subscription.status === "active"
                                    ? "default"
                                    : subscription.status === "expired"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {getStatusLabel(subscription.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {subscription.monthlyAmount > 0 ? formatCurrency(subscription.monthlyAmount) : "Grátis"}
                          </TableCell>
                          <TableCell>{new Date(subscription.startDate).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>{new Date(subscription.nextBilling).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
