"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  birthDate?: string
  gender?: string
  interests?: string[]
  preferredAgeRange?: string
  preferredGender?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, birthDate?: string) => Promise<void>
  loginWithGoogle: (name?: string, email?: string, birthDate?: string) => Promise<void>
  loginWithApple: (name?: string, email?: string, birthDate?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("wiys_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("wiys_user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, name: string, birthDate?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      birthDate,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("wiys_user", JSON.stringify(mockUser))
  }

  const loginWithGoogle = async (name?: string, email?: string, birthDate?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email || "user@gmail.com",
      name: name || "Google User",
      birthDate,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("wiys_user", JSON.stringify(mockUser))
  }

  const loginWithApple = async (name?: string, email?: string, birthDate?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email || "user@icloud.com",
      name: name || "Apple User",
      birthDate,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("wiys_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wiys_user")
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("wiys_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, loginWithGoogle, loginWithApple, logout, updateProfile, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
