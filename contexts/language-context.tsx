"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/lib/i18n"

export type Language = "pt" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.pt
  toggleLanguage: () => void
}

// Valor padrão para o contexto
const defaultContext: LanguageContextType = {
  language: "pt",
  setLanguage: () => {},
  t: translations.pt,
  toggleLanguage: () => {},
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Inicializa com o idioma padrão (português)
  const [language, setLanguageState] = useState<Language>("pt")
  const [isClient, setIsClient] = useState(false)

  // Efeito para carregar a preferência de idioma do usuário
  useEffect(() => {
    setIsClient(true)
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
        setLanguageState(savedLanguage)
      } else {
        // Detecta o idioma do navegador como fallback
        const browserLanguage = navigator.language.startsWith("pt") ? "pt" : "en"
        setLanguageState(browserLanguage)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Função para alterar o idioma
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (isClient) {
      try {
        localStorage.setItem("language", newLanguage)
      } catch (error) {
        console.error("Error writing to localStorage:", error)
      }
    }
  }

  // Função para alternar entre os idiomas
  const toggleLanguage = () => {
    const newLanguage = language === "pt" ? "en" : "pt"
    setLanguage(newLanguage)
  }

  // Obtém as traduções para o idioma atual
  const t = translations[language] || translations.pt

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
