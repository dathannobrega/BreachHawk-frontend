export interface Translations {
  auth: {
    login: {
      title: string
      subtitle: string
      email: string
      emailPlaceholder: string
      password: string
      passwordPlaceholder: string
      rememberMe: string
      forgotPassword: string
      signIn: string
      signingIn: string
      noAccount: string
      signUp: string
      errors: {
        emailRequired: string
        passwordRequired: string
        invalidCredentials: string
        serverError: string
      }
    }
    register: {
      title: string
      subtitle: string
      firstName: string
      firstNamePlaceholder: string
      lastName: string
      lastNamePlaceholder: string
      email: string
      emailPlaceholder: string
      username: string
      usernamePlaceholder: string
      password: string
      passwordPlaceholder: string
      confirmPassword: string
      confirmPasswordPlaceholder: string
      agreeTerms: string
      signUp: string
      signingUp: string
      hasAccount: string
      signIn: string
      errors: {
        firstNameRequired: string
        lastNameRequired: string
        emailRequired: string
        usernameRequired: string
        passwordRequired: string
        passwordMismatch: string
        termsRequired: string
        serverError: string
      }
    }
    forgotPassword: {
      title: string
      subtitle: string
      identifier: string
      identifierPlaceholder: string
      send: string
      sending: string
      success: {
        title: string
        message: string
      }
      errors: {
        identifierRequired: string
        serverError: string
      }
    }
    resetPassword: {
      title: string
      subtitle: string
      password: string
      passwordPlaceholder: string
      confirmPassword: string
      confirmPasswordPlaceholder: string
      reset: string
      resetting: string
      success: string
      errors: {
        passwordRequired: string
        passwordMismatch: string
        invalidToken: string
        serverError: string
      }
    }
  }
  dashboard: {
    title: string
    welcome: string
    stats: {
      totalSites: string
      activeSites: string
      totalScrapers: string
      activeScrapers: string
    }
  }
  navigation: {
    dashboard: string
    sites: string
    settings: string
    logout: string
  }
}

