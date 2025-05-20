import { Link } from "react-router-dom"
import "../../styles/landing/pricing.css"

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 499",
      period: "/mês",
      description: "Ideal para pequenas empresas que estão começando a monitorar ameaças digitais.",
      features: [
        "Monitoramento de até 3 domínios",
        "10 palavras-chave personalizadas",
        "Alertas por e-mail",
        "Relatórios mensais",
        "Suporte por e-mail",
      ],
      cta: "Começar agora",
      popular: false,
    },
    {
      name: "Profissional",
      price: "R$ 999",
      period: "/mês",
      description: "Perfeito para empresas em crescimento que precisam de proteção abrangente.",
      features: [
        "Monitoramento de até 10 domínios",
        "50 palavras-chave personalizadas",
        "Alertas em tempo real",
        "Relatórios semanais",
        "Suporte prioritário",
        "API de integração",
        "Dashboard personalizado",
      ],
      cta: "Escolher plano",
      popular: true,
    },
    {
      name: "Empresarial",
      price: "Personalizado",
      period: "",
      description: "Solução completa para grandes empresas com necessidades específicas de segurança.",
      features: [
        "Monitoramento ilimitado de domínios",
        "Palavras-chave ilimitadas",
        "Alertas em tempo real",
        "Relatórios personalizados",
        "Suporte 24/7 dedicado",
        "API avançada e integrações",
        "Consultoria de segurança",
        "Treinamento da equipe",
      ],
      cta: "Fale conosco",
      popular: false,
    },
  ]

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <div className="section-header">
          <span className="section-tag">Planos</span>
          <h2 className="section-title">Escolha o plano ideal para sua empresa</h2>
          <p className="section-description">
            Oferecemos soluções flexíveis para atender às necessidades de segurança de empresas de todos os tamanhos.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""}`} key={index}>
              {plan.popular && <div className="pricing-popular-tag">Mais popular</div>}
              <div className="pricing-header">
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price-container">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <p className="pricing-description">{plan.description}</p>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="pricing-feature">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="pricing-check"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pricing-cta">
                <Link to="/register" className={`btn ${plan.popular ? "btn-primary" : "btn-outline"} btn-block`}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-enterprise">
          <div className="enterprise-content">
            <h3 className="enterprise-title">Precisa de uma solução personalizada?</h3>
            <p className="enterprise-description">
              Entre em contato com nossa equipe para desenvolvermos um plano sob medida para as necessidades específicas
              da sua empresa.
            </p>
          </div>
          <Link to="/contact" className="btn btn-outline">
            Falar com especialista
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Pricing
