"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, Github, Cloud, Building } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Pricing() {
  const { t } = useLanguage()

  const plans = [
    {
      icon: Github,
      name: t.pricing.openSource.name,
      price: t.pricing.openSource.price,
      period: "",
      description: t.pricing.openSource.description,
      features: t.pricing.openSource.features,
      cta: t.pricing.openSource.cta,
      popular: false,
      gradient: "from-gray-600 to-gray-800",
    },
    {
      icon: Cloud,
      name: t.pricing.cloud.name,
      price: t.pricing.cloud.price,
      period: t.pricing.cloud.period,
      description: t.pricing.cloud.description,
      features: t.pricing.cloud.features,
      cta: t.pricing.cloud.cta,
      popular: true,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      icon: Building,
      name: t.pricing.enterprise.name,
      price: t.pricing.enterprise.price,
      period: "",
      description: t.pricing.enterprise.description,
      features: t.pricing.enterprise.features,
      cta: t.pricing.enterprise.cta,
      popular: false,
      gradient: "from-green-600 to-teal-600",
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t.pricing.tag}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.pricing.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""} hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Mais Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
