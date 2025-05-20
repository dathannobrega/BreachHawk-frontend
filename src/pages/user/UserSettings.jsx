"use client"

import { useState } from "react"
import { FaUser, FaLock, FaBell, FaShieldAlt, FaEnvelope, FaPhone } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import "../../styles/pages/user-settings.css"

const UserSettings = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("profile")

    // Estados para os formulários
    const [profileForm, setProfileForm] = useState({
        name: user?.username || "",
        email: user?.email || "",
        phone: "",
        company: "",
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailAlerts: true,
        smsAlerts: false,
        weeklyReport: true,
        marketingEmails: false,
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: "30",
        loginNotifications: true,
    })

    // Manipuladores de formulário
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileForm({
            ...profileForm,
            [name]: value,
        })
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        })
    }

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target
        setNotificationSettings({
            ...notificationSettings,
            [name]: checked,
        })
    }

    const handleSecurityChange = (e) => {
        const { name, value, type, checked } = e.target
        setSecuritySettings({
            ...securitySettings,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    // Manipuladores de envio de formulário
    const handleProfileSubmit = (e) => {
        e.preventDefault()
        console.log("Perfil atualizado:", profileForm)
        // Implementar atualização de perfil
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        console.log("Senha atualizada")
        // Implementar atualização de senha
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const handleNotificationSubmit = (e) => {
        e.preventDefault()
        console.log("Notificações atualizadas:", notificationSettings)
        // Implementar atualização de notificações
    }

    const handleSecuritySubmit = (e) => {
        e.preventDefault()
        console.log("Configurações de segurança atualizadas:", securitySettings)
        // Implementar atualização de segurança
    }

    return (
        <div className="user-settings-page">
            <div className="settings-header">
                <h1>Configurações da Conta</h1>
                <p>Gerencie suas informações pessoais e preferências</p>
            </div>

            <div className="settings-container">
                <div className="settings-sidebar">
                    <button
                        className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <FaUser /> Perfil
                    </button>
                    <button
                        className={`settings-tab ${activeTab === "password" ? "active" : ""}`}
                        onClick={() => setActiveTab("password")}
                    >
                        <FaLock /> Senha
                    </button>
                    <button
                        className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        <FaBell /> Notificações
                    </button>
                    <button
                        className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
                        onClick={() => setActiveTab("security")}
                    >
                        <FaShieldAlt /> Segurança
                    </button>
                </div>

                <div className="settings-content">
                    {/* Perfil */}
                    {activeTab === "profile" && (
                        <div className="settings-panel">
                            <h2>Informações do Perfil</h2>
                            <form onSubmit={handleProfileSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">
                                        <FaUser /> Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <FaEnvelope /> E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <FaPhone /> Telefone
                                    </label>
                                    <input type="tel" id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="company">Empresa</label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={profileForm.company}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <button type="submit" className="btn-primary">
                                    Salvar Alterações
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Senha */}
                    {activeTab === "password" && (
                        <div className="settings-panel">
                            <h2>Alterar Senha</h2>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Senha Atual</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">Nova Senha</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary">
                                    Atualizar Senha
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Notificações */}
                    {activeTab === "notifications" && (
                        <div className="settings-panel">
                            <h2>Preferências de Notificação</h2>
                            <form onSubmit={handleNotificationSubmit}>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="emailAlerts"
                                        name="emailAlerts"
                                        checked={notificationSettings.emailAlerts}
                                        onChange={handleNotificationChange}
                                    />
                                    <label htmlFor="emailAlerts">
                                        Alertas por E-mail
                                        <span className="description">
                      Receba alertas por e-mail quando novos vazamentos forem detectados
                    </span>
                                    </label>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="smsAlerts"
                                        name="smsAlerts"
                                        checked={notificationSettings.smsAlerts}
                                        onChange={handleNotificationChange}
                                    />
                                    <label htmlFor="smsAlerts">
                                        Alertas por SMS
                                        <span className="description">Receba alertas por SMS para vazamentos críticos</span>
                                    </label>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="weeklyReport"
                                        name="weeklyReport"
                                        checked={notificationSettings.weeklyReport}
                                        onChange={handleNotificationChange}
                                    />
                                    <label htmlFor="weeklyReport">
                                        Relatório Semanal
                                        <span className="description">Receba um resumo semanal das atividades de monitoramento</span>
                                    </label>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="marketingEmails"
                                        name="marketingEmails"
                                        checked={notificationSettings.marketingEmails}
                                        onChange={handleNotificationChange}
                                    />
                                    <label htmlFor="marketingEmails">
                                        E-mails de Marketing
                                        <span className="description">Receba atualizações sobre novos recursos e ofertas especiais</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn-primary">
                                    Salvar Preferências
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Segurança */}
                    {activeTab === "security" && (
                        <div className="settings-panel">
                            <h2>Configurações de Segurança</h2>
                            <form onSubmit={handleSecuritySubmit}>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="twoFactorAuth"
                                        name="twoFactorAuth"
                                        checked={securitySettings.twoFactorAuth}
                                        onChange={handleSecurityChange}
                                    />
                                    <label htmlFor="twoFactorAuth">
                                        Autenticação de Dois Fatores
                                        <span className="description">Adicione uma camada extra de segurança à sua conta</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sessionTimeout">Tempo Limite da Sessão</label>
                                    <select
                                        id="sessionTimeout"
                                        name="sessionTimeout"
                                        value={securitySettings.sessionTimeout}
                                        onChange={handleSecurityChange}
                                    >
                                        <option value="15">15 minutos</option>
                                        <option value="30">30 minutos</option>
                                        <option value="60">1 hora</option>
                                        <option value="120">2 horas</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="loginNotifications"
                                        name="loginNotifications"
                                        checked={securitySettings.loginNotifications}
                                        onChange={handleSecurityChange}
                                    />
                                    <label htmlFor="loginNotifications">
                                        Notificações de Login
                                        <span className="description">
                      Receba um alerta quando sua conta for acessada de um novo dispositivo
                    </span>
                                    </label>
                                </div>
                                <button type="submit" className="btn-primary">
                                    Salvar Configurações
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserSettings
