import "../../styles/landing/benefits.css"

const Benefits = () => {
  const benefits = [
    {
      icon: "🔍",
      title: "Monitoramento Contínuo",
      description:
        "Vigilância 24/7 de fóruns, marketplaces e sites da dark web para identificar vazamentos de dados em tempo real.",
    },
    {
      icon: "⚡",
      title: "Alertas Instantâneos",
      description:
        "Receba notificações imediatas quando informações sensíveis da sua empresa forem detectadas em ambientes não autorizados.",
    },
    {
      icon: "🛡️",
      title: "Proteção Proativa",
      description:
        "Identifique ameaças antes que se tornem violações de dados, permitindo ações preventivas para proteger sua empresa.",
    },
    {
      icon: "📊",
      title: "Análise de Risco",
      description:
        "Avaliações detalhadas de vulnerabilidades e exposições para priorizar ações de segurança com base em dados concretos.",
    },
    {
      icon: "🔐",
      title: "Segurança Avançada",
      description:
        "Tecnologia de ponta para navegar com segurança em ambientes digitais perigosos sem expor sua infraestrutura.",
    },
    {
      icon: "📱",
      title: "Acesso Multiplataforma",
      description:
        "Monitore e gerencie a segurança da sua empresa de qualquer lugar, em qualquer dispositivo, com nossa interface responsiva.",
    },
  ]

  return (
    <section className="benefits" id="benefits">
      <div className="benefits-container">
        <div className="section-header">
          <span className="section-tag">Benefícios</span>
          <h2 className="section-title">Por que escolher nossa solução?</h2>
          <p className="section-description">
            Nossa plataforma oferece vantagens exclusivas para proteger sua empresa contra ameaças digitais emergentes.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
