"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Globe, Menu, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  // Verificação de segurança para garantir que t está disponível
  if (!t || !t.nav) {
    return (
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BreachHawk
              </h1>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BreachHawk
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.pricing}
            </a>
            <a href="#docs" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.docs}
            </a>
            <a
              href="https://github.com/breachhawk/breachhawk"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              {t.nav.github}
            </a>
          </nav>

          {/* Language Selector & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "pt" | "en")}
                className="bg-transparent border-none text-sm focus:outline-none cursor-pointer"
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
              </select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")}>
              {t.nav.login}
            </Button>
            <Button size="sm" onClick={() => (window.location.href = "/register")}>
              {t.nav.getStarted}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                {t.nav.features}
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                {t.nav.pricing}
              </a>
              <a href="#docs" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                {t.nav.docs}
              </a>
              <a
                href="https://github.com/breachhawk/breachhawk"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                {t.nav.github}
              </a>
              <div className="flex items-center gap-2 px-3 py-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "pt" | "en")}
                  className="bg-transparent border-none text-sm focus:outline-none"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => (window.location.href = "/login")}>
                  {t.nav.login}
                </Button>
                <Button size="sm" className="w-full">
                  {t.nav.getStarted}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
