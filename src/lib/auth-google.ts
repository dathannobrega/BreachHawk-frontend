import { APP_CONFIG } from "@/config/app"

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

class GoogleAuthService {
  private googleAuth: any = null
  private isInitialized = false
  private initPromise: Promise<void> | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.init()
    }
  }

  private init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Carrega o script do Google
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: APP_CONFIG.AUTH.GOOGLE_CLIENT_ID,
          callback: this.handleCredentialResponse.bind(this),
        })
        this.isInitialized = true
        resolve()
      }
      script.onerror = (error) => {
        console.error("Erro ao carregar o script do Google:", error)
        reject(error)
      }
      document.body.appendChild(script)
    })

    return this.initPromise
  }

  private handleCredentialResponse(response: any): void {
    // Este método é chamado pelo Google quando o usuário faz login
    // Normalmente, você não precisa fazer nada aqui, pois o token JWT
    // será enviado para o backend pelo método signIn
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Erro ao decodificar token JWT:", error)
      return null
    }
  }

  async signIn(): Promise<GoogleUser> {
    await this.init()

    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error("O prompt de login do Google não foi exibido"))
          }
        })

        // Cria um botão invisível para acionar o login
        const buttonElement = document.createElement("div")
        buttonElement.style.display = "none"
        document.body.appendChild(buttonElement)

        window.google.accounts.id.renderButton(buttonElement, {
          type: "standard",
          theme: "outline",
          size: "large",
        })

        // Simula um clique no botão
        const googleButton = buttonElement.querySelector("div[role=button]") as HTMLElement
        if (googleButton) {
          googleButton.click()
        }

        // Configura um callback temporário para capturar a resposta
        const originalCallback = window.google.accounts.id.callback
        window.google.accounts.id.callback = (response: any) => {
          // Restaura o callback original
          window.google.accounts.id.callback = originalCallback

          // Remove o botão invisível
          document.body.removeChild(buttonElement)

          if (response && response.credential) {
            const payload = this.parseJwt(response.credential)
            if (payload) {
              const user: GoogleUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,
              }
              resolve(user)
            } else {
              reject(new Error("Falha ao decodificar o token JWT do Google"))
            }
          } else {
            reject(new Error("Resposta de autenticação do Google inválida"))
          }
        }
      } catch (error) {
        console.error("Erro durante o login com Google:", error)
        reject(error)
      }
    })
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) {
      await this.init()
    }

    return new Promise((resolve) => {
      try {
        window.google.accounts.id.disableAutoSelect()
        resolve()
      } catch (error) {
        console.error("Erro ao fazer logout do Google:", error)
        resolve() // Resolve mesmo com erro para não bloquear o logout geral
      }
    })
  }
}

export const googleAuth = new GoogleAuthService()
