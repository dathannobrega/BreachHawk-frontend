"use client"

import type React from "react"
import { useState } from "react"
import { Globe, Key, AlertTriangle, Users } from "lucide-react"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Table from "@/components/ui/Table"

const Dashboard: React.FC = () => {
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              period === "day" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("day")}
          >
            Dia
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              period === "week" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("week")}
          >
            Semana
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              period === "month" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setPeriod("month")}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Sites Monitorados"
          value={stats.sites}
          icon={<Globe className="w-5 h-5" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Palavras-chave"
          value={stats.keywords}
          icon={<Key className="w-5 h-5" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Vazamentos Detectados"
          value={stats.leaks}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend="-3%"
          trendUp={false}
        />
        <StatCard
          title="Usuários"
          value={stats.users}
          icon={<Users className="w-5 h-5" />}
          trend="+2%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vazamentos Recentes">
          <Table
            columns={[
              { key: "site", label: "Site" },
              { key: "keyword", label: "Palavra-chave" },
              { key: "date", label: "Data" },
              {
                key: "severity",
                label: "Severidade",
                render: (value) => {
                  const severityMap = {
                    high: { label: "Alta", status: "danger" },
                    medium: { label: "Média", status: "warning" },
                    low: { label: "Baixa", status: "info" },
                  }
                  const severity = severityMap[value as keyof typeof severityMap]
                  return <span className={`severity ${value}`}>{severity.label}</span>
                },
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
              { key: "url", label: "URL" },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span className={`status ${value}`}>{value === "active" ? "Ativo" : "Inativo"}</span>
                ),
              },
              { key: "keywords", label: "Palavras-chave" },
              { key: "lastScan", label: "Última Verificação" },
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
