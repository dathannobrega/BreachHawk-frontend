import "../../styles/landing/features.css"

const Features = () => {
  const features = [
    {
      title: "Monitoramento da Dark Web",
      description:
        "Acesse e monitore fóruns, marketplaces e sites da dark web em busca de informações sensíveis da sua empresa.",
      image: "/images/feature-darkweb.png",
      points: [
        "Acesso seguro a sites .onion via proxy Tor",
        "Monitoramento de fóruns e marketplaces clandestinos",
        "Detecção de credenciais vazadas e dados sensíveis",
      ],
    },
    {
      title: "Detecção Avançada de Vazamentos",
      description:
        "Identifique vazamentos de dados relacionados à sua empresa com tecnologia de reconhecimento avançado.",
      image: "/images/feature-detection.png",
      points: [
        "Reconhecimento de padrões em dados estruturados e não-estruturados",
        "Identificação de menções à sua marca e domínios",
        "Detecção de informações sensíveis em diversos formatos",
      ],
    },
    {
      title: "Gestão de Incidentes",
      description: "Gerencie e responda rapidamente a incidentes de segurança com nosso sistema integrado.",
      image: "/images/feature-incidents.png",
      points: [
        "Fluxo de trabalho para triagem e resposta a incidentes",
        "Categorização e priorização automática de ameaças",
        "Histórico completo de incidentes e ações tomadas",
      ],
    },
  ]

  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="section-header">
          <span className="section-tag">Recursos</span>
          <h2 className="section-title">Tecnologia avançada para proteção completa</h2>
          <p className="section-description">
            Nossa plataforma oferece um conjunto abrangente de ferramentas para monitorar, detectar e responder a
            ameaças digitais.
          </p>
        </div>

        <div className="features-list">
          {features.map((feature, index) => (
            <div className={`feature-item ${index % 2 !== 0 ? "feature-reverse" : ""}`} key={index}>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-points">
                  {feature.points.map((point, i) => (
                    <li key={i} className="feature-point">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feature-check"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feature-image-container">
                <img
                  src={feature.image || "/images/feature-placeholder.png"}
                  alt={feature.title}
                  className="feature-image"
                />
                <div className="feature-image-bg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
