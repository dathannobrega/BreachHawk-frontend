import type React from "react"

const FooterTemplate: React.FC = () => {
  return (
    <footer className="bg-blue-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} BreachHawk. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default FooterTemplate
