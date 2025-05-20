"use client"

import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { FaHome, FaSearch, FaCreditCard, FaCog, FaSignOutAlt, FaBars, FaUser, FaBell } from "react-icons/fa"
import "../styles/user-layout.css"

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="user-layout">
      <header className="user-header">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Deep Protexion</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`
              }
            >
              <FaHome className="text-lg" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/user/search"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`
              }
            >
              <FaSearch className="text-lg" />
              <span>Pesquisar</span>
            </NavLink>
            <NavLink
              to="/user/plans"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`
              }
            >
              <FaCreditCard className="text-lg" />
              <span>Planos</span>
            </NavLink>
            <NavLink
              to="/user/settings"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`
              }
            >
              <FaCog className="text-lg" />
              <span>Configurações</span>
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-primary">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-gray-600" />
                </div>
                <span className="hidden md:block">{user?.username || "Usuário"}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/user/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button className="md:hidden text-gray-600" onClick={toggleMenu}>
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <div className="container mx-auto px-4 py-2">
              <NavLink
                to="/user/dashboard"
                className={`block py-2 ${
                  location.pathname === "/user/dashboard" ? "text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaHome />
                  <span>Dashboard</span>
                </div>
              </NavLink>
              <NavLink
                to="/user/search"
                className={`block py-2 ${
                  location.pathname === "/user/search" ? "text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaSearch />
                  <span>Pesquisar</span>
                </div>
              </NavLink>
              <NavLink
                to="/user/plans"
                className={`block py-2 ${
                  location.pathname === "/user/plans" ? "text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaCreditCard />
                  <span>Planos</span>
                </div>
              </NavLink>
              <NavLink
                to="/user/settings"
                className={`block py-2 ${
                  location.pathname === "/user/settings" ? "text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaCog />
                  <span>Configurações</span>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-gray-600 border-t border-gray-200 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <FaSignOutAlt />
                  <span>Sair</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="user-main">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      <footer className="user-footer">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Deep Protexion. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}

export default UserLayout
