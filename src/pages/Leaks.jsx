"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"
import Button from "../components/ui/Button"
import SearchInput from "../components/ui/SearchInput"
import Pagination from "../components/ui/Pagination"
import StatusBadge from "../components/ui/StatusBadge"
import "../styles/pages/leaks.css"

const Leaks = () => {
    const [leaks, setLeaks] = useState([
        {
            id: 1,
            site: "example.com",
            keyword: "senha123",
            source: "forum-hacker.net",
            date: "2023-05-15",
            severity: "high",
            status: "active",
        },
        {
            id: 2,
            site: "test.org",
            keyword: "api_key",
            source: "darkweb-marketplace.onion",
            date: "2023-05-14",
            severity: "medium",
            status: "active",
        },
        {
            id: 3,
            site: "demo.net",
            keyword: "admin",
            source: "pastebin.com",
            date: "2023-05-13",
            severity: "low",
            status: "resolved",
        },
        {
            id: 4,
            site: "sample.io",
            keyword: "password",
            source: "github.com",
            date: "2023-05-12",
            severity: "high",
            status: "active",
        },
        {
            id: 5,
            site: "test-site.com",
            keyword: "secret",
            source: "telegram-channel",
            date: "2023-05-11",
            severity: "medium",
            status: "resolved",
        },
        {
            id: 6,
            site: "another-example.com",
            keyword: "token",
            source: "discord-server",
            date: "2023-05-10",
            severity: "high",
            status: "active",
        },
        {
            id: 7,
            site: "yet-another.org",
            keyword: "private_key",
            source: "reddit.com",
            date: "2023-05-09",
            severity: "medium",
            status: "resolved",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedLeak, setSelectedLeak] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all")
    const [severityFilter, setSeverityFilter] = useState("all")

    // Filtrar vazamentos com base nos filtros
    const filteredLeaks = leaks.filter((leak) => {
        const matchesSearch =
            leak.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leak.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leak.source.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || leak.status === statusFilter
        const matchesSeverity = severityFilter === "all" || leak.severity === severityFilter

        return matchesSearch && matchesStatus && matchesSeverity
    })

    // Calcular paginação
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentLeaks = filteredLeaks.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredLeaks.length / itemsPerPage)

    // Manipuladores de eventos
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value)
        setCurrentPage(1)
    }

    const handleSeverityFilterChange = (e) => {
        setSeverityFilter(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetails = (leak) => {
        setSelectedLeak(leak)
        setShowDetailsModal(true)
    }

    const handleResolve = (leak) => {
        const updatedLeaks = leaks.map((l) => {
            if (l.id === leak.id) {
                return { ...l, status: "resolved" }
            }
            return l
        })
        setLeaks(updatedLeaks)
    }

    const getSeverityLabel = (severity) => {
        switch (severity) {
            case "high":
                return "Alta"
            case "medium":
                return "Média"
            case "low":
                return "Baixa"
            default:
                return severity
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case "active":
                return "Ativo"
            case "resolved":
                return "Resolvido"
            default:
                return status
        }
    }

    return (
        <div className="leaks-container">
            <div className="page-header">
                <h1>Vazamentos Detectados</h1>
            </div>

            <div className="action-bar">
                <div className="filter-container">
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        aria-label="Filtrar por status"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="resolved">Resolvidos</option>
                    </select>
                    <select
                        className="filter-select"
                        value={severityFilter}
                        onChange={handleSeverityFilterChange}
                        aria-label="Filtrar por severidade"
                    >
                        <option value="all">Todas as Severidades</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>
                </div>
                <SearchInput
                    placeholder="Buscar vazamentos..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <Card>
                <Table
                    columns={[
                        { header: "Site", accessor: "site" },
                        { header: "Palavra-chave", accessor: "keyword" },
                        { header: "Fonte", accessor: "source" },
                        { header: "Data", accessor: "date" },
                        {
                            header: "Severidade",
                            accessor: "severity",
                            render: (row) => (
                                <StatusBadge
                                    status={row.severity === "high" ? "danger" : row.severity === "medium" ? "warning" : "info"}
                                    text={getSeverityLabel(row.severity)}
                                />
                            ),
                        },
                        {
                            header: "Status",
                            accessor: "status",
                            render: (row) => (
                                <StatusBadge
                                    status={row.status === "active" ? "danger" : "success"}
                                    text={getStatusLabel(row.status)}
                                />
                            ),
                        },
                    ]}
                    data={currentLeaks}
                    actions={[
                        {
                            label: "Ver Detalhes",
                            onClick: handleViewDetails,
                            icon: <i className="fas fa-eye"></i>,
                        },
                        {
                            label: "Marcar como Resolvido",
                            onClick: handleResolve,
                            icon: <i className="fas fa-check"></i>,
                            disabled: (row) => row.status === "resolved",
                        },
                    ]}
                />

                <div className="pagination-container">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </Card>

            {/* Modal de Detalhes do Vazamento */}
            {selectedLeak && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={`Detalhes do Vazamento - ${selectedLeak.site}`}
                    size="lg"
                >
                    <div className="leak-details">
                        <div className="detail-group">
                            <h4>Informações Gerais</h4>
                            <div className="detail-row">
                                <div className="detail-label">Site:</div>
                                <div className="detail-value">{selectedLeak.site}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Palavra-chave:</div>
                                <div className="detail-value">{selectedLeak.keyword}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Fonte:</div>
                                <div className="detail-value">{selectedLeak.source}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Data de Detecção:</div>
                                <div className="detail-value">{selectedLeak.date}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Severidade:</div>
                                <div className="detail-value">
                                    <StatusBadge
                                        status={
                                            selectedLeak.severity === "high"
                                                ? "danger"
                                                : selectedLeak.severity === "medium"
                                                    ? "warning"
                                                    : "info"
                                        }
                                        text={getSeverityLabel(selectedLeak.severity)}
                                    />
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Status:</div>
                                <div className="detail-value">
                                    <StatusBadge
                                        status={selectedLeak.status === "active" ? "danger" : "success"}
                                        text={getStatusLabel(selectedLeak.status)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h4>Conteúdo do Vazamento</h4>
                            <div className="leak-content">
                <pre>
                  {`Exemplo de conteúdo vazado para ${selectedLeak.keyword} em ${selectedLeak.site}.\nEste é um exemplo simulado para fins de demonstração.\nEm um ambiente real, aqui seria exibido o conteúdo real do vazamento detectado.`}
                </pre>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h4>Ações Recomendadas</h4>
                            <ul className="action-list">
                                <li>Alterar imediatamente todas as senhas relacionadas</li>
                                <li>Verificar se há acessos não autorizados</li>
                                <li>Implementar autenticação de dois fatores</li>
                                <li>Revisar permissões de acesso</li>
                            </ul>
                        </div>
                    </div>

                    <div className="modal-actions">
                        {selectedLeak.status === "active" && (
                            <Button
                                onClick={() => {
                                    handleResolve(selectedLeak)
                                    setShowDetailsModal(false)
                                }}
                            >
                                Marcar como Resolvido
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                            Fechar
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Leaks
