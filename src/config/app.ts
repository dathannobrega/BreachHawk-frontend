/**
 * Configurações centralizadas da aplicação
 */
export const APP_CONFIG = {
  APP: {
    NAME: "BreachHawk",
    DESCRIPTION: "Plataforma de monitoramento de vazamentos de dados",
    VERSION: "1.0.0",
  },
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    TIMEOUT: 30000, // 30 segundos
  },
  AUTH: {
    TOKEN_KEY: "access_token",
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  },
  THEME: {
    PRIMARY_COLOR: "#DC2626", // Vermelho
    SECONDARY_COLOR: "#64748B", // Slate
    SUCCESS_COLOR: "#16A34A", // Verde
    WARNING_COLOR: "#D97706", // Laranja
    DANGER_COLOR: "#DC2626", // Vermelho
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  },
}
