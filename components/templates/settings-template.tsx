"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface SettingsTab {
  id: string
  label: string
  icon: React.ReactNode
  content: React.ReactNode
}

interface SettingsTemplateProps {
  title: string
  description: string
  tabs: SettingsTab[]
  activeTab: string
  onTabChange: (tab: string) => void
  message?: string
  messageType?: "success" | "error" | "warning"
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  message,
  messageType = "success",
}) => {
  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getMessageClass = () => {
    switch (messageType) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  const getMessageTextClass = () => {
    switch (messageType) {
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
      case "warning":
        return "text-yellow-800"
      default:
        return "text-green-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Message */}
      {message && (
        <Alert className={`mb-6 ${getMessageClass()}`}>
          <div className="flex items-center gap-2">
            {getMessageIcon()}
            <AlertDescription className={getMessageTextClass()}>{message}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default SettingsTemplate
