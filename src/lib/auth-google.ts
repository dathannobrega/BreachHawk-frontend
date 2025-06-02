import { config } from "@/config/app"
import { apiClient } from "./api"

export async function initiateGoogleLogin() {
  try {
    // Redirecionar para o endpoint de autenticação do Google no backend
    window.location.href = `${config.apiBaseUrl}/auth/google/login`
  } catch (error) {
    console.error("Failed to initiate Google login:", error)
    throw error
  }
}

export async function handleGoogleCallback(code: string) {
  try {
    const response = await apiClient.googleCallback(code)
    localStorage.setItem("access_token", response.access_token)
    return response.user
  } catch (error) {
    console.error("Google authentication failed:", error)
    throw error
  }
}
