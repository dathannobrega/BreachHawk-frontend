"use client"

import type React from "react"
import { useState } from "react"
import { FaUsers, FaGlobe, FaKey, FaExclamationTriangle } from "react-icons/fa"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Table from "@/components/ui/Table"
import { useAuth } from "@/hooks/useAuth"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [period, setPeriod] = useState("week")

  // Dados simulados
  const stats = {
    sites: 42,
    keywords: 156,
    leaks: 8,
    users: 12,
  }

  const recentLeaks = [
    {
      id: 1,
      site: "example.com",
      keyword: "senha123",
      date: "2023-05-15",
      severity: "high",
    },
    {
      id: 2,
      site: "test.org",
      keyword: "api_key",
      date: "2023-05-14",
      severity: "medium",
    },
    {
      id: 3,
      site: "demo.net",
      keyword: "admin",
      date: "2023-05-13",
      severity: "low",
    },
    {
      id: 4,
      site: "sample.io",
      keyword: "password",
      date: "2023-05-12",
      severity: "high",
    },
    {
      id: 5,
      site: "test-site.com",
      keyword: "secret",
      date: "2023-05-11",
      severity: "medium",
    },
  ]

  const recentSites = [
    {
      id: 1,
      url: "example.com",
      status: "active",
      keywords: 12,
      lastScan: "2023-05-15",
    },
    {
      id: 2,
      url: "test.org",
      status: "active",
      keywords: 8,
      lastScan: "2023-05-14",
    },
    {
      id: 3,
      url: "demo.net",
      status: "inactive",
      keywords: 5,
      lastScan: "2023-05-10",
    },
    {
      id: 4,
      url: "sample.io",
      status: "active",
      keywords: 15,
      lastScan: "2023-05-15",
    },
    {
      id: 5,
      url: "test-site.com",
      status: "active",
      keywords: 7,
      lastScan: "2023-05-13",
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="period-selector mt-4 flex space-x-2">
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              period === "day" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("day")}
          >
            Dia
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              period === "week" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("week")}
          >
            Semana
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              period === "month" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("month")}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Sites Monitorados"
          value={stats.sites}
          icon={<FaGlobe className="h-6 w-6 text-blue-500" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Palavras-chave"
          value={stats.keywords}
          icon={<FaKey className="h-6 w-6 text-yellow-500" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Vazamentos Detectados"
          value={stats.leaks}
          icon={<FaExclamationTriangle className="h-6 w-6 text-red-500" />}
          trend="-3%"
          trendUp={false}
        />
        <StatCard
          title="Usuários"
          value={stats.users}
          icon={<FaUsers className="h-6 w-6 text-green-500" />}
          trend="+2%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vazamentos Recentes">
          <Table
            columns={[
              { header: "Site", accessor: "site" },
              { header: "Palavra-chave", accessor: "keyword" },
              { header: "Data", accessor: "date" },
              {
                header: "Severidade",
                accessor: "severity",
                render: (row) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : row.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {row.severity === "high" ? "Alta" : row.severity === "medium" ? "Média" : "Baixa"}
                  </span>
                ),
              },
            ]}
            data={recentLeaks}
            actions={[
              {
                label: "Ver Detalhes",
                onClick: (item) => console.log("Ver detalhes", item),
              },
            ]}
          />
        </Card>

        <Card title="Sites Recentes">
          <Table
            columns={[
              { header: "URL", accessor: "url" },
              {
                header: "Status",
                accessor: "status",
                render: (row) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                ),
              },
              { header: "Palavras-chave", accessor: "keywords" },
              { header: "Última Verificação", accessor: "lastScan" },
            ]}
            data={recentSites}
            actions={[
              {
                label: "Ver Detalhes",
                onClick: (item) => console.log("Ver detalhes", item),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
