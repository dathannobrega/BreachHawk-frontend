"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa"
import { useAuth } from "../../context/AuthContext.jsx"
import Button from "../../components/ui/button.jsx"
import "../../styles/pages/register.css"

const Register = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    plan: "basic",
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Limpa erro específico se houver
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // Validações de cada passo (podem ser ajustadas conforme as regras de negócio)
  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Usuário é obrigatório."
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório."
    if (!formData.password) newErrors.password = "Senha é obrigatória."
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "As senhas não conferem."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Nome é obrigatório."
    if (!formData.lastName.trim()) newErrors.lastName = "Sobrenome é obrigatório."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.terms)
      newErrors.terms = "Você precisa concordar com os Termos de Serviço."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => setStep(step - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Somente envia ao backend quando estiver no último passo e validado
    if (step === 3 && validateStep3()) {
      setLoading(true)
      try {
        // Chama o endpoint de registro no backend
        const resp = await fetch(`${apiUrl}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            job_title: formData.jobTitle,
            plan: formData.plan,
          }),
        })
        if (!resp.ok) {
          const errJson = await resp.json()
          throw new Error(errJson.detail || "Falha no registro")
        }
        const data = await resp.json()
        // Supondo que venha { access_token: "...", user: { ... } }
        register({
          token: data.access_token,
          user: data.user,
        })
        navigate("/user/dashboard")
      } catch (err) {
        setErrors({ submit: err.message || "Erro ao registrar. Tente novamente." })
      } finally {
        setLoading(false)
      }
    }
  }

  // Renderização do primeiro passo (Dados de acesso)
  const renderStep1 = () => (
      <>
        <h2 className="step-title">Crie suas Credenciais</h2>

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
              placeholder="Digite um nome de usuário"
              className={errors.username ? "error" : ""}
              required
          />
          {errors.username && <div className="error-text">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope /> E-mail
          </label>
          <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              className={errors.email ? "error" : ""}
              required
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
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
              placeholder="Crie uma senha"
              className={errors.password ? "error" : ""}
              required
          />
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FaCheck /> Confirme a Senha
          </label>
          <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repita sua senha"
              className={errors.confirmPassword ? "error" : ""}
              required
          />
          {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-actions">
          <Button type="button" variant="primary" onClick={nextStep} icon={<FaArrowRight />}>
            Próximo
          </Button>
        </div>
      </>
  )

  // Renderização do segundo passo (Dados Pessoais)
  const renderStep2 = () => (
      <>
        <h2 className="step-title">Informações Pessoais</h2>

        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser /> Nome
          </label>
          <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Digite seu nome"
              className={errors.firstName ? "error" : ""}
              required
          />
          {errors.firstName && <div className="error-text">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser /> Sobrenome
          </label>
          <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Digite seu sobrenome"
              className={errors.lastName ? "error" : ""}
              required
          />
          {errors.lastName && <div className="error-text">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="company">Empresa (opcional)</label>
          <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Digite sua empresa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobTitle">Cargo (opcional)</label>
          <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Digite seu cargo"
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={prevStep} icon={<FaArrowLeft />}>
            Voltar
          </Button>
          <Button type="button" variant="primary" onClick={nextStep} icon={<FaArrowRight />}>
            Próximo
          </Button>
        </div>
      </>
  )

  // Renderização do terceiro passo (Seleção de plano + Termos)
  const renderStep3 = () => (
      <>
        <h2 className="step-title">Escolha seu Plano</h2>

        <div className="form-group">
          <label htmlFor="plan">Plano</label>
          <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
          >
            <option value="basic">Básico</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className="form-group terms-group">
          <div className="checkbox-container">
            <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className={errors.terms ? "error" : ""}
            />
            <label htmlFor="terms">
              Eu li e concordo com os <a href="#">Termos de Serviço</a> e{" "}
              <a href="#">Política de Privacidade</a>
            </label>
          </div>
          {errors.terms && <div className="error-text">{errors.terms}</div>}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={prevStep} icon={<FaArrowLeft />}>
            Voltar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Registrando..." : "Concluir Registro"}
          </Button>
        </div>
      </>
  )

  return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>
              <FaShieldAlt /> Registro
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </form>

          <div className="register-footer">
            <p>
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
  )
}

export default Register
