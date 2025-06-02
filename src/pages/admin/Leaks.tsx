"use client"

import type React from "react"
import { useState } from "react"
import Card from "@/components/ui/Card"
import Table from "@/components/ui/Table"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import SearchInput from "@/components/ui/SearchInput"
import Pagination from "@/components/ui/Pagination"
import StatusBadge from "@/components/ui/StatusBadge"

const Leaks: React.FC = () => {
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
  const [selectedLeak, setSelectedLeak] = useState<any>(null)
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
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleSeverityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeverityFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetails = (leak: any) => {
    setSelectedLeak(leak)
    setShowDetailsModal(true)
  }

  const handleResolve = (leak: any) => {
    const updatedLeaks = leaks.map((l) => {
      if (l.id === leak.id) {
        return { ...l, status: "resolved" }
      }
      return l
    })
    setLeaks(updatedLeaks)
  }

  const getSeverityLabel = (severity: string) => {
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

  const getStatusLabel = (status: string) => {
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vazamentos Detectados</h1>
        <p className="text-gray-600">Gerencie e monitore vazamentos de dados detectados</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <select
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="resolved">Resolvidos</option>
          </select>
          <select
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
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
          className="w-full md:w-64"
        />
      </div>

      <Card>
        <Table
          columns={[
            { key: "site", label: "Site" },
            { key: "keyword", label: "Palavra-chave" },
            { key: "source", label: "Fonte" },
            { key: "date", label: "Data" },
            {
              key: "severity",
              label: "Severidade",
              render: (value, row) => (
                <StatusBadge
                  status={row.severity === "high" ? "danger" : row.severity === "medium" ? "warning" : "info"}
                  text={getSeverityLabel(row.severity)}
                />
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (value, row) => (
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
            },
            {
              label: "Marcar como Resolvido",
              onClick: handleResolve,
              disabled: (row) => row.status === "resolved",
            },
          ]}
        />

        <div className="mt-4">
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
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Informações Gerais</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Site</p>
                  <p>{selectedLeak.site}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Palavra-chave</p>
                  <p>{selectedLeak.keyword}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fonte</p>
                  <p>{selectedLeak.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Detecção</p>
                  <p>{selectedLeak.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Severidade</p>
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
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge
                    status={selectedLeak.status === "active" ? "danger" : "success"}
                    text={getStatusLabel(selectedLeak.status)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-medium">Conteúdo do Vazamento</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">
                  {`Exemplo de conteúdo vazado para ${selectedLeak.keyword} em ${selectedLeak.site}.\nEste é um exemplo simulado para fins de demonstração.\nEm um ambiente real, aqui seria exibido o conteúdo real do vazamento detectado.`}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-medium">Ações Recomendadas</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Alterar imediatamente todas as senhas relacionadas</li>
                <li>Verificar se há acessos não autorizados</li>
                <li>Implementar autenticação de dois fatores</li>
                <li>Revisar permissões de acesso</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
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
