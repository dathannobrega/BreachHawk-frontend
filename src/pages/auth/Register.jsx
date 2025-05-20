"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaShieldAlt, FaUser, FaEnvelope, FaLock, FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa"
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

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório"
    } else if (formData.username.length < 4) {
      newErrors.username = "Nome de usuário deve ter pelo menos 4 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}

    if (!formData.terms) {
      newErrors.terms = "Você deve aceitar os termos e condições"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step === 3 && validateStep3()) {
      setLoading(true)

      try {
        // Simulação de registro
        register({
          username: formData.username,
          email: formData.email,
          role: "user",
          name: `${formData.firstName} ${formData.lastName}`,
          company: formData.company,
          plan: formData.plan,
        })

        // Redirecionar para o dashboard do usuário
        navigate("/user/dashboard")
      } catch (err) {
        setErrors({
          submit: "Erro ao registrar. Tente novamente.",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const renderStep1 = () => (
    <>
      <h2 className="step-title">Informações de Conta</h2>

      <div className="form-group">
        <label htmlFor="username">
          <FaUser className="input-icon" />
          Nome de Usuário
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Digite seu nome de usuário"
          className={errors.username ? "error" : ""}
        />
        {errors.username && <div className="error-text">{errors.username}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          <FaEnvelope className="input-icon" />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu email"
          className={errors.email ? "error" : ""}
        />
        {errors.email && <div className="error-text">{errors.email}</div>}
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
          placeholder="Digite sua senha"
          className={errors.password ? "error" : ""}
        />
        {errors.password && <div className="error-text">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">
          <FaLock className="input-icon" />
          Confirmar Senha
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirme sua senha"
          className={errors.confirmPassword ? "error" : ""}
        />
        {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
      </div>

      <div className="form-actions">
        <Button type="button" variant="primary" onClick={nextStep} icon={<FaArrowRight />}>
          Próximo
        </Button>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <h2 className="step-title">Informações Pessoais</h2>

      <div className="form-group">
        <label htmlFor="firstName">Nome</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Digite seu nome"
          className={errors.firstName ? "error" : ""}
        />
        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Sobrenome</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Digite seu sobrenome"
          className={errors.lastName ? "error" : ""}
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
          placeholder="Digite o nome da sua empresa"
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

  const renderStep3 = () => (
    <>
      <h2 className="step-title">Escolha seu Plano</h2>

      <div className="plan-options">
        <div
          className={`plan-option ${formData.plan === "basic" ? "selected" : ""}`}
          onClick={() => handleChange({ target: { name: "plan", value: "basic" } })}
        >
          <div className="plan-header">
            <h3>Básico</h3>
            <div className="plan-price">
              <span className="price">R$ 99</span>
              <span className="period">/mês</span>
            </div>
          </div>
          <div className="plan-features">
            <ul>
              <li>
                <FaCheck /> Monitoramento de 5 palavras-chave
              </li>
              <li>
                <FaCheck /> Alertas por email
              </li>
              <li>
                <FaCheck /> Relatórios mensais
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`plan-option ${formData.plan === "pro" ? "selected" : ""}`}
          onClick={() => handleChange({ target: { name: "plan", value: "pro" } })}
        >
          <div className="plan-header">
            <h3>Profissional</h3>
            <div className="plan-price">
              <span className="price">R$ 199</span>
              <span className="period">/mês</span>
            </div>
          </div>
          <div className="plan-features">
            <ul>
              <li>
                <FaCheck /> Monitoramento de 20 palavras-chave
              </li>
              <li>
                <FaCheck /> Alertas por email e SMS
              </li>
              <li>
                <FaCheck /> Relatórios semanais
              </li>
              <li>
                <FaCheck /> Suporte prioritário
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`plan-option ${formData.plan === "enterprise" ? "selected" : ""}`}
          onClick={() => handleChange({ target: { name: "plan", value: "enterprise" } })}
        >
          <div className="plan-header">
            <h3>Empresarial</h3>
            <div className="plan-price">
              <span className="price">R$ 499</span>
              <span className="period">/mês</span>
            </div>
          </div>
          <div className="plan-features">
            <ul>
              <li>
                <FaCheck /> Monitoramento ilimitado de palavras-chave
              </li>
              <li>
                <FaCheck /> Alertas personalizados
              </li>
              <li>
                <FaCheck /> Relatórios diários
              </li>
              <li>
                <FaCheck /> Suporte 24/7
              </li>
              <li>
                <FaCheck /> API de integração
              </li>
            </ul>
          </div>
        </div>
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
            Eu li e concordo com os <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
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
          <div className="register-logo">
            <FaShieldAlt className="logo-icon" />
            <h1>Deep Protexion</h1>
          </div>
          <p className="register-subtitle">Crie sua conta para começar</p>
        </div>

        <div className="register-progress">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Conta</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Perfil</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Plano</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
