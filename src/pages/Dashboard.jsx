import React, { useState } from "react"
import { FaUsers, FaGlobe, FaKey, FaExclamationTriangle } from "react-icons/fa"
import StatCard from "../components/ui/StatCard"
import Card from "../components/ui/Card"
import Table from "../components/ui/Table"
import "../styles/pages/dashboard.css"

const Dashboard = () => {
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
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="period-selector">
                    <button
                        className={period === "day" ? "active" : ""}
                        onClick={() => setPeriod("day")}
                    >
                        Dia
                    </button>
                    <button
                        className={period === "week" ? "active" : ""}
                        onClick={() => setPeriod("week")}
                    >
                        Semana
                    </button>
                    <button
                        className={period === "month" ? "active" : ""}
                        onClick={() => setPeriod("month")}
                    >
                        Mês
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Sites Monitorados"
                    value={stats.sites}
                    icon={<FaGlobe />}
                    trend="+5%"
                    trendUp={true}
                />
                <StatCard
                    title="Palavras-chave"
                    value={stats.keywords}
                    icon={<FaKey />}
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="Vazamentos Detectados"
                    value={stats.leaks}
                    icon={<FaExclamationTriangle />}
                    trend="-3%"
                    trendUp={false}
                />
                <StatCard
                    title="Usuários"
                    value={stats.users}
                    icon={<FaUsers />}
                    trend="+2%"
                    trendUp={true}
                />
            </div>

            <div className="dashboard-content">
                <Card title="Vazamentos Recentes">
                    <Table
                        columns={[
                            { key: "site", label: "Site" },
                            { key: "keyword", label: "Palavra-chave" },
                            { key: "date", label: "Data" },
                            {
                                key: "severity",
                                label: "Severidade",
                                render: (value) => (
                                    <span className={`severity ${value}`}>
                    {value === "high"
                        ? "Alta"
                        : value === "medium"
                            ? "Média"
                            : "Baixa"}
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
                            { key: "url", label: "URL" },
                            {
                                key: "status",
                                label: "Status",
                                render: (value) => (
                                    <span className={`status ${value}`}>
                    {value === "active" ? "Ativo" : "Inativo"}
                  </span>
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
