import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para obter os headers de autenticação com segurança (compatível com SSR)
export function getAuthHeaders(): HeadersInit {
  // Verifica se estamos em ambiente browser antes de acessar localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
  }

  // Retorno padrão sem token de autorização
  return {
    "Content-Type": "application/json",
  };
}
