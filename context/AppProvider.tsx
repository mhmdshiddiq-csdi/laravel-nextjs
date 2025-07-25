"use client";
import { createContext, useContext, useState } from "react"

interface AppProviderType {
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string, password_confirmation: string) => void
  isLoading: boolean
}

const AppContext = createContext<AppProviderType|undefined>(undefined)

export default function AppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const login = async(email: string, password: string) => {}
  const register = async(name: string, email: string, password: string, password_confirmation: string) => {}

  return (
    <AppContext.Provider value={{login, register, isLoading}}>
      {children}
    </AppContext.Provider>
  )
}

export const myAppHook = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}