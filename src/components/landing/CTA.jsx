import { Link } from "react-router-dom"

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-5">Proteja sua empresa contra ameaças da dark web</h2>
          <p className="text-xl mb-10 opacity-90">Comece hoje mesmo a monitorar e proteger seus dados sensíveis</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 text-lg font-medium bg-white text-blue-700 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Começar agora
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
                className="transition-transform group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-lg font-medium border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-center"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5 -mb-24 -mr-24"></div>
    </section>
  )
}

export default CTA
