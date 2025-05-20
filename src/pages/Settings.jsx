"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import "../styles/pages/settings.css"

const Settings = () => {
    // Estados para as configurações
    const [generalSettings, setGeneralSettings] = useState({
        companyName: "Deep Protexion",
        adminEmail: "admin@deepprotexion.com",
        scanFrequency: "daily",
        notificationsEnabled: true,
        darkModeEnabled: false,
    })

    const [scanSettings, setScanSettings] = useState({
        maxDepth: 3,
        useProxy: true,
        respectRobotsTxt: true,
        maxConcurrentRequests: 5,
        userAgent: "DeepProtexion Scanner/1.0",
        timeout: 30,
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        slackNotifications: false,
        slackWebhook: "",
        emailRecipients: "admin@deepprotexion.com",
        phoneNumbers: "",
    })

    const [apiSettings, setApiSettings] = useState({
        apiEnabled: true,
        apiKey: "dp_" + Math.random().toString(36).substring(2, 15),
        allowedOrigins: "*",
        rateLimit: 100,
    })

    // Estados para modais
    const [showResetModal, setShowResetModal] = useState(false)
    const [showApiKeyModal, setShowApiKeyModal] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    // Manipuladores de eventos para formulários
    const handleGeneralSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        setGeneralSettings({
            ...generalSettings,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleScanSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        setScanSettings({
            ...scanSettings,
            [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
        })
    }

    const handleNotificationSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        setNotificationSettings({
            ...notificationSettings,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleApiSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        setApiSettings({
            ...apiSettings,
            [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
        })
    }

    // Manipuladores para salvar configurações
    const handleSaveSettings = () => {
        // Aqui você implementaria a lógica para salvar as configurações no backend
        console.log("Salvando configurações:", {
            generalSettings,
            scanSettings,
            notificationSettings,
            apiSettings,
        })

        // Mostrar mensagem de sucesso
        setShowSuccessMessage(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 3000)
    }

    const handleResetSettings = () => {
        // Resetar para valores padrão
        setGeneralSettings({
            companyName: "Deep Protexion",
            adminEmail: "admin@deepprotexion.com",
            scanFrequency: "daily",
            notificationsEnabled: true,
            darkModeEnabled: false,
        })

        setScanSettings({
            maxDepth: 3,
            useProxy: true,
            respectRobotsTxt: true,
            maxConcurrentRequests: 5,
            userAgent: "DeepProtexion Scanner/1.0",
            timeout: 30,
        })

        setNotificationSettings({
            emailNotifications: true,
            smsNotifications: false,
            slackNotifications: false,
            slackWebhook: "",
            emailRecipients: "admin@deepprotexion.com",
            phoneNumbers: "",
        })

        setApiSettings({
            apiEnabled: true,
            apiKey: "dp_" + Math.random().toString(36).substring(2, 15),
            allowedOrigins: "*",
            rateLimit: 100,
        })

        setShowResetModal(false)
        setShowSuccessMessage(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 3000)
    }

    const regenerateApiKey = () => {
        setApiSettings({
            ...apiSettings,
            apiKey: "dp_" + Math.random().toString(36).substring(2, 15),
        })
        setShowApiKeyModal(false)
    }

    return (
        <div className="settings-container">
            <div className="page-header">
                <h1>Configurações</h1>
            </div>

            {showSuccessMessage && (
                <div className="success-message">Configurações salvas com sucesso!</div>
            )}

            <div className="settings-grid">
                {/* Configurações Gerais */}
                <Card title="Configurações Gerais">
                    <div className="form-group">
                        <label htmlFor="companyName">Nome da Empresa</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={generalSettings.companyName}
                            onChange={handleGeneralSettingsChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="adminEmail">E-mail do Administrador</label>
                        <input
                            type="text"
                            id="adminEmail"
                            name="adminEmail"
                            value={generalSettings.adminEmail}
                            onChange={handleGeneralSettingsChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="scanFrequency">Frequência de Verificação</label>
                        <select
                            id="scanFrequency"
                            name="scanFrequency"
                            value={generalSettings.scanFrequency}
                            onChange={handleGeneralSettingsChange}
                        >
                            <option value="hourly">A cada hora</option>
                            <option value="daily">Diariamente</option>
                            <option value="weekly">Semanalmente</option>
                            <option value="monthly">Mensalmente</option>
                        </select>
                    </div>

                    <div className="toggle-group">
                        <label htmlFor="notificationsEnabled">Notificações</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="notificationsEnabled"
                                name="notificationsEnabled"
                                checked={generalSettings.notificationsEnabled}
                                onChange={handleGeneralSettingsChange}
                            />
                            <label htmlFor="notificationsEnabled"></label>
                        </div>
                    </div>

                    <div className="toggle-group">
                        <label htmlFor="darkModeEnabled">Modo Escuro</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="darkModeEnabled"
                                name="darkModeEnabled"
                                checked={generalSettings.darkModeEnabled}
                                onChange={handleGeneralSettingsChange}
                            />
                            <label htmlFor="darkModeEnabled"></label>
                        </div>
                    </div>
                </Card>

                {/* Configurações de Verificação */}
                <Card title="Configurações de Verificação">
                    <div className="form-group">
                        <label htmlFor="maxDepth">Profundidade Máxima de Verificação</label>
                        <input
                            type="number"
                            id="maxDepth"
                            name="maxDepth"
                            min="1"
                            max="10"
                            value={scanSettings.maxDepth}
                            onChange={handleScanSettingsChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxConcurrentRequests">Requisições Simultâneas</label>
                        <input
                            type="number"
                            id="maxConcurrentRequests"
                            name="maxConcurrentRequests"
                            min="1"
                            max="20"
                            value={scanSettings.maxConcurrentRequests}
                            onChange={handleScanSettingsChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeout">Timeout (segundos)</label>
                        <input
                            type="number"
                            id="timeout"
                            name="timeout"
                            min="5"
                            max="120"
                            value={scanSettings.timeout}
                            onChange={handleScanSettingsChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userAgent">User Agent</label>
                        <input
                            type="text"
                            id="userAgent"
                            name="userAgent"
                            value={scanSettings.userAgent}
                            onChange={handleScanSettingsChange}
                        />
                    </div>

                    <div className="toggle-group">
                        <label htmlFor="useProxy">Usar Proxy</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="useProxy"
                                name="useProxy"
                                checked={scanSettings.useProxy}
                                onChange={handleScanSettingsChange}
                            />
                            <label htmlFor="useProxy"></label>
                        </div>
                    </div>

                    <div className="toggle-group">
                        <label htmlFor="respectRobotsTxt">Respeitar robots.txt</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="respectRobotsTxt"
                                name="respectRobotsTxt"
                                checked={scanSettings.respectRobotsTxt}
                                onChange={handleScanSettingsChange}
                            />
                            <label htmlFor="respectRobotsTxt"></label>
                        </div>
                    </div>
                </Card>

                {/* Configurações de Notificação */}
                <Card title="Configurações de Notificação">
                    <div className="toggle-group">
                        <label htmlFor="emailNotifications">Notificações por E-mail</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="emailNotifications"
                                name="emailNotifications"
                                checked={notificationSettings.emailNotifications}
                                onChange={handleNotificationSettingsChange}
                            />
                            <label htmlFor="emailNotifications"></label>
                        </div>
                    </div>

                    {notificationSettings.emailNotifications && (
                        <div className="form-group mt-2">
                            <label htmlFor="emailRecipients">Destinatários (separados por vírgula)</label>
                            <input
                                type="text"
                                id="emailRecipients"
                                name="emailRecipients"
                                value={notificationSettings.emailRecipients}
                                onChange={handleNotificationSettingsChange}
                            />
                        </div>
                    )}

                    <div className="toggle-group">
                        <label htmlFor="smsNotifications">Notificações por SMS</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="smsNotifications"
                                name="smsNotifications"
                                checked={notificationSettings.smsNotifications}
                                onChange={handleNotificationSettingsChange}
                            />
                            <label htmlFor="smsNotifications"></label>
                        </div>
                    </div>

                    {notificationSettings.smsNotifications && (
                        <div className="form-group mt-2">
                            <label htmlFor="phoneNumbers">Números de Telefone (separados por vírgula)</label>
                            <input
                                type="text"
                                id="phoneNumbers"
                                name="phoneNumbers"
                                value={notificationSettings.phoneNumbers}
                                onChange={handleNotificationSettingsChange}
                            />
                        </div>
                    )}

                    <div className="toggle-group">
                        <label htmlFor="slackNotifications">Notificações no Slack</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="slackNotifications"
                                name="slackNotifications"
                                checked={notificationSettings.slackNotifications}
                                onChange={handleNotificationSettingsChange}
                            />
                            <label htmlFor="slackNotifications"></label>
                        </div>
                    </div>

                    {notificationSettings.slackNotifications && (
                        <div className="form-group mt-2">
                            <label htmlFor="slackWebhook">URL do Webhook do Slack</label>
                            <input
                                type="text"
                                id="slackWebhook"
                                name="slackWebhook"
                                value={notificationSettings.slackWebhook}
                                onChange={handleNotificationSettingsChange}
                            />
                        </div>
                    )}
                </Card>

                {/* Configurações de API */}
                <Card title="Configurações de API">
                    <div className="toggle-group">
                        <label htmlFor="apiEnabled">API Habilitada</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="apiEnabled"
                                name="apiEnabled"
                                checked={apiSettings.apiEnabled}
                                onChange={handleApiSettingsChange}
                            />
                            <label htmlFor="apiEnabled"></label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="apiKey">Chave da API</label>
                        <div className="api-key-container">
                            <input
                                type="text"
                                id="apiKey"
                                name="apiKey"
                                value={apiSettings.apiKey}
                                readOnly
                            />
                            <Button onClick={() => setShowApiKeyModal(true)}>Regenerar</Button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="allowedOrigins">Origens Permitidas (CORS)</label>
                        <input
                            type="text"
                            id="allowedOrigins"
                            name="allowedOrigins"
                            value={apiSettings.allowedOrigins}
                            onChange={handleApiSettingsChange}
                            placeholder="* para todas, ou lista separada por vírgulas"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rateLimit">Limite de Requisições (por hora)</label>
                        <input
                            type="number"
                            id="rateLimit"
                            name="rateLimit"
                            min="10"
                            max="1000"
                            value={apiSettings.rateLimit}
                            onChange={handleApiSettingsChange}
                        />
                    </div>
                </Card>
            </div>

            <div className="settings-actions">
                <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
                <Button variant="outline" onClick={() => setShowResetModal(true)}>
                    Restaurar Padrões
                </Button>
            </div>

            {/* Modal de Confirmação para Reset */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Restaurar Configurações Padrão"
            >
                <p>Tem certeza que deseja restaurar todas as configurações para os valores padrão?</p>
                <p>Esta ação não pode ser desfeita.</p>
                <div className="modal-actions">
                    <Button variant="danger" onClick={handleResetSettings}>
                        Restaurar
                    </Button>
                    <Button variant="outline" onClick={() => setShowResetModal(false)}>
                        Cancelar
                    </Button>
                </div>
            </Modal>

            {/* Modal de Confirmação para Regenerar API Key */}
            <Modal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                title="Regenerar Chave da API"
            >
                <p>Tem certeza que deseja regenerar a chave da API?</p>
                <p>Todas as integrações existentes deixarão de funcionar até que sejam atualizadas com a nova chave.</p>
                <div className="modal-actions">
                    <Button variant="danger" onClick={regenerateApiKey}>
                        Regenerar
                    </Button>
                    <Button variant="outline" onClick={() => setShowApiKeyModal(false)}>
                        Cancelar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default Settings
