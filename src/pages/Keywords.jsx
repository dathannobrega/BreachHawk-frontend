import React, { useState } from "react"
import Card from "../components/ui/Card"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"
import Button from "../components/ui/Button"
import SearchInput from "../components/ui/SearchInput"
import Pagination from "../components/ui/Pagination"
import "../styles/pages/keywords.css"

const Keywords = () => {
    const [keywords, setKeywords] = useState([
        {
            id: 1,
            keyword: "senha123",
            sites: 3,
            leaks: 2,
            lastDetection: "2023-05-15",
            sensitivity: "high",
        },
        {
            id: 2,
            keyword: "api_key",
            sites: 5,
            leaks: 1,
            lastDetection: "2023-05-14",
            sensitivity: "medium",
        },
        {
            id: 3,
            keyword: "admin",
            sites: 2,
            leaks: 0,
            lastDetection: "N/A",
            sensitivity: "low",
        },
        {
            id: 4,
            keyword: "password",
            sites: 7,
            leaks: 3,
            lastDetection: "2023-05-12",
            sensitivity: "high",
        },
        {
            id: 5,
            keyword: "secret",
            sites: 4,
            leaks: 1,
            lastDetection: "2023-05-10",
            sensitivity: "medium",
        },
        {
            id: 6,
            keyword: "token",
            sites: 6,
            leaks: 0,
            lastDetection: "N/A",
            sensitivity: "medium",
        },
        {
            id: 7,
            keyword: "private_key",
            sites: 2,
            leaks: 1,
            lastDetection: "2023-05-08",
            sensitivity: "high",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newKeyword, setNewKeyword] = useState({
        keyword: "",
        sites: [],
        sensitivity: "medium",
    })
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [keywordToDelete, setKeywordToDelete] = useState(null)

    // Filtrar keywords com base no termo de pesquisa
    const filteredKeywords = keywords.filter((keyword) =>
        keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Calcular paginação
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentKeywords = filteredKeywords.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage)

    // Manipuladores de eventos
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleAddKeyword = () => {
        if (newKeyword.keyword.trim() === "") return

        const newId =
            keywords.length > 0 ? Math.max(...keywords.map((k) => k.id)) + 1 : 1
        const keywordToAdd = {
            id: newId,
            keyword: newKeyword.keyword,
            sites: newKeyword.sites.length,
            leaks: 0,
            lastDetection: "N/A",
            sensitivity: newKeyword.sensitivity,
        }

        setKeywords([...keywords, keywordToAdd])
        setNewKeyword({ keyword: "", sites: [], sensitivity: "medium" })
        setShowAddModal(false)
    }

    const handleDeleteKeyword = () => {
        if (!keywordToDelete) return

        setKeywords(keywords.filter((keyword) => keyword.id !== keywordToDelete.id))
        setKeywordToDelete(null)
        setShowDeleteModal(false)
    }

    const openDeleteModal = (keyword) => {
        setKeywordToDelete(keyword)
        setShowDeleteModal(true)
    }

    return (
        <div className="keywords-page">
            <div className="page-header">
                <h1>Palavras-chave</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    Adicionar Palavra-chave
                </Button>
            </div>

            <Card>
                <div className="card-header">
                    <SearchInput
                        placeholder="Buscar palavras-chave..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <Table
                    columns={[
                        { key: "keyword", label: "Palavra-chave" },
                        { key: "sites", label: "Sites" },
                        { key: "leaks", label: "Vazamentos" },
                        { key: "lastDetection", label: "Última Detecção" },
                        {
                            key: "sensitivity",
                            label: "Sensibilidade",
                            render: (value) => (
                                <span className={`sensitivity ${value}`}>
                  {value === "high"
                      ? "Alta"
                      : value === "medium"
                          ? "Média"
                          : "Baixa"}
                </span>
                            ),
                        },
                    ]}
                    data={currentKeywords}
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
                    emptyMessage="Nenhuma palavra-chave encontrada."
                />

                <div className="card-footer">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>

            {/* Modal para adicionar palavra-chave */}
            <Modal
                title="Adicionar Palavra-chave"
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            >
                <div className="form-group">
                    <label htmlFor="keyword-text">Palavra-chave</label>
                    <input
                        id="keyword-text"
                        type="text"
                        value={newKeyword.keyword}
                        onChange={(e) =>
                            setNewKeyword({ ...newKeyword, keyword: e.target.value })
                        }
                        placeholder="ex: senha123"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="keyword-sites">Sites (separados por vírgula)</label>
                    <textarea
                        id="keyword-sites"
                        value={newKeyword.sites.join(", ")}
                        onChange={(e) =>
                            setNewKeyword({
                                ...newKeyword,
                                sites: e.target.value.split(",").map((s) => s.trim()),
                            })
                        }
                        placeholder="ex: example.com, test.org"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="keyword-sensitivity">Sensibilidade</label>
                    <select
                        id="keyword-sensitivity"
                        value={newKeyword.sensitivity}
                        onChange={(e) =>
                            setNewKeyword({ ...newKeyword, sensitivity: e.target.value })
                        }
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <Button onClick={handleAddKeyword}>Adicionar</Button>
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
                    Tem certeza que deseja excluir a palavra-chave{" "}
                    <strong>{keywordToDelete?.keyword}</strong>?
                </p>
                <div className="modal-actions">
                    <Button variant="danger" onClick={handleDeleteKeyword}>
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

export default Keywords
