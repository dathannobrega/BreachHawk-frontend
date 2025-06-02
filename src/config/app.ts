// Configurações centralizadas da aplicação
export const config = {
  appName: "BreachHawk",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  googleOAuth: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google",
  },
  defaultLocale: "pt-BR",
  supportEmail: "suporte@breachhawk.com",
}
