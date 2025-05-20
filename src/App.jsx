import { Routes, Route, Navigate } from "react-router-dom"

// Layouts
import MainLayout from "./layouts/MainLayout.jsx"
import AuthLayout from "./layouts/AuthLayout.jsx"
import UserLayout from "./layouts/UserLayout.jsx"

// Admin Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/Dashboard"
import Sites from "./pages/Sites"
import Keywords from "./pages/Keywords"
import ScrapeRuns from "./pages/ScrapeRuns"
import Leaks from "./pages/Leaks"
import Tasks from "./pages/Tasks"
import Settings from "./pages/Settings"

// User Pages
import UserDashboard from "./pages/user/UserDashboard"
import UserSettings from "./pages/user/UserSettings"
import UserPlans from "./pages/user/UserPlans"
import UserSearch from "./pages/user/UserSearch"

// Landing Page
import LandingPage from "./pages/LandingPage.jsx"
import "./styles/globals.css"

function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
            />
            <Route
                path="/register"
                element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                }
            />

            {/* Admin */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/sites" element={<MainLayout><Sites /></MainLayout>} />
            <Route path="/keywords" element={<MainLayout><Keywords /></MainLayout>} />
            <Route path="/leaks" element={<MainLayout><Leaks /></MainLayout>} />
            <Route path="/scrape-runs" element={<MainLayout><ScrapeRuns /></MainLayout>} />
            <Route path="/tasks" element={<MainLayout><Tasks /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />

            {/* Usuário final */}
            <Route path="/user/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
            <Route path="/user/settings" element={<UserLayout><UserSettings /></UserLayout>} />
            <Route path="/user/plans" element={<UserLayout><UserPlans /></UserLayout>} />
            <Route path="/user/search" element={<UserLayout><UserSearch /></UserLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
