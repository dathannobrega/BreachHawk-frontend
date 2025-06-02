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

const Sites: React.FC = () => {
  const [sites, setSites] = useState([
    {
      id: 1,
      url: "example.com",
      status: "active",
      keywords: 12,
      lastScan: "2023-05-15",
      leaks: 3,
    },
    {
      id: 2,
      url: "test.org",
      status: "active",
      keywords: 8,
      lastScan: "2023-05-14",
      leaks: 1,
    },
    {
      id: 3,
      url: "demo.net",
      status: "inactive",
      keywords: 5,
      lastScan: "2023-05-10",
      leaks: 0,
    },
    {
      id: 4,
      url: "sample.io",
      status: "active",
      keywords: 15,
      lastScan: "2023-05-15",
      leaks: 5,
    },
    {
      id: 5,
      url: "test-site.com",
      status: "active",
      keywords: 7,
      lastScan: "2023-05-13",
      leaks: 2,
    },
    {
      id: 6,
      url: "another-example.com",
      status: "active",
      keywords: 10,
      lastScan: "2023-05-12",
      leaks: 0,
    },
    {
      id: 7,
      url: "yet-another.org",
      status: "inactive",
      keywords: 3,
      lastScan: "2023-05-09",
      leaks: 0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSite, setNewSite] = useState({ url: "", keywords: [] })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<any>(null)

  // Filtrar sites com base no termo de pesquisa
  const filteredSites = sites.filter((site) => site.url.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calcular paginação
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSites = filteredSites.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage)

  // Manipuladores de eventos
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddSite = () => {
    if (newSite.url.trim() === "") return

    const newId = sites.length > 0 ? Math.max(...sites.map((s) => s.id)) + 1 : 1
    const siteToAdd = {
      id: newId,
      url: newSite.url,
      status: "active",
      keywords: newSite.keywords.length,
      lastScan: "Nunca",
      leaks: 0,
    }

    setSites([...sites, siteToAdd])
    setNewSite({ url: "", keywords: [] })
    setShowAddModal(false)
  }

  const handleDeleteSite = () => {
    if (!siteToDelete) return

    setSites(sites.filter((site) => site.id !== siteToDelete.id))
    setSiteToDelete(null)
    setShowDeleteModal(false)
  }

  const openDeleteModal = (site: any) => {
    setSiteToDelete(site)
    setShowDeleteModal(true)
  }

  return (
    <div className="sites-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
        <Button onClick={() => setShowAddModal(true)}>Adicionar Site</Button>
      </div>

      <Card>
        <div className="mb-4">
          <SearchInput placeholder="Buscar sites..." value={searchTerm} onChange={handleSearch} />
        </div>

        <Table
          columns={[
            { header: "URL", accessor: "url" },
            {
              header: "Status",
              accessor: "status",
              render: (row) => (
                <StatusBadge
                  status={row.status === "active" ? "success" : "danger"}
                  text={row.status === "active" ? "Ativo" : "Inativo"}
                />
              ),
            },
            { header: "Palavras-chave", accessor: "keywords" },
            { header: "Última Verificação", accessor: "lastScan" },
            { header: "Vazamentos", accessor: "leaks" },
          ]}
          data={currentSites}
          actions={[
            {
              label: "Editar",
              onClick: (item) => console.log("Editar", item),
            },
            {
              label: "Excluir",
              onClick: openDeleteModal,
              className: "text-red-600 hover:text-red-800",
            },
          ]}
          emptyMessage="Nenhum site encontrado."
        />

        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </Card>

      {/* Modal para adicionar site */}
      <Modal title="Adicionar Site" isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="site-url" className="block text-sm font-medium text-gray-700">
              URL do Site
            </label>
            <input
              id="site-url"
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              placeholder="ex: example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="site-keywords" className="block text-sm font-medium text-gray-700">
              Palavras-chave (separadas por vírgula)
            </label>
            <textarea
              id="site-keywords"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={newSite.keywords.join(", ")}
              onChange={(e) =>
                setNewSite({
                  ...newSite,
                  keywords: e.target.value.split(",").map((k) => k.trim()),
                })
              }
              placeholder="ex: senha, api_key, token"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSite}>Adicionar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal para confirmar exclusão */}
      <Modal title="Confirmar Exclusão" isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <p className="mb-4">
          Tem certeza que deseja excluir o site <strong>{siteToDelete?.url}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteSite}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Sites
