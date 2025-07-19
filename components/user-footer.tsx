export function UserFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} BreachHawk. Todos os direitos reservados.</p>
        <div className="flex items-center space-x-4">
          <a href="/privacy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            Privacidade
          </a>
          <a href="/terms" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            Termos
          </a>
        </div>
      </div>
    </footer>
  )
}

export default UserFooter
