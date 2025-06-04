"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Shield, Search, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Features() {
  const { t } = useLanguage()

  // Verificação de segurança para garantir que t e suas propriedades estão disponíveis
  if (!t || !t.features) {
    return (
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse bg-gray-200 h-6 w-24 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Verificação adicional para garantir que todas as propriedades necessárias existem
  if (!t.features.openSource || !t.features.monitoring || !t.features.detection) {
    return (
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              {t.features.tag || "Features"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.features.title || "Features"}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.features.subtitle || "Loading..."}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const features = [
    {
      icon: Github,
      title: t.features.openSource.title,
      description: t.features.openSource.description,
      points: t.features.openSource.points || [],
      gradient: "from-gray-600 to-gray-800",
    },
    {
      icon: Search,
      title: t.features.monitoring.title,
      description: t.features.monitoring.description,
      points: t.features.monitoring.points || [],
      gradient: "from-blue-600 to-purple-600",
    },
    {
      icon: Shield,
      title: t.features.detection.title,
      description: t.features.detection.description,
      points: t.features.detection.points || [],
      gradient: "from-green-600 to-teal-600",
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t.features.tag}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.features.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.features.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>

                <p className="text-gray-600 mb-6">{feature.description}</p>

                <ul className="space-y-3">
                  {feature.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