const translations: Record<string, Translations> = {
  pt: {
    auth: {
      login: {
        title: "Entrar",
        subtitle: "Entre na sua conta para continuar",
        email: "Email",
        emailPlaceholder: "Digite seu email",
        password: "Senha",
        passwordPlaceholder: "Digite sua senha",
        rememberMe: "Lembrar de mim",
        forgotPassword: "Esqueceu a senha?",
        signIn: "Entrar",
        signingIn: "Entrando...",
        noAccount: "Não tem uma conta?",
        signUp: "Cadastre-se",
        errors: {
          emailRequired: "Email é obrigatório",
          passwordRequired: "Senha é obrigatória",
          invalidCredentials: "Email ou senha inválidos",
          serverError: "Erro no servidor. Tente novamente.",
        },
      },
      register: {
        title: "Criar Conta",
        subtitle: "Crie sua conta para começar",
        firstName: "Nome",
        firstNamePlaceholder: "Digite seu nome",
        lastName: "Sobrenome",
        lastNamePlaceholder: "Digite seu sobrenome",
        email: "Email",
        emailPlaceholder: "Digite seu email",
        username: "Nome de usuário",
        usernamePlaceholder: "Digite seu nome de usuário",
        password: "Senha",
        passwordPlaceholder: "Digite sua senha",
        confirmPassword: "Confirmar Senha",
        confirmPasswordPlaceholder: "Confirme sua senha",
        agreeTerms: "Concordo com os termos e condições",
        signUp: "Cadastrar",
        signingUp: "Cadastrando...",
        hasAccount: "Já tem uma conta?",
        signIn: "Entre",
        errors: {
          firstNameRequired: "Nome é obrigatório",
          lastNameRequired: "Sobrenome é obrigatório",
          emailRequired: "Email é obrigatório",
          usernameRequired: "Nome de usuário é obrigatório",
          passwordRequired: "Senha é obrigatória",
          passwordMismatch: "Senhas não coincidem",
          termsRequired: "Você deve concordar com os termos",
          serverError: "Erro no servidor. Tente novamente.",
        },
      },
      forgotPassword: {
        title: "Recuperar Senha",
        subtitle: "Digite seu email ou nome de usuário para recuperar sua senha",
        identifier: "Email ou Nome de usuário",
        identifierPlaceholder: "Digite seu email ou nome de usuário",
        send: "Enviar Link de Recuperação",
        sending: "Enviando...",
        success: {
          title: "Email Enviado!",
          message: "Se o usuário existir, você receberá um email com instruções para redefinir sua senha.",
        },
        errors: {
          identifierRequired: "Email ou nome de usuário é obrigatório",
          serverError: "Erro no servidor. Tente novamente.",
        },
      },
      resetPassword: {
        title: "Redefinir Senha",
        subtitle: "Digite sua nova senha",
        password: "Nova Senha",
        passwordPlaceholder: "Digite sua nova senha",
        confirmPassword: "Confirmar Nova Senha",
        confirmPasswordPlaceholder: "Confirme sua nova senha",
        reset: "Redefinir Senha",
        resetting: "Redefinindo...",
        success: "Senha redefinida com sucesso! Redirecionando para o login...",
        errors: {
          passwordRequired: "Nova senha é obrigatória",
          passwordMismatch: "Senhas não coincidem",
          invalidToken: "Token inválido ou expirado",
          serverError: "Erro no servidor. Tente novamente.",
        },
      },
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Bem-vindo",
      stats: {
        totalSites: "Total de Sites",
        activeSites: "Sites Ativos",
        totalScrapers: "Total de Scrapers",
        activeScrapers: "Scrapers Ativos",
      },
    },
    navigation: {
      dashboard: "Dashboard",
      sites: "Sites",
      settings: "Configurações",
      logout: "Sair",
    },
  },
  en: {
    auth: {
      login: {
        title: "Sign In",
        subtitle: "Sign in to your account to continue",
        email: "Email",
        emailPlaceholder: "Enter your email",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signIn: "Sign In",
        signingIn: "Signing in...",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        errors: {
          emailRequired: "Email is required",
          passwordRequired: "Password is required",
          invalidCredentials: "Invalid email or password",
          serverError: "Server error. Please try again.",
        },
      },
      register: {
        title: "Create Account",
        subtitle: "Create your account to get started",
        firstName: "First Name",
        firstNamePlaceholder: "Enter your first name",
        lastName: "Last Name",
        lastNamePlaceholder: "Enter your last name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        username: "Username",
        usernamePlaceholder: "Enter your username",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm your password",
        agreeTerms: "I agree to the terms and conditions",
        signUp: "Sign Up",
        signingUp: "Signing up...",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
        errors: {
          firstNameRequired: "First name is required",
          lastNameRequired: "Last name is required",
          emailRequired: "Email is required",
          usernameRequired: "Username is required",
          passwordRequired: "Password is required",
          passwordMismatch: "Passwords do not match",
          termsRequired: "You must agree to the terms",
          serverError: "Server error. Please try again.",
        },
      },
      forgotPassword: {
        title: "Forgot Password",
        subtitle: "Enter your email or username to recover your password",
        identifier: "Email or Username",
        identifierPlaceholder: "Enter your email or username",
        send: "Send Recovery Link",
        sending: "Sending...",
        success: {
          title: "Email Sent!",
          message: "If the user exists, you will receive an email with instructions to reset your password.",
        },
        errors: {
          identifierRequired: "Email or username is required",
          serverError: "Server error. Please try again.",
        },
      },
      resetPassword: {
        title: "Reset Password",
        subtitle: "Enter your new password",
        password: "New Password",
        passwordPlaceholder: "Enter your new password",
        confirmPassword: "Confirm New Password",
        confirmPasswordPlaceholder: "Confirm your new password",
        reset: "Reset Password",
        resetting: "Resetting...",
        success: "Password reset successfully! Redirecting to login...",
        errors: {
          passwordRequired: "New password is required",
          passwordMismatch: "Passwords do not match",
          invalidToken: "Invalid or expired token",
          serverError: "Server error. Please try again.",
        },
      },
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome",
      stats: {
        totalSites: "Total Sites",
        activeSites: "Active Sites",
        totalScrapers: "Total Scrapers",
        activeScrapers: "Active Scrapers",
      },
    },
    navigation: {
      dashboard: "Dashboard",
      sites: "Sites",
      settings: "Settings",
      logout: "Logout",
    },
  },
}

export function getTranslations(language: string): Translations {
  return translations[language] || translations.pt
}

export function t(key: string, language = "pt"): string {
  const trans = getTranslations(language)
  const keys = key.split(".")
  let value: any = trans

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

export { translations }
