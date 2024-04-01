import { useSuspenseQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

export interface AuthContext {
  isLogged: boolean
  user?: {
    userId: string
    userType: string
  }
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{
    isLogged: boolean
    user?: {
      userId: string
      userType: string
    }
  }>()
  const data = useSuspenseQuery({
    queryKey: ['CurrentUser'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/login', {
        credentials: 'include',
      })

      if (!response.ok)
        return {
          isLogged: false,
        }

      const data = (await response.json()) as Promise<{
        isLogged: boolean
        user?: {
          userId: string
          userType: string
        }
      }>

      return data
    },
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
  })

  useEffect(() => {
    setCurrentUser(data.data)
  }, [data])

  const isLogged = data.data.isLogged
  return (
    <AuthContext.Provider value={{ isLogged, user: currentUser?.user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
