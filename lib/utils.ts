import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retorna os headers de autorização para requisições à API
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token")

  if (!token) {
    throw new Error("Token de acesso não encontrado")
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}
