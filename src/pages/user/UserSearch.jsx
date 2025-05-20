"use client"

import { useState } from "react"
import { FaSearch, FaGlobe, FaEnvelope, FaBuilding, FaUser } from "react-icons/fa"
import "../../styles/pages/user-search.css"

const UserSearch = () => {
    const [searchType, setSearchType] = useState("domain")
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [searchHistory, setSearchHistory] = useState([
        {
            id: 1,
            type: "domain",
            query: "meu-dominio.com.br",
            date: "2023-05-15",
            results: 5,
        },
        {
            id: 2,
            type: "email",
            query: "email@empresa.com",
            date: "2023-05-14",
            results: 2,
        },
        {
            id: 3,
            type: "company",
            query: "Minha Empresa Ltda",
            date: "2023-05-12",
            results: 8,
        },
        {
            id: 4,
            type: "person",
            query: "João Silva",
            date: "2023-05-10",
            results: 3,
        },
    ])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsLoading(true)

        // Simulando uma pesquisa
        setTimeout(() => {
            const newSearch = {
                id: Date.now(),
                type: searchType,
                query: searchQuery,
                date: new Date().toISOString().split("T")[0],
                results: Math.floor(Math.random() * 10),
            }

            setSearchHistory([newSearch, ...searchHistory])
            setIsLoading(false)

            // Redirecionar para a página de resultados (simulado)
            console.log(`Redirecionando para resultados de: ${searchQuery}`)
        }, 1500)
    }

    const getSearchTypeIcon = (type) => {
        switch (type) {
            case "domain":
                return <FaGlobe />
            case "email":
                return <FaEnvelope />
            case "company":
                return <FaBuilding />
            case "person":
                return <FaUser />
            default:
                return <FaSearch />
        }
    }

    return (
        <div className="user-search-page">
            <div className="search-header">
                <h1>Pesquisar Vazamentos</h1>
                <p>Pesquise por domínios, e-mails, empresas ou pessoas para verificar se há vazamentos de dados.</p>
            </div>

            <div className="search-container">
                <div className="search-tabs">
                    <button className={searchType === "domain" ? "active" : ""} onClick={() => setSearchType("domain")}>
                        <FaGlobe /> Domínio
                    </button>
                    <button className={searchType === "email" ? "active" : ""} onClick={() => setSearchType("email")}>
                        <FaEnvelope /> E-mail
                    </button>
                    <button className={searchType === "company" ? "active" : ""} onClick={() => setSearchType("company")}>
                        <FaBuilding /> Empresa
                    </button>
                    <button className={searchType === "person" ? "active" : ""} onClick={() => setSearchType("person")}>
                        <FaUser /> Pessoa
                    </button>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    searchType === "domain"
                                        ? "exemplo.com.br"
                                        : searchType === "email"
                                            ? "email@exemplo.com"
                                            : searchType === "company"
                                                ? "Nome da Empresa"
                                                : "Nome da Pessoa"
                                }
                                className="search-input"
                            />
                            <button type="submit" className={`search-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                                {isLoading ? "Pesquisando..." : "Pesquisar"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="search-tips">
                    <h3>Dicas de pesquisa:</h3>
                    <ul>
                        {searchType === "domain" && (
                            <>
                                <li>Use o domínio completo, como "exemplo.com.br"</li>
                                <li>Não inclua "http://" ou "https://"</li>
                                <li>Você pode pesquisar subdomínios específicos</li>
                            </>
                        )}
                        {searchType === "email" && (
                            <>
                                <li>Use o endereço de e-mail completo</li>
                                <li>Verifique se o e-mail está escrito corretamente</li>
                                <li>Pesquise e-mails corporativos para maior precisão</li>
                            </>
                        )}
                        {searchType === "company" && (
                            <>
                                <li>Use o nome oficial da empresa</li>
                                <li>Inclua o tipo de empresa (Ltda, S.A., etc.)</li>
                                <li>Tente variações do nome se não encontrar resultados</li>
                            </>
                        )}
                        {searchType === "person" && (
                            <>
                                <li>Use o nome completo da pessoa</li>
                                <li>Adicione informações adicionais para maior precisão</li>
                                <li>Respeite a privacidade ao pesquisar informações pessoais</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div className="search-history">
                <h2>Histórico de Pesquisas</h2>
                {searchHistory.length > 0 ? (
                    <div className="history-list">
                        {searchHistory.map((item) => (
                            <div key={item.id} className="history-item">
                                <div className="history-icon">{getSearchTypeIcon(item.type)}</div>
                                <div className="history-details">
                                    <h3>{item.query}</h3>
                                    <div className="history-meta">
                    <span className="history-type">
                      {item.type === "domain"
                          ? "Domínio"
                          : item.type === "email"
                              ? "E-mail"
                              : item.type === "company"
                                  ? "Empresa"
                                  : "Pessoa"}
                    </span>
                                        <span className="history-date">{item.date}</span>
                                        <span className="history-results">{item.results} resultados</span>
                                    </div>
                                </div>
                                <a href={`/user/search/results?q=${item.query}`} className="history-action">
                                    Ver resultados
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-history">Nenhuma pesquisa realizada ainda.</p>
                )}
            </div>
        </div>
    )
}

export default UserSearch
