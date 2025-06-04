"use client"

import { Github, Twitter, Linkedin, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { language, setLanguage } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">BreachHawk</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              {language === "pt"
                ? "Plataforma open source de threat intelligence para monitoramento avançado da dark web."
                : "Open source threat intelligence platform for advanced dark web monitoring."}
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/breachhawk" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/breachhawk" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/breachhawk"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{language === "pt" ? "Produto" : "Product"}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Recursos" : "Features"}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Preços" : "Pricing"}
                </a>
              </li>
              <li>
                <a href="/docs" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Documentação" : "Documentation"}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/breachhawk/breachhawk"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{language === "pt" ? "Empresa" : "Company"}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Sobre" : "About"}
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Contato" : "Contact"}
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  {language === "pt" ? "Carreiras" : "Careers"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BreachHawk.{" "}
            {language === "pt" ? "Todos os direitos reservados." : "All rights reserved."}
          </p>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "pt" | "en")}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
