"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ArrowRight, Cloud, Shield, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const Stat = ({ end, suffix }: { end: number; suffix: string }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = Math.max(1, Math.floor(end / 60))
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCurrent(end)
        clearInterval(timer)
      } else {
        setCurrent(start)
      }
    }, 15)
    return () => clearInterval(timer)
  }, [end])

  return (
    <span className="text-3xl font-bold text-blue-600">
      {current}
      {suffix}
    </span>
  )
}

export default function Hero() {
  const { t } = useLanguage()

  // Verificação de segurança para garantir que t e suas propriedades estão disponíveis
  if (!t || !t.hero) {
    return (
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="animate-pulse bg-gray-200 h-6 w-24 mb-6 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-12 w-3/4 mb-6 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-full mb-8 rounded"></div>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto mb-1 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-24 mx-auto rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="animate-pulse bg-gray-200 h-80 w-full rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6">
              🚀 Open Source Threat Intelligence
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>{" "}
              {t.hero.titleEnd}
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">{t.hero.subtitle}</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Github className="w-5 h-5 mr-2" />
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                <Cloud className="w-5 h-5 mr-2" />
                {t.hero.ctaCloud}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Stat end={98} suffix="%" />
                <p className="text-sm text-gray-600 mt-1">{t.hero.stats?.detection || "Detection Rate"}</p>
              </div>
              <div className="text-center">
                <Stat end={24} suffix="/7" />
                <p className="text-sm text-gray-600 mt-1">{t.hero.stats?.monitoring || "Monitoring"}</p>
              </div>
              <div className="text-center">
                <Stat end={1500} suffix="+" />
                <p className="text-sm text-gray-600 mt-1">{t.hero.stats?.users || "Active Users"}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="/placeholder.svg?height=400&width=600&text=BreachHawk+Dashboard"
                alt="BreachHawk Dashboard"
                className="w-full h-auto rounded-lg"
              />

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-float">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm font-semibold">Threat Detected</div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-float animation-delay-1000">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-semibold">Active Monitoring</div>
                    <div className="text-xs text-green-500">Online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
