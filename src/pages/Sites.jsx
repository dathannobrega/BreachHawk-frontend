import React, { useState } from "react"
import Card from "../components/ui/card"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"
import Button from "../components/ui/button"
import SearchInput from "../components/ui/SearchInput"
import Pagination from "../components/ui/Pagination"
import "../styles/pages/sites.css"

const Sites = () => {
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
    const [siteToDelete, setSiteToDelete] = useState(null)

    // Filtrar sites com base no termo de pesquisa
    const filteredSites = sites.filter((site) =>
        site.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Calcular paginação
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentSites = filteredSites.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredSites.length / itemsPerPage)

    // Manipuladores de eventos
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
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

    const openDeleteModal = (site) => {
        setSiteToDelete(site)
        setShowDeleteModal(true)
    }

    return (
        <div className="sites-page">
            <div className="page-header">
                <h1>Sites</h1>
                <Button onClick={() => setShowAddModal(true)}>Adicionar Site</Button>
            </div>

            <Card>
                <div className="card-header">
                    <SearchInput
                        placeholder="Buscar sites..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

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
                        { key: "leaks", label: "Vazamentos" },
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
                            className: "danger",
                        },
                    ]}
                    emptyMessage="Nenhum site encontrado."
                />

                <div className="card-footer">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>

            {/* Modal para adicionar site */}
            <Modal
                title="Adicionar Site"
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            >
                <div className="form-group">
                    <label htmlFor="site-url">URL do Site</label>
                    <input
                        id="site-url"
                        type="text"
                        value={newSite.url}
                        onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                        placeholder="ex: example.com"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="site-keywords">Palavras-chave (separadas por vírgula)</label>
                    <textarea
                        id="site-keywords"
                        value={newSite.keywords.join(", ")}
                        onChange={(e) =>
                            setNewSite({
                                ...newSite,
                                keywords: e.target.value.split(",").map((k) => k.trim()),
                            })
                        }
                        placeholder="ex: senha, api_key, token"
                    />
                </div>
                <div className="modal-actions">
                    <Button onClick={handleAddSite}>Adicionar</Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowAddModal(false)}
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>

            {/* Modal para confirmar exclusão */}
            <Modal
                title="Confirmar Exclusão"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <p>
                    Tem certeza que deseja excluir o site{" "}
                    <strong>{siteToDelete?.url}</strong>?
                </p>
                <div className="modal-actions">
                    <Button variant="danger" onClick={handleDeleteSite}>
                        Excluir
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default Sites
