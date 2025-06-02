"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Search,
  Bell,
  Lock,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Menu,
  X,
  Star,
  Users,
  Zap,
  Eye,
  Play,
} from "lucide-react"

// Animação para elementos que aparecem ao rolar
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)

  // Dados para FAQ
  const faqItems = [
    {
      question: "O que é o BreachHawk e como ele funciona?",
      answer:
        "BreachHawk é uma plataforma de monitoramento de vazamentos de dados que utiliza IA avançada para detectar e alertar sobre possíveis vazamentos de dados da sua empresa na internet, dark web e fóruns de hackers. Nosso sistema monitora 24/7 e envia alertas em tempo real quando detecta informações sensíveis expostas.",
    },
    {
      question: "Quanto tempo leva para implementar o BreachHawk?",
      answer:
        "A implementação do BreachHawk é rápida e simples, levando em média 5 minutos para configuração inicial. Nossa equipe de suporte está disponível para auxiliar em todo o processo, garantindo que você esteja protegido o mais rápido possível.",
    },
    {
      question: "O BreachHawk é compatível com meus sistemas atuais?",
      answer:
        "Sim, o BreachHawk foi projetado para integrar facilmente com a maioria dos sistemas e plataformas empresariais. Temos APIs e conectores para os principais serviços de nuvem, sistemas de gerenciamento de dados e ferramentas de segurança do mercado.",
    },
    {
      question: "Como o BreachHawk me ajuda a cumprir a LGPD?",
      answer:
        "O BreachHawk auxilia no cumprimento da LGPD ao detectar vazamentos de dados rapidamente, permitindo que você notifique os titulares e a ANPD dentro do prazo legal. Além disso, fornecemos relatórios detalhados que podem ser usados como evidência de monitoramento contínuo e resposta a incidentes.",
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer:
        "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Oferecemos planos flexíveis que se adaptam às necessidades da sua empresa, sem contratos de longo prazo obrigatórios.",
    },
  ]

  // Dados para benefícios
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Proteção Contínua",
      description: "Monitoramento 24/7 da dark web e fóruns de hackers para detectar vazamentos de dados.",
    },
    {
      icon: <Bell className="h-8 w-8 text-red-600" />,
      title: "Alertas em Tempo Real",
      description: "Receba notificações instantâneas quando seus dados forem encontrados em vazamentos.",
    },
    {
      icon: <Zap className="h-8 w-8 text-red-600" />,
      title: "Resposta Rápida",
      description: "Ferramentas e orientações para mitigar danos e proteger sua empresa após um vazamento.",
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: "Conformidade LGPD",
      description: "Mantenha-se em conformidade com regulamentações de proteção de dados automaticamente.",
    },
  ]

  // Dados para recursos
  const features = [
    {
      icon: <Eye className="h-8 w-8 text-white" />,
      title: "Monitoramento Avançado",
      description:
        "Nossa tecnologia de IA escaneia continuamente a internet, dark web e fóruns de hackers em busca de dados vazados da sua empresa.",
    },
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Detecção Precisa",
      description:
        "Algoritmos avançados identificam dados sensíveis com 99.9% de precisão, eliminando falsos positivos.",
    },
    {
      icon: <Lock className="h-8 w-8 text-white" />,
      title: "Proteção de Credenciais",
      description: "Monitore senhas, credenciais e acessos comprometidos para evitar invasões e acesso não autorizado.",
    },
  ]

  // Dados para depoimentos
  const testimonials = [
    {
      quote:
        "O BreachHawk detectou um vazamento de dados crítico em nossa empresa antes mesmo que soubéssemos que havia ocorrido. Isso nos poupou de uma multa potencial de R$ 2 milhões e danos à nossa reputação.",
      author: "Maria Silva",
      position: "CTO, TechCorp",
      rating: 5,
    },
    {
      quote:
        "A implementação foi incrivelmente rápida e o suporte é excepcional. Em apenas uma semana, já identificamos e corrigimos várias vulnerabilidades que não sabíamos que existiam.",
      author: "João Santos",
      position: "CISO, FinanceMax",
      rating: 5,
    },
    {
      quote:
        "Como responsável pela segurança de dados de uma grande empresa, o BreachHawk me dá tranquilidade. O dashboard é intuitivo e os alertas são precisos e acionáveis.",
      author: "Ana Costa",
      position: "DPO, DataSecure",
      rating: 5,
    },
  ]

  // Efeito para animações ao rolar
  useEffect(() => {
    // Inicializar animações e outros scripts
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in-element")
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("active")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Trigger on initial load

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Shield className="text-red-600 h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">BreachHawk</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Recursos
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                Como Funciona
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Preços
              </a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Registrar
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recursos
                </a>
                <a
                  href="#how-it-works"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Como Funciona
                </a>
                <a
                  href="#pricing"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Preços
                </a>
                <a
                  href="#faq"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Registrar
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-red-100 text-red-800 border-red-200">
              🚨 Mais de 10 bilhões de dados vazaram em 2024
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Proteja sua empresa de
              <span className="text-red-600 block">vazamentos de dados</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Monitore, detecte e responda a violações de dados em tempo real. BreachHawk protege sua reputação e evita
              multas milionárias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                <Shield className="mr-2 h-5 w-5" />
                Começar Proteção Gratuita
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo (2 min)
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Suporte 24/7
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="BreachHawk Dashboard"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 mb-8">Confiado por mais de 500+ empresas</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center">
                <Image
                  src={`/placeholder.svg?height=60&width=120`}
                  alt={`Logo empresa ${i}`}
                  width={120}
                  height={60}
                  className="mx-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Por que escolher o BreachHawk?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nossa plataforma oferece proteção completa contra vazamentos de dados com recursos exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-8">
                    <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                      {benefit.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Recursos Poderosos</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tecnologia de ponta para proteger seus dados mais valiosos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <div className="bg-slate-700/50 backdrop-blur-sm p-8 rounded-lg border border-slate-600">
                  <div className="bg-red-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                  <ul className="mt-6 space-y-2">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                        <span className="text-slate-300">Recurso {item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Como Funciona</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nosso processo de monitoramento é simples, eficiente e totalmente automatizado para proteger seus dados
              24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FadeInWhenVisible delay={0.1}>
              <div className="relative">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 z-10 relative">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-red-200"></div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Monitoramento Contínuo</h3>
                  <p className="text-slate-600">
                    Nossos sistemas monitoram continuamente a dark web e fóruns de hackers em busca de menções às suas
                    palavras-chave.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <div className="relative">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 z-10 relative">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-red-200"></div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Alertas em Tempo Real</h3>
                  <p className="text-slate-600">
                    Receba alertas imediatos quando detectamos vazamentos potenciais relacionados à sua empresa ou
                    dados.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <div className="relative">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Ação Rápida</h3>
                  <p className="text-slate-600">
                    Com informações detalhadas sobre o vazamento, você pode tomar medidas imediatas para mitigar riscos
                    e proteger seus dados.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
              Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <FadeInWhenVisible>
              <div>
                <motion.h3
                  className="text-5xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  500+
                </motion.h3>
                <p className="text-red-100">Clientes Protegidos</p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1}>
              <div>
                <motion.h3
                  className="text-5xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  10.000+
                </motion.h3>
                <p className="text-red-100">Vazamentos Detectados</p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <div>
                <motion.h3
                  className="text-5xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  24/7
                </motion.h3>
                <p className="text-red-100">Monitoramento Contínuo</p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <div>
                <motion.h3
                  className="text-5xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  99.9%
                </motion.h3>
                <p className="text-red-100">Precisão de Detecção</p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Preços transparentes</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FadeInWhenVisible>
              <Card className="border-2 border-slate-200 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                  <p className="text-slate-600 mb-6">Para pequenas empresas</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">R$ 299</span>
                    <span className="text-slate-600">/mês</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Até 10.000 registros
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Monitoramento básico
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Alertas por email
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Suporte por email
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Começar teste grátis
                  </Button>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1}>
              <Card className="border-2 border-red-600 relative h-full transform hover:scale-105 transition-transform">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-600 text-white">Mais Popular</Badge>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                  <p className="text-slate-600 mb-6">Para empresas em crescimento</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">R$ 799</span>
                    <span className="text-slate-600">/mês</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Até 100.000 registros
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Monitoramento avançado
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Resposta automática
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Suporte 24/7
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Relatórios LGPD
                    </li>
                  </ul>
                  <Button className="w-full bg-red-600 hover:bg-red-700">Começar teste grátis</Button>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="border-2 border-slate-200 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <p className="text-slate-600 mb-6">Para grandes corporações</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">Custom</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Registros ilimitados
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      IA personalizada
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Integração dedicada
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Gerente de conta
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      SLA garantido
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Falar com vendas
                  </Button>
                </CardContent>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">O que nossos clientes dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg?height=48&width=48"
                        alt="Cliente"
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.author}</p>
                        <p className="text-sm text-slate-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Respostas para as dúvidas mais comuns sobre o BreachHawk
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.05}>
                <div className="mb-4">
                  <button
                    className={`flex justify-between items-center w-full p-6 text-left ${
                      activeQuestion === index ? "bg-red-50 rounded-t-lg" : "bg-white rounded-lg"
                    } border border-slate-200 hover:bg-red-50 transition-colors`}
                    onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-500 transition-transform ${
                        activeQuestion === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeQuestion === index && (
                    <div className="p-6 bg-white border-x border-b rounded-b-lg border-slate-200">
                      <p className="text-slate-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Não espere o próximo vazamento acontecer</h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Comece sua proteção hoje mesmo. Teste grátis por 14 dias, sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-slate-100 text-lg px-8 py-4">
                <Shield className="mr-2 h-5 w-5" />
                Começar Proteção Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4"
              >
                Agendar Demo
              </Button>
            </div>
            <p className="text-red-100 text-sm mt-6">
              ✓ Setup em 5 minutos ✓ Sem cartão de crédito ✓ Suporte em português
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-2xl font-bold">BreachHawk</span>
              </div>
              <p className="text-slate-400 mb-6">Protegendo empresas contra vazamentos de dados desde 2020.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Twitter
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrações
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 BreachHawk. Todos os direitos reservados.</p>
            <div className="flex space-x-6 text-sm text-slate-400 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Termos
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                LGPD
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
