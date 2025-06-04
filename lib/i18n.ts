export const translations = {
  pt: {
    nav: {
      features: "Recursos",
      pricing: "Preços",
      docs: "Documentação",
      github: "GitHub",
      login: "Login",
      getStarted: "Começar",
    },
    hero: {
      title: "Proteja sua empresa contra",
      titleHighlight: "ameaças digitais",
      titleEnd: "na dark web",
      subtitle:
        "Plataforma open source de threat intelligence para monitoramento avançado de vazamentos de dados, credenciais e informações sensíveis em fóruns e marketplaces da dark web.",
      ctaPrimary: "Começar Gratuitamente",
      ctaSecondary: "Ver no GitHub",
      ctaCloud: "Versão Cloud",
      stats: {
        detection: "Taxa de detecção",
        monitoring: "Monitoramento",
        users: "Usuários ativos",
      },
    },
    features: {
      tag: "Recursos",
      title: "Tecnologia avançada para proteção completa",
      subtitle:
        "Nossa plataforma oferece um conjunto abrangente de ferramentas para monitorar, detectar e responder a ameaças digitais.",
      openSource: {
        title: "100% Open Source",
        description:
          "Código aberto, transparente e auditável. Contribua para o desenvolvimento e customize conforme suas necessidades.",
        points: [
          "Código fonte disponível no GitHub",
          "Comunidade ativa de desenvolvedores",
          "Instalação local completa",
        ],
      },
      monitoring: {
        title: "Monitoramento da Dark Web",
        description:
          "Acesse e monitore fóruns, marketplaces e sites da dark web em busca de informações sensíveis da sua empresa.",
        points: [
          "Acesso seguro a sites .onion via proxy Tor",
          "Monitoramento de fóruns e marketplaces clandestinos",
          "Detecção de credenciais vazadas e dados sensíveis",
        ],
      },
      detection: {
        title: "Detecção Avançada de Vazamentos",
        description:
          "Identifique vazamentos de dados relacionados à sua empresa com tecnologia de reconhecimento avançado.",
        points: [
          "Reconhecimento de padrões em dados estruturados",
          "Identificação de menções à sua marca e domínios",
          "Detecção de informações sensíveis em diversos formatos",
        ],
      },
    },
    pricing: {
      tag: "Preços",
      title: "Escolha a melhor opção para sua empresa",
      subtitle: "Comece gratuitamente com nossa versão open source ou acelere com nossa solução em cloud.",
      openSource: {
        name: "Open Source",
        price: "Gratuito",
        description: "Perfeito para desenvolvedores e pequenas equipes que querem começar.",
        features: [
          "Código fonte completo",
          "Instalação local",
          "Monitoramento básico",
          "Comunidade de suporte",
          "Documentação completa",
        ],
        cta: "Baixar Agora",
      },
      cloud: {
        name: "Cloud Pro",
        price: "R$ 299",
        period: "/mês",
        description: "Solução gerenciada com recursos avançados e suporte profissional.",
        features: [
          "Infraestrutura gerenciada",
          "Monitoramento 24/7",
          "Alertas em tempo real",
          "Suporte prioritário",
          "Backups automáticos",
          "SLA 99.9%",
        ],
        cta: "Começar Teste Grátis",
      },
      enterprise: {
        name: "Enterprise",
        price: "Personalizado",
        description: "Solução completa para grandes empresas com necessidades específicas.",
        features: [
          "Deployment on-premise ou cloud",
          "Customizações específicas",
          "Integração com SIEM",
          "Suporte 24/7 dedicado",
          "Consultoria especializada",
          "Treinamento da equipe",
        ],
        cta: "Falar com Vendas",
      },
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Documentation",
      github: "GitHub",
      login: "Login",
      getStarted: "Get Started",
    },
    hero: {
      title: "Protect your company against",
      titleHighlight: "digital threats",
      titleEnd: "on the dark web",
      subtitle:
        "Open source threat intelligence platform for advanced monitoring of data leaks, credentials and sensitive information in dark web forums and marketplaces.",
      ctaPrimary: "Start Free",
      ctaSecondary: "View on GitHub",
      ctaCloud: "Cloud Version",
      stats: {
        detection: "Detection rate",
        monitoring: "Monitoring",
        users: "Active users",
      },
    },
    features: {
      tag: "Features",
      title: "Advanced technology for complete protection",
      subtitle: "Our platform offers a comprehensive set of tools to monitor, detect and respond to digital threats.",
      openSource: {
        title: "100% Open Source",
        description:
          "Open, transparent and auditable code. Contribute to development and customize according to your needs.",
        points: ["Source code available on GitHub", "Active developer community", "Complete local installation"],
      },
      monitoring: {
        title: "Dark Web Monitoring",
        description:
          "Access and monitor forums, marketplaces and dark web sites for sensitive information about your company.",
        points: [
          "Secure access to .onion sites via Tor proxy",
          "Monitoring of clandestine forums and marketplaces",
          "Detection of leaked credentials and sensitive data",
        ],
      },
      detection: {
        title: "Advanced Leak Detection",
        description: "Identify data leaks related to your company with advanced recognition technology.",
        points: [
          "Pattern recognition in structured data",
          "Identification of mentions to your brand and domains",
          "Detection of sensitive information in various formats",
        ],
      },
    },
    pricing: {
      tag: "Pricing",
      title: "Choose the best option for your company",
      subtitle: "Start free with our open source version or accelerate with our cloud solution.",
      openSource: {
        name: "Open Source",
        price: "Free",
        description: "Perfect for developers and small teams who want to get started.",
        features: [
          "Complete source code",
          "Local installation",
          "Basic monitoring",
          "Community support",
          "Complete documentation",
        ],
        cta: "Download Now",
      },
      cloud: {
        name: "Cloud Pro",
        price: "$99",
        period: "/month",
        description: "Managed solution with advanced features and professional support.",
        features: [
          "Managed infrastructure",
          "24/7 monitoring",
          "Real-time alerts",
          "Priority support",
          "Automatic backups",
          "99.9% SLA",
        ],
        cta: "Start Free Trial",
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        description: "Complete solution for large companies with specific needs.",
        features: [
          "On-premise or cloud deployment",
          "Specific customizations",
          "SIEM integration",
          "24/7 dedicated support",
          "Specialized consulting",
          "Team training",
        ],
        cta: "Contact Sales",
      },
    },
  },
}

export type Language = "pt" | "en"
export type TranslationKey = keyof typeof translations.pt
