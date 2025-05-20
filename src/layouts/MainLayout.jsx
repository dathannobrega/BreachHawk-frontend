"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar.jsx"
import Header from "../components/Header.jsx"
import "../styles/main-layout.css"

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="app-container">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="content-body">{children}</div>
      </div>
    </div>
  )
}

export default MainLayout
