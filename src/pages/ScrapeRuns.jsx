"use client"

import { useState } from "react"
import { FaPlay, FaEye, FaRedo } from "react-icons/fa"
import Button from "../components/ui/Button"
import Table from "../components/ui/Table"
import StatusBadge from "../components/ui/StatusBadge"
import Modal from "../components/ui/Modal"
import Pagination from "../components/ui/Pagination"
import "../styles/pages/scrape-runs.css"

const ScrapeRuns = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentRun, setCurrentRun] = useState(null)
    const [showLiveExecution, setShowLiveExecution] = useState(false)

    // Mock data
    const runsData = [
        {
            id: 1234,
            site: "darkforum.onion",
            startTime: "28/04/2023 14:30",
            duration: "12m 45s",
            status: "completed",
            leaks: 1,
        },
        {
            id: 1233,
            site: "leakmarket.onion",
            startTime: "28/04/2023 12:15",
            duration: "8m 30s",
            status: "completed",
            leaks: 0,
        },
        {
            id: 1232,
            site: "darkmarket.onion",
            startTime: "27/04/2023 23:45",
            duration: "-",
            status: "failed",
            leaks: 0,
        },
        {
            id: 1231,
            site: "hackerboard.onion",
            startTime: "27/04/2023 10:20",
            duration: "15m 12s",
            status: "completed",
            leaks: 2,
        },
    ]

    const columns = [
        {
            header: "ID",
            accessor: "id",
            render: (row) => `#${row.id}`,
        },
        {
            header: "Site",
            accessor: "site",
        },
        {
            header: "Início",
            accessor: "startTime",
        },
        {
            header: "Duração",
            accessor: "duration",
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <StatusBadge
                    status={row.status === "completed" ? "success" : "danger"}
                    text={row.status === "completed" ? "Concluído" : "Falhou"}
                />
            ),
        },
        {
            header: "Vazamentos",
            accessor: "leaks",
        },
    ]

    const handleViewRun = (run) => {
        setCurrentRun(run)
        setIsModalOpen(true)
    }

    const handleRerunRun = (run) => {
        if (window.confirm(`Deseja iniciar uma nova execução para ${run.site}?`)) {
            setShowLiveExecution(true)
        }
    }

    const actions = [
        {
            icon: <FaEye />,
            label: "Visualizar",
            onClick: handleViewRun,
        },
        {
            icon: <FaRedo />,
            label: "Executar Novamente",
            onClick: handleRerunRun,
        },
    ]

    const handleNewRun = () => {
        const site = prompt("Digite a URL do site para executar o scraping:")

        if (site) {
            setShowLiveExecution(true)
        }
    }

    return (
        <div className="scrape-runs-container">
            <h1 className="page-title">Execuções de Scraping</h1>

            <div className="action-bar">
                <div className="filter-container">
                    <select className="filter-select">
                        <option value="all">Todos os sites</option>
                        <option value="darkforum.onion">darkforum.onion</option>
                        <option value="leakmarket.onion">leakmarket.onion</option>
                        <option value="darkmarket.onion">darkmarket.onion</option>
                        <option value="hackerboard.onion">hackerboard.onion</option>
                    </select>
                    <select className="filter-select">
                        <option value="all">Todos os status</option>
                        <option value="running">Em execução</option>
                        <option value="completed">Concluído</option>
                        <option value="failed">Falhou</option>
                    </select>
                    <input type="date" className="filter-date" />
                </div>

                <Button variant="primary" icon={<FaPlay />} onClick={handleNewRun}>
                    Nova Execução
                </Button>
            </div>

            <Table columns={columns} data={runsData} actions={actions} />

            <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />

            {showLiveExecution && (
                <div className="live-execution">
                    <div className="live-header">
                        <h3>Execução em Tempo Real</h3>
                        <div className="live-status">
                            <StatusBadge status="info" text="Em execução" />
                            <span className="live-timer">00:02:45</span>
                        </div>
                    </div>

                    <div className="live-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: "45%" }}></div>
                        </div>
                        <div className="progress-text">45% concluído</div>
                    </div>

                    <div className="live-details">
                        <div className="detail-row">
                            <div className="detail-label">Site:</div>
                            <div className="detail-value">darkforum.onion</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Páginas processadas:</div>
                            <div className="detail-value">45/100</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Vazamentos encontrados:</div>
                            <div className="detail-value">1</div>
                        </div>
                    </div>

                    <div className="live-log">
                        <div className="log-header">
                            <h4>Log de Execução</h4>
                            <Button variant="outline" size="sm" icon={<FaRedo />}>
                                Atualizar
                            </Button>
                        </div>
                        <div className="log-content">
              <pre>
                {`[2023-04-28 15:30:12] INFO: Iniciando scraping de darkforum.onion
[2023-04-28 15:30:15] INFO: Conectado via Tor
[2023-04-28 15:30:18] INFO: Autenticação bem-sucedida
[2023-04-28 15:30:20] INFO: Iniciando processamento de páginas
[2023-04-28 15:31:05] INFO: Processadas 10 páginas
[2023-04-28 15:31:45] INFO: Processadas 20 páginas
[2023-04-28 15:32:30] INFO: Processadas 30 páginas
[2023-04-28 15:33:15] WARNING: Possível vazamento encontrado para palavra-chave "empresa-xyz"
[2023-04-28 15:33:20] INFO: Vazamento registrado com ID #5678
[2023-04-28 15:33:25] INFO: Processadas 40 páginas`}
              </pre>
                        </div>
                    </div>

                    <div className="live-actions">
                        <Button variant="outline" onClick={() => alert("Execução pausada")}>
                            Pausar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                if (window.confirm("Tem certeza que deseja interromper a execução?")) {
                                    setShowLiveExecution(false)
                                }
                            }}
                        >
                            Interromper
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentRun ? `Detalhes da Execução #${currentRun.id}` : ""}
                size="lg"
            >
                {currentRun && (
                    <div className="run-details">
                        <div className="detail-group">
                            <h4>Informações Gerais</h4>
                            <div className="detail-row">
                                <div className="detail-label">Site:</div>
                                <div className="detail-value">{currentRun.site}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Início:</div>
                                <div className="detail-value">{currentRun.startTime}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Término:</div>
                                <div className="detail-value">
                                    {currentRun.status === "completed"
                                        ? currentRun.startTime.split(" ")[0] +
                                        " " +
                                        (Number.parseInt(currentRun.startTime.split(" ")[1].split(":")[0]) +
                                            Math.floor(Number.parseInt(currentRun.duration) / 60)) +
                                        ":" +
                                        (Number.parseInt(currentRun.startTime.split(" ")[1].split(":")[1]) +
                                            (Number.parseInt(currentRun.duration) % 60))
                                        : "-"}
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Duração:</div>
                                <div className="detail-value">{currentRun.duration}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Status:</div>
                                <div className="detail-value">
                                    <StatusBadge
                                        status={currentRun.status === "completed" ? "success" : "danger"}
                                        text={currentRun.status === "completed" ? "Concluído" : "Falhou"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h4>Estatísticas</h4>
                            <div className="detail-row">
                                <div className="detail-label">Páginas processadas:</div>
                                <div className="detail-value">100</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Palavras-chave verificadas:</div>
                                <div className="detail-value">4</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Vazamentos encontrados:</div>
                                <div className="detail-value">{currentRun.leaks}</div>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h4>Log de Execução</h4>
                            <div className="log-content">
                <pre>
                  {`[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Iniciando scraping de ${currentRun.site}
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Conectado via Tor
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Autenticação bem-sucedida
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Iniciando processamento de páginas
${
                      currentRun.status === "completed"
                          ? `[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Processadas 100 páginas
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Processamento concluído
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] INFO: Execução concluída com sucesso`
                          : `[2023-04-28 ${currentRun.startTime.split(" ")[1]}] ERROR: Falha na autenticação
[2023-04-28 ${currentRun.startTime.split(" ")[1]}] ERROR: Execução falhou`
                  }`}
                </pre>
                            </div>
                        </div>

                        {currentRun.leaks > 0 && (
                            <div className="detail-group">
                                <h4>Vazamentos Encontrados</h4>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Palavra-chave</th>
                                            <th>Descrição</th>
                                            <th>Ações</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>#5678</td>
                                            <td>empresa-xyz</td>
                                            <td>Vazamento de credenciais de funcionários</td>
                                            <td className="actions">
                                                <button className="action-btn" onClick={() => alert("Visualizando vazamento...")}>
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ScrapeRuns
