import type React from "react"

const ThreatMap: React.FC = () => {
  return (
    <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center">
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Mapa Global de Ameaças</h3>
        <p className="text-slate-300">Visualização em tempo real de ameaças detectadas</p>
        <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-red-600/20 p-4 rounded">
            <div className="text-red-400 font-bold">1,247</div>
            <div>Ameaças Ativas</div>
          </div>
          <div className="bg-yellow-600/20 p-4 rounded">
            <div className="text-yellow-400 font-bold">89</div>
            <div>Alertas Críticos</div>
          </div>
          <div className="bg-green-600/20 p-4 rounded">
            <div className="text-green-400 font-bold">99.2%</div>
            <div>Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreatMap
