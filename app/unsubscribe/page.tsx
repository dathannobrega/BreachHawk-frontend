"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Check, AlertCircle, Mail } from "lucide-react"
import { StatusMessage } from "@/components/ui/status-message"
import { AuthLayout } from "@/components/templates/auth-layout"

// URL para a API de cancelamento de inscrição
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [resubscribed, setResubscribed] = useState(false)

  useEffect(() => {
    // Extrair token do parâmetro de URL
    const tokenParam = searchParams.get("token")

    if (tokenParam) {
      setToken(tokenParam)

      // Remover o token da URL para evitar vazamentos (segurança)
      // Isso substitui a URL atual por uma sem o parâmetro token
      router.replace("/unsubscribe")
    }

    // Verificar se temos o token necessário
    if (!tokenParam) {
      setLoading(false)
      setError("Link inválido. Por favor, verifique o link recebido por email.")
      return
    }

    // Processar o cancelamento da inscrição automaticamente
    processUnsubscribe(tokenParam)
  }, [searchParams, router])

  // Função para processar o cancelamento de inscrição
  const processUnsubscribe = async (tokenParam: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/notifications/unsubscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenParam,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao processar a solicitação")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao processar sua solicitação")
      console.error("Erro:", err)
    } finally {
      setLoading(false)
    }
  }

  // Função para reativar inscrição
  const handleResubscribe = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/notifications/resubscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao processar a solicitação")
      }

      setResubscribed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao processar sua solicitação")
      console.error("Erro:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {loading ? "Processando..." : resubscribed ? "Inscrição Reativada" : success ? "Cancelamento Confirmado" : "Cancelar Inscrição"}
          </CardTitle>
          <CardDescription className="text-center">
            {loading
              ? "Estamos processando sua solicitação..."
              : resubscribed
                ? "Você voltará a receber nossas notificações."
                : success
                  ? "Você não receberá mais nossas notificações."
                  : "Gerencie suas preferências de notificações"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !loading && !resubscribed && (
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Solicitação processada</AlertTitle>
                <AlertDescription className="text-green-700">
                  Você foi removido da nossa lista de notificações.
                </AlertDescription>
              </Alert>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Não quer perder nossas atualizações?</p>
                <p>Você pode reativar sua inscrição a qualquer momento.</p>
              </div>

              <div className="flex justify-center mt-4">
                <Button onClick={handleResubscribe} variant="outline">
                  Reativar inscrição
                </Button>
              </div>
            </div>
          )}

          {resubscribed && !loading && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Reinscrição confirmada</AlertTitle>
              <AlertDescription className="text-green-700">
                Você foi adicionado novamente à nossa lista de notificações. Obrigado pelo seu interesse!
              </AlertDescription>
            </Alert>
          )}

          {!success && !loading && !error && (
            <StatusMessage
              title="Tem certeza que deseja cancelar sua inscrição?"
              description="Você não receberá mais atualizações, novidades e alertas por email."
              icon={<AlertCircle className="h-5 w-5" />}
              intent="warning"
            />
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {!success && !loading && !error && token && (
            <Button
              onClick={() => processUnsubscribe(token)}
              className="w-full"
              variant="destructive"
            >
              Confirmar cancelamento
            </Button>
          )}
          <div className="text-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
