"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaShieldAlt, FaLock, FaUser } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext.jsx"
import Button from "../../components/ui/button.jsx"
import "../../styles/pages/login.css"

const apiUrl = import.meta.env.VITE_API_URL

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // 1. Se existir ?token=<JWT> na URL, captura e faz login automático
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    if (token) {
      // Armazena o token e marca o usuário como autenticado
      login({ token })
      // Limpa query string e redireciona para dashboard
      navigate("/dashboard", { replace: true })
    }
  }, [location.search])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Chama o endpoint de login tradicional no backend
      const resp = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })
      if (!resp.ok) {
        const errJson = await resp.json()
        throw new Error(errJson.detail || "Falha no login")
      }
      const data = await resp.json()
      // Supondo que o backend retorne { access_token: "...", user: { ... } }
      login({
        token: data.access_token,
        user: data.user,
      })
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>
              <FaShieldAlt /> Login
            </h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <FaUser /> Usuário
              </label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Digite seu usuário"
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock /> Senha
              </label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  required
              />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Botão de Login com Google */}
          <div className="login-google">
            <a
                href={`${apiUrl}/api/v1/auth/login/google`}
                className="google-button"
            >
              Entrar com Google
            </a>
          </div>

          <div className="login-footer">
            <p>
              Não tem uma conta? <Link to="/register">Registre-se</Link>
            </p>
          </div>

          <div className="login-info">
            <p>
              <strong>Credenciais de teste:</strong>
            </p>
            <p>Admin: admin/admin</p>
            <p>Usuário: user/user</p>
          </div>
        </div>
      </div>
  )
}

export default Login
