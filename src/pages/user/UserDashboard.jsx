import React from "react"
import { FaSearch, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import "../../styles/pages/user-dashboard.css"

const UserDashboard = () => {
    const { user } = useAuth()

    // Dados simulados
    const stats = {
        searches: 24,
        protectedDomains: 3,
        leaksDetected: 2,
        leaksResolved: 1,
    }

    const recentSearches = [
        {
            id: 1,
            query: "meu-dominio.com.br",
            date: "2023-05-15",
            results: 5,
        },
        {
            id: 2,
            query: "email@empresa.com",
            date: "2023-05-14",
            results: 2,
        },
        {
            id: 3,
            query: "nome da empresa",
            date: "2023-05-12",
            results: 8,
        },
    ]

    const recentLeaks = [
        {
            id: 1,
            source: "forum-hacker.net",
            content: "Credenciais de acesso",
            date: "2023-05-10",
            status: "resolved",
        },
        {
            id: 2,
            source: "darkweb-marketplace.onion",
            content: "Dados de cartão de crédito",
            date: "2023-05-08",
            status: "active",
        },
    ]

    return (
        <div className="user-dashboard">
            <div className="welcome-section">
                <h1>Bem-vindo, {user?.username || "Usuário"}!</h1>
                <p>Aqui está um resumo da sua proteção digital.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaSearch />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.searches}</h3>
                        <p>Pesquisas realizadas</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaShieldAlt />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.protectedDomains}</h3>
                        <p>Domínios protegidos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon alert">
                        <FaExclamationTriangle />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.leaksDetected}</h3>
                        <p>Vazamentos detectados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.leaksResolved}</h3>
                        <p>Vazamentos resolvidos</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Pesquisas Recentes</h2>
                        <a href="/user/search" className="view-all">
                            Ver todas
                        </a>
                    </div>
                    <div className="card-content">
                        {recentSearches.length > 0 ? (
                            <table className="dashboard-table">
                                <thead>
                                <tr>
                                    <th>Consulta</th>
                                    <th>Data</th>
                                    <th>Resultados</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentSearches.map((search) => (
                                    <tr key={search.id}>
                                        <td>{search.query}</td>
                                        <td>{search.date}</td>
                                        <td>{search.results}</td>
                                        <td>
                                            <a href={`/user/search/results?q=${search.query}`} className="btn-link">
                                                Ver detalhes
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="empty-message">Nenhuma pesquisa recente.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Vazamentos Recentes</h2>
                        <a href="/user/leaks" className="view-all">
                            Ver todos
                        </a>
                    </div>
                    <div className="card-content">
                        {recentLeaks.length > 0 ? (
                            <table className="dashboard-table">
                                <thead>
                                <tr>
                                    <th>Fonte</th>
                                    <th>Conteúdo</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentLeaks.map((leak) => (
                                    <tr key={leak.id}>
                                        <td>{leak.source}</td>
                                        <td>{leak.content}</td>
                                        <td>{leak.date}</td>
                                        <td>
                        <span className={`status-badge ${leak.status}`}>
                          {leak.status === "active" ? "Ativo" : "Resolvido"}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="empty-message">Nenhum vazamento recente.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="action-card">
                <div className="action-content">
                    <h2>Proteja mais domínios</h2>
                    <p>
                        Adicione mais domínios e e-mails para monitoramento contínuo e
                        proteção avançada.
                    </p>
                </div>
                <a href="/user/search" className="btn-primary">
                    Nova Pesquisa
                </a>
            </div>
        </div>
    )
}

export default UserDashboard
