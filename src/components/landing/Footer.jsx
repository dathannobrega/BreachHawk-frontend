import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">DeepProtexion</h3>
            <p className="mb-6 opacity-80 leading-relaxed">
              Monitoramento avançado da deep e dark web para proteger sua empresa contra ameaças cibernéticas.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-all"
              >
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
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-all"
              >
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
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-all"
              >
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
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-5">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#pricing" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="#testimonials" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-5">Empresa</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-5">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
                  Conformidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-60 text-sm">
            &copy; {new Date().getFullYear()} DeepProtexion. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/login" className="text-sm opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm opacity-80 hover:opacity-100 hover:text-blue-400 transition-colors">
              Cadastro
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
