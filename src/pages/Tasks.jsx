"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"
import Button from "../components/ui/Button"
import SearchInput from "../components/ui/SearchInput"
import Pagination from "../components/ui/Pagination"
import StatusBadge from "../components/ui/StatusBadge"
import "../styles/pages/tasks.css"

const Tasks = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            type: "captcha",
            site: "forum-hacker.net",
            status: "pending",
            created: "2023-05-15 14:30",
            priority: "high",
        },
        {
            id: 2,
            type: "login",
            site: "darkweb-marketplace.onion",
            status: "completed",
            created: "2023-05-14 10:15",
            priority: "medium",
        },
        {
            id: 3,
            type: "verification",
            site: "pastebin.com",
            status: "failed",
            created: "2023-05-13 08:45",
            priority: "low",
        },
        {
            id: 4,
            type: "captcha",
            site: "github.com",
            status: "pending",
            created: "2023-05-12 16:20",
            priority: "high",
        },
        {
            id: 5,
            type: "login",
            site: "telegram-channel",
            status: "completed",
            created: "2023-05-11 11:30",
            priority: "medium",
        },
        {
            id: 6,
            type: "verification",
            site: "discord-server",
            status: "pending",
            created: "2023-05-10 09:15",
            priority: "high",
        },
        {
            id: 7,
            type: "captcha",
            site: "reddit.com",
            status: "failed",
            created: "2023-05-09 13:45",
            priority: "low",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    // Filtrar tarefas com base nos filtros
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.type.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesType = typeFilter === "all" || task.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    // Calcular paginação
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)

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

    const handleTypeFilterChange = (e) => {
        setTypeFilter(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetails = (task) => {
        setSelectedTask(task)
        setShowDetailsModal(true)
    }

    const handleCompleteTask = (task) => {
        const updatedTasks = tasks.map((t) => {
            if (t.id === task.id) {
                return { ...t, status: "completed" }
            }
            return t
        })
        setTasks(updatedTasks)
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "Pendente"
            case "completed":
                return "Concluída"
            case "failed":
                return "Falhou"
            default:
                return status
        }
    }

    const getTypeLabel = (type) => {
        switch (type) {
            case "captcha":
                return "Resolução de Captcha"
            case "login":
                return "Autenticação"
            case "verification":
                return "Verificação"
            default:
                return type
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "high":
                return "Alta"
            case "medium":
                return "Média"
            case "low":
                return "Baixa"
            default:
                return priority
        }
    }

    return (
        <div className="tasks-container">
            <div className="page-header">
                <h1>Tarefas</h1>
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
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídas</option>
                        <option value="failed">Falhas</option>
                    </select>
                    <select
                        className="filter-select"
                        value={typeFilter}
                        onChange={handleTypeFilterChange}
                        aria-label="Filtrar por tipo"
                    >
                        <option value="all">Todos os Tipos</option>
                        <option value="captcha">Resolução de Captcha</option>
                        <option value="login">Autenticação</option>
                        <option value="verification">Verificação</option>
                    </select>
                </div>
                <SearchInput
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <Card>
                <Table
                    columns={[
                        { header: "ID", accessor: "id" },
                        {
                            header: "Tipo",
                            accessor: "type",
                            render: (row) => getTypeLabel(row.type),
                        },
                        { header: "Site", accessor: "site" },
                        {
                            header: "Prioridade",
                            accessor: "priority",
                            render: (row) => (
                                <StatusBadge
                                    status={row.priority === "high" ? "danger" : row.priority === "medium" ? "warning" : "info"}
                                    text={getPriorityLabel(row.priority)}
                                />
                            ),
                        },
                        { header: "Criada em", accessor: "created" },
                        {
                            header: "Status",
                            accessor: "status",
                            render: (row) => (
                                <StatusBadge
                                    status={
                                        row.status === "pending"
                                            ? "warning"
                                            : row.status === "completed"
                                                ? "success"
                                                : "danger"
                                    }
                                    text={getStatusLabel(row.status)}
                                />
                            ),
                        },
                    ]}
                    data={currentTasks}
                    actions={[
                        {
                            label: "Ver Detalhes",
                            onClick: handleViewDetails,
                            icon: <i className="fas fa-eye"></i>,
                        },
                        {
                            label: "Marcar como Concluída",
                            onClick: handleCompleteTask,
                            icon: <i className="fas fa-check"></i>,
                            disabled: (row) => row.status !== "pending",
                        },
                    ]}
                />

                <div className="pagination-container">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </Card>

            {/* Modal de Detalhes da Tarefa */}
            {selectedTask && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={`Detalhes da Tarefa - ${getTypeLabel(selectedTask.type)}`}
                    size="lg"
                >
                    <div className="task-details">
                        <div className="detail-group">
                            <h4>Informações Gerais</h4>
                            <div className="detail-row">
                                <div className="detail-label">ID:</div>
                                <div className="detail-value">{selectedTask.id}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Tipo:</div>
                                <div className="detail-value">{getTypeLabel(selectedTask.type)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Site:</div>
                                <div className="detail-value">{selectedTask.site}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Criada em:</div>
                                <div className="detail-value">{selectedTask.created}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Prioridade:</div>
                                <div className="detail-value">
                                    <StatusBadge
                                        status={
                                            selectedTask.priority === "high"
                                                ? "danger"
                                                : selectedTask.priority === "medium"
                                                    ? "warning"
                                                    : "info"
                                        }
                                        text={getPriorityLabel(selectedTask.priority)}
                                    />
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Status:</div>
                                <div className="detail-value">
                                    <StatusBadge
                                        status={
                                            selectedTask.status === "pending"
                                                ? "warning"
                                                : selectedTask.status === "completed"
                                                    ? "success"
                                                    : "danger"
                                        }
                                        text={getStatusLabel(selectedTask.status)}
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedTask.type === "captcha" && (
                            <div className="detail-group">
                                <h4>Captcha</h4>
                                <div className="captcha-preview">
                                    <p>Imagem do Captcha:</p>
                                    <img
                                        src="/placeholder.svg?height=100&width=300"
                                        alt="Captcha"
                                        className="captcha-image"
                                    />
                                    {selectedTask.status === "pending" && (
                                        <div className="form-group">
                                            <label htmlFor="captcha-solution">Solução:</label>
                                            <input type="text" id="captcha-solution" placeholder="Digite a solução do captcha" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedTask.type === "login" && (
                            <div className="detail-group">
                                <h4>Informações de Login</h4>
                                <div className="detail-row">
                                    <div className="detail-label">Usuário:</div>
                                    <div className="detail-value">usuario_teste</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Senha:</div>
                                    <div className="detail-value">••••••••</div>
                                </div>
                                {selectedTask.status === "failed" && (
                                    <div className="error-message">
                                        Falha na autenticação. Credenciais inválidas ou expiradas.
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedTask.type === "verification" && (
                            <div className="detail-group">
                                <h4>Verificação</h4>
                                <div className="detail-row">
                                    <div className="detail-label">Tipo de Verificação:</div>
                                    <div className="detail-value">E-mail</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">E-mail:</div>
                                    <div className="detail-value">verificacao@exemplo.com</div>
                                </div>
                                {selectedTask.status === "pending" && (
                                    <div className="form-group">
                                        <label htmlFor="verification-code">Código de Verificação:</label>
                                        <input type="text" id="verification-code" placeholder="Digite o código recebido" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        {selectedTask.status === "pending" && (
                            <Button
                                onClick={() => {
                                    handleCompleteTask(selectedTask)
                                    setShowDetailsModal(false)
                                }}
                            >
                                Marcar como Concluída
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

export default Tasks
