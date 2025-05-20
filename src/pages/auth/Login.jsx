"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaShieldAlt, FaLock, FaUser } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext.jsx"
import Button from "../../components/ui/button.jsx"
import "../../styles/pages/login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simulação de login
      if (formData.username === "admin" && formData.password === "admin") {
        login({ username: formData.username, role: "admin" })
        navigate("/dashboard")
      } else if (formData.username === "user" && formData.password === "user") {
        login({ username: formData.username, role: "user" })
        navigate("/user/dashboard")
      } else {
        setError("Credenciais inválidas. Tente admin/admin ou user/user.")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FaShieldAlt className="logo-icon" />
            <h1>Deep Protexion</h1>
          </div>
          <p className="login-subtitle">Faça login para acessar o painel</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>

      <div className="login-info">
        <p>
          <strong>Credenciais de teste:</strong>
        </p>
        <p>Admin: admin/admin</p>
        <p>Usuário: user/user</p>
      </div>
    </div>
  )
}

export default Login
