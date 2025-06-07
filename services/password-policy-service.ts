import type { PasswordPolicyRead, PasswordPolicyUpdate } from "@/types/password-policy"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class PasswordPolicyService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_BASE_URL}/api/v1/password-policy${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getPolicy(): Promise<PasswordPolicyRead> {
    return this.makeRequest<PasswordPolicyRead>("/")
  }

  async updatePolicy(policy: PasswordPolicyUpdate): Promise<PasswordPolicyRead> {
    return this.makeRequest<PasswordPolicyRead>("/", {
      method: "PUT",
      body: JSON.stringify(policy),
    })
  }

  // Método utilitário para validar uma senha baseada na política
  validatePassword(password: string, policy: PasswordPolicyRead): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < policy.min_length) {
      errors.push(`A senha deve ter pelo menos ${policy.min_length} caracteres`)
    }

    if (policy.require_uppercase && !/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula")
    }

    if (policy.require_lowercase && !/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula")
    }

    if (policy.require_numbers && !/\d/.test(password)) {
      errors.push("A senha deve conter pelo menos um número")
    }

    if (policy.require_symbols && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("A senha deve conter pelo menos um símbolo especial")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Método para gerar uma descrição da política
  getPolicyDescription(policy: PasswordPolicyRead): string {
    const requirements: string[] = []

    requirements.push(`${policy.min_length} caracteres`)

    if (policy.require_uppercase) requirements.push("maiúsculas")
    if (policy.require_lowercase) requirements.push("minúsculas")
    if (policy.require_numbers) requirements.push("números")
    if (policy.require_symbols) requirements.push("símbolos")

    return `Mínimo de ${requirements.join(", ")}`
  }
}

export const passwordPolicyService = new PasswordPolicyService()
