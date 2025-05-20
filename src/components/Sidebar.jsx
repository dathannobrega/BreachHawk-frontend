"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import "../styles/sidebar.css"

// Icons
import {
  FaShieldAlt,
  FaTachometerAlt,
  FaGlobe,
  FaKey,
  FaSpider,
  FaExclamationTriangle,
  FaTasks,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa"

const Sidebar = ({ collapsed }) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FaShieldAlt />
          {!collapsed && <h1>Deep Protexion</h1>}
        </div>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/sites" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaGlobe />
            {!collapsed && <span>Sites</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/keywords" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaKey />
            {!collapsed && <span>Palavras-chave</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/scrape-runs" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaSpider />
            {!collapsed && <span>Execuções</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/leaks" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaExclamationTriangle />
            {!collapsed && <span>Vazamentos</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaTasks />
            {!collapsed && <span>Tarefas</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaCog />
            {!collapsed && <span>Configurações</span>}
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button className="btn btn-outline" onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </nav>
  )
}

export default Sidebar
