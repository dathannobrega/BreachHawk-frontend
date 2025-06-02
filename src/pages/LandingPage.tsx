"use client"

import React, { Suspense } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, CheckCircle, ArrowRight, Play, Search, Bell, Lock, Star } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Header } from "@/components/organisms/Header/Header"

// Lazy load components for better performance
const ThreatMap = React.lazy(() => import("@/components/organisms/ThreatMap/ThreatMap"))

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Eye className="h-8 w-8 text-red-600" />,
      title: "Monitoramento Dark Web",
      description: "Monitore continuamente a dark web em busca de dados vazados da sua organização.",
    },
    {
      icon: <Search className="h-8 w-8 text-red-600" />,
      title: "Threat Intelligence",
      description: "Inteligência de ameaças em tempo real com análise avançada de IOCs e TTPs.",
    },
    {
      icon: <Bell className="h-8 w-8 text-red-600" />,
      title: "Alertas Inteligentes",
      description: "Receba notificações instantâneas sobre ameaças relevantes para sua organização.",
    },
    {
      icon: <Lock className="h-8 w-8 text-red-600" />,
      title: "Proteção de Credenciais",
      description: "Detecte credenciais comprometidas antes que sejam usadas contra você.",
    },
  ]

  const stats = [
    { value: "10M+", label: "Ameaças Detectadas" },
    { value: "500+", label: "Organizações Protegidas" },
    { value: "24/7", label: "Monitoramento Contínuo" },
    { value: "99.9%", label: "Precisão de Detecção" },
  ]

  const testimonials = [
    {
      quote: "A plataforma nos ajudou a detectar um vazamento de dados crítico antes que causasse danos maiores.",
      author: "Maria Silva",
      position: "CISO, TechCorp",
      rating: 5,
    },
    {
      quote: "Interface intuitiva e alertas precisos. Essencial para nossa estratégia de segurança.",
      author: "João Santos",
      position: "Analista de Segurança, FinanceMax",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-red-100 text-red-800 border-red-200">
              🚨 Nova geração de Threat Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Proteja sua organização com
              <span className="text-red-600 block">inteligência de ameaças</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Monitore a dark web, detecte ameaças emergentes e proteja seus ativos digitais com nossa plataforma de
              Threat Intelligence de última geração.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                <Shield className="mr-2 h-5 w-5" />
                {isAuthenticated ? "Acessar Dashboard" : "Começar Agora"}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo (3 min)
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Teste gratuito 14 dias
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Suporte especializado
              </div>
            </div>
          </div>

          {/* Threat Map Preview */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
                    </div>
                  }
                >
                  <ThreatMap />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Recursos Avançados de Threat Intelligence
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nossa plataforma oferece as ferramentas mais avançadas para detectar, analisar e responder a ameaças
              cibernéticas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Como Funciona</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Processo automatizado de coleta, análise e distribuição de inteligência de ameaças.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Coleta de Dados</h3>
              <p className="text-slate-600">
                Coletamos dados de múltiplas fontes: dark web, fóruns, feeds de ameaças e honeypots distribuídos
                globalmente.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Análise Inteligente</h3>
              <p className="text-slate-600">
                Nossa IA analisa e correlaciona dados, identificando padrões e ameaças relevantes para sua organização.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ação Imediata</h3>
              <p className="text-slate-600">
                Receba alertas contextualizados e recomendações de ação para mitigar ameaças antes que causem danos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <h3 className="text-5xl font-bold mb-2">{stat.value}</h3>
                <p className="text-red-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Confiado por Especialistas em Segurança
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Comece a Proteger sua Organização Hoje</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de organizações que confiam em nossa plataforma para proteger seus ativos digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
              <Shield className="mr-2 h-5 w-5" />
              Começar Teste Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4"
            >
              Falar com Especialista
            </Button>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            ✓ 14 dias grátis ✓ Sem cartão de crédito ✓ Suporte especializado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-2xl font-bold">ThreatIntel</span>
              </div>
              <p className="text-slate-400 mb-6">
                Plataforma líder em Threat Intelligence para proteção de organizações contra ameaças cibernéticas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrações
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ThreatIntel. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
