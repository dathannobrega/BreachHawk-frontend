const FAQ = () => {
  const faqItems = [
    {
      question: "O que é o DeepProtexion?",
      answer:
        "DeepProtexion é uma plataforma de segurança cibernética especializada em monitorar a deep e dark web para detectar vazamentos de dados, informações confidenciais e ameaças direcionadas à sua organização.",
    },
    {
      question: "Como o DeepProtexion protege minha empresa?",
      answer:
        "Nossa plataforma utiliza tecnologia avançada para acessar fóruns, marketplaces e sites da deep e dark web, identificando menções à sua empresa, domínios, e-mails ou dados confidenciais, alertando você imediatamente quando detectamos um possível vazamento ou ameaça.",
    },
    {
      question: "Quais tipos de dados o DeepProtexion monitora?",
      answer:
        "Monitoramos uma ampla gama de dados, incluindo credenciais vazadas, informações de cartão de crédito, propriedade intelectual, documentos confidenciais, menções à sua marca ou executivos, e muito mais, conforme suas necessidades específicas.",
    },
    {
      question: "Quanto tempo leva para configurar o DeepProtexion?",
      answer:
        "A configuração inicial pode ser feita em minutos. Após o cadastro, você define as palavras-chave e domínios a serem monitorados, e nosso sistema começa a trabalhar imediatamente. Os primeiros resultados geralmente aparecem dentro de 24 horas.",
    },
    {
      question: "O DeepProtexion é legal?",
      answer:
        "Sim, o DeepProtexion opera dentro dos limites legais. Não realizamos atividades de hacking ou invasão. Nossa plataforma apenas monitora informações publicamente disponíveis, embora em áreas da internet de difícil acesso para usuários comuns.",
    },
    {
      question: "Preciso de conhecimento técnico para usar o DeepProtexion?",
      answer:
        "Não. Nossa interface foi projetada para ser intuitiva e fácil de usar, mesmo para usuários sem conhecimento técnico. Além disso, oferecemos suporte completo para ajudá-lo a configurar e interpretar os resultados.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Perguntas Frequentes</h2>
        <p className="text-lg text-gray-600 text-center mb-12">Tudo o que você precisa saber sobre nossa plataforma</p>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div
              className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
              key={index}
            >
              <button className="w-full p-5 text-left font-semibold text-gray-800 flex justify-between items-center hover:text-blue-600 transition-colors">
                {item.question}
                <span className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </button>
              <div className="max-h-0 overflow-hidden transition-all duration-300 faq-answer">
                <p className="p-5 pt-0 text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
