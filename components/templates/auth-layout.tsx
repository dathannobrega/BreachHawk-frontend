"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface AuthLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-slate-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">BreachHawk</CardTitle>
                  <p className="text-xs text-slate-500 font-medium">Threat Intelligence Platform</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="h-8 w-12 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === "pt" ? "EN" : "PT"}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <CardDescription className="text-slate-600">{description}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-8">{children}</CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© 2024 BreachHawk. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
