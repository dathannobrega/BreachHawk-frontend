import "../../styles/landing/testimonials.css"

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "O Deep Protexion transformou nossa abordagem de segurança. Identificamos e mitigamos um vazamento de dados crítico antes que causasse danos à nossa empresa.",
      author: "Carlos Silva",
      position: "CISO, Empresa de Tecnologia",
      avatar: "/images/testimonial-1.jpg",
    },
    {
      quote:
        "A facilidade de uso e a precisão das detecções são impressionantes. Conseguimos uma visibilidade sem precedentes sobre nossas vulnerabilidades na dark web.",
      author: "Ana Rodrigues",
      position: "Diretora de Segurança, Instituição Financeira",
      avatar: "/images/testimonial-2.jpg",
    },
    {
      quote:
        "O suporte técnico é excepcional. A equipe nos ajudou a interpretar alertas complexos e implementar medidas preventivas que fortaleceram nossa postura de segurança.",
      author: "Marcos Oliveira",
      position: "Gerente de TI, Empresa de Saúde",
      avatar: "/images/testimonial-3.jpg",
    },
  ]

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>O que nossos clientes dizem</h2>
          <p>Empresas que confiam no Deep Protexion para sua segurança cibernética</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-quote">
                <i className="fas fa-quote-left"></i>
                <p>{testimonial.quote}</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="trusted-by">
          <p>Empresas que confiam em nós:</p>
          <div className="trusted-logos">
            <img src="/images/company-logo-1.svg" alt="Company 1" />
            <img src="/images/company-logo-2.svg" alt="Company 2" />
            <img src="/images/company-logo-3.svg" alt="Company 3" />
            <img src="/images/company-logo-4.svg" alt="Company 4" />
            <img src="/images/company-logo-5.svg" alt="Company 5" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
