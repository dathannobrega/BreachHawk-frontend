import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Adicionando a função getAuthHeaders que estava faltando
export function getAuthHeaders() {
  const token = localStorage.getItem("access_token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}
