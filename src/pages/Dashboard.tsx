"use client"

import type React from "react"
import { Header } from "@/components/organisms/Header/Header"
import { useAuth } from "@/hooks/useAuth"

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showMenuButton />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bem-vindo, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Dashboard de Threat Intelligence - Monitore ameaças em tempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ameaças Ativas</h3>
            <p className="text-3xl font-bold text-red-600">1,247</p>
            <p className="text-sm text-slate-500">+12% desde ontem</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Alertas Críticos</h3>
            <p className="text-3xl font-bold text-yellow-600">89</p>
            <p className="text-sm text-slate-500">-5% desde ontem</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Fontes Monitoradas</h3>
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-slate-500">+3 novas fontes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Uptime</h3>
            <p className="text-3xl font-bold text-green-600">99.2%</p>
            <p className="text-sm text-slate-500">Últimos 30 dias</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ameaças Recentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-semibold text-slate-900">Malware detectado em fórum underground</h4>
                <p className="text-sm text-slate-600">
                  Nova variante de ransomware identificada com IOCs relacionados à sua organização
                </p>
                <p className="text-xs text-slate-500 mt-1">Há 2 horas</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
