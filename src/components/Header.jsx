"use client"

import { useAuth } from "../context/AuthContext.jsx"
import { FaBars, FaUser } from "react-icons/fa"
import "../styles/header.css"

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth()

  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="user-menu">
        <span className="user-name">{user?.username || "Admin"}</span>
        <div className="user-avatar">
          <FaUser />
        </div>
      </div>
    </header>
  )
}

export default Header
