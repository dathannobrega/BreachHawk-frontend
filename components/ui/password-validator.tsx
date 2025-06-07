"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"
import type { PasswordPolicyRead } from "@/types/password-policy"

interface PasswordValidatorProps {
  password: string
  policy: PasswordPolicyRead
}

export default function PasswordValidator({ password, policy }: PasswordValidatorProps) {
  // Validar os requisitos individuais
  const requirements = {
    minLength: password.length >= policy.min_length,
    uppercase: !policy.require_uppercase || /[A-Z]/.test(password),
    lowercase: !policy.require_lowercase || /[a-z]/.test(password),
    numbers: !policy.require_numbers || /\d/.test(password),
    symbols: !policy.require_symbols || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  // Verificar se todos os requisitos foram atendidos
  const allRequirementsMet = Object.values(requirements).every(Boolean)

  return (
    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
      <h4 className="text-sm font-medium mb-2 text-slate-700">Requisitos de senha:</h4>
      <ul className="space-y-1">
        <li className="flex items-center text-sm">
          {requirements.minLength ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
          )}
          <span className={cn("transition-colors", requirements.minLength ? "text-green-700" : "text-slate-600")}>
            Mínimo de {policy.min_length} caracteres
          </span>
        </li>

        {policy.require_uppercase && (
          <li className="flex items-center text-sm">
            {requirements.uppercase ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            )}
            <span className={cn("transition-colors", requirements.uppercase ? "text-green-700" : "text-slate-600")}>
              Pelo menos uma letra maiúscula
            </span>
          </li>
        )}

        {policy.require_lowercase && (
          <li className="flex items-center text-sm">
            {requirements.lowercase ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            )}
            <span className={cn("transition-colors", requirements.lowercase ? "text-green-700" : "text-slate-600")}>
              Pelo menos uma letra minúscula
            </span>
          </li>
        )}

        {policy.require_numbers && (
          <li className="flex items-center text-sm">
            {requirements.numbers ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            )}
            <span className={cn("transition-colors", requirements.numbers ? "text-green-700" : "text-slate-600")}>
              Pelo menos um número
            </span>
          </li>
        )}

        {policy.require_symbols && (
          <li className="flex items-center text-sm">
            {requirements.symbols ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            )}
            <span className={cn("transition-colors", requirements.symbols ? "text-green-700" : "text-slate-600")}>
              Pelo menos um símbolo especial (!@#$%^&*...)
            </span>
          </li>
        )}
      </ul>

      <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            allRequirementsMet ? "bg-green-500 w-full" : password.length > 0 ? "bg-blue-500 w-1/2" : "w-0",
          )}
        ></div>
      </div>
    </div>
  )
}
