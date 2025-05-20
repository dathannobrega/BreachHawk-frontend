"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { FaShieldAlt, FaSearch, FaBell, FaLock, FaArrowRight } from "react-icons/fa"
import "../styles/pages/landing-page.css"

// Componentes da landing page
import Hero from "../components/landing/Hero.jsx"
import Benefits from "../components/landing/Benefits.jsx"
import Features from "../components/landing/Features.jsx"
import Pricing from "../components/landing/Pricing.jsx"
import Testimonials from "../components/landing/Testimonials.jsx"
import FAQ from "../components/landing/FAQ.jsx"
import CTA from "../components/landing/CTA.jsx"
import Footer from "../components/landing/Footer.jsx"

const LandingPage = () => {
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
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <FaShieldAlt className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold">Deep Protexion</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">
                Recursos
              </a>
              <a href="#how-it-works" className="nav-link">
                Como Funciona
              </a>
              <a href="#pricing" className="nav-link">
                Preços
              </a>
              <a href="#faq" className="nav-link">
                FAQ
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-outline-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary-sm">
                Registrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Benefits Section */}
      <Benefits />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nosso processo de monitoramento é simples, eficiente e totalmente automatizado para proteger seus dados
              24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center fade-in-element">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">1. Monitoramento Contínuo</h3>
              <p className="text-gray-600">
                Nossos sistemas monitoram continuamente a dark web e fóruns de hackers em busca de menções às suas
                palavras-chave.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center fade-in-element">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBell className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">2. Alertas em Tempo Real</h3>
              <p className="text-gray-600">
                Receba alertas imediatos quando detectamos vazamentos potenciais relacionados à sua empresa ou dados.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center fade-in-element">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLock className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">3. Ação Rápida</h3>
              <p className="text-gray-600">
                Com informações detalhadas sobre o vazamento, você pode tomar medidas imediatas para mitigar riscos e
                proteger seus dados.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/register" className="btn-primary">
              Comece Agora <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="fade-in-element">
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-primary-light">Clientes Protegidos</p>
            </div>
            <div className="fade-in-element">
              <h3 className="text-4xl font-bold mb-2">10.000+</h3>
              <p className="text-primary-light">Vazamentos Detectados</p>
            </div>
            <div className="fade-in-element">
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-primary-light">Monitoramento Contínuo</p>
            </div>
            <div className="fade-in-element">
              <h3 className="text-4xl font-bold mb-2">99.9%</h3>
              <p className="text-primary-light">Precisão de Detecção</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
