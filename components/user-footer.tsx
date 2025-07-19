import Link from "next/link"

export function UserFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-sm text-slate-600">© 2024 BreachHawk. Todos os direitos reservados.</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
              Termos
            </Link>
            <Link href="/support" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
              Suporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default UserFooter
