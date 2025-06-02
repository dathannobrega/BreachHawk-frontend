import type { User, LoginCredentials, RegisterData } from "@/types/auth"
import { apiClient } from "./api"
import { googleAuth, type GoogleUser } from "./auth-google"

class AuthService {
  private user: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    const token = localStorage.getItem("access_token")
    if (token) {
      try {
        const user = await apiClient.getCurrentUser()
        this.setUser(user)
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        this.logout()
      }
    }
  }

  private setUser(user: User | null) {
    this.user = user
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.user))
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.login(credentials)
      localStorage.setItem("access_token", response.access_token)
      this.setUser(response.user)
      return response.user
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await apiClient.register(userData)
      localStorage.setItem("access_token", response.access_token)
      this.setUser(response.user)
      return response.user
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const googleUser: GoogleUser = await googleAuth.signIn()
      const response = await apiClient.googleAuth(googleUser)
      localStorage.setItem("access_token", response.access_token)
      this.setUser(response.user)
      return response.user
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout()
      await googleAuth.signOut()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("access_token")
      this.setUser(null)
    }
  }

  getCurrentUser(): User | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.user !== null && localStorage.getItem("access_token") !== null
  }
}

export const auth = new AuthService()
