"use client"

import { Github, Twitter, Linkedin, Mail, Phone } from "lucide-react"

export default function UserFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BreachHawk</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Plataforma de threat intelligence para monitoramento avançado da dark web.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/breachhawk" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/breachhawk" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/breachhawk"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pesquisar
                </a>
              </li>
              <li>
                <a href="/leaks" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Vazamentos
                </a>
              </li>
              <li>
                <a href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Documentação
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>suporte@breachhawk.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+55 (11) 99999-9999</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BreachHawk. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
