import { createContext, useContext, useState } from 'react'
import type { Usuario } from '@/types/auth'

interface AuthContextValue {
  user: Usuario | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function carregarSessao(): { user: Usuario | null; token: string | null } {
  const token = localStorage.getItem('auth_token')
  const raw = localStorage.getItem('auth_user')
  const user = raw ? (JSON.parse(raw) as Usuario) : null
  return { token, user }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessaoInicial = carregarSessao()
  const [user, setUser] = useState<Usuario | null>(sessaoInicial.user)
  const [token, setToken] = useState<string | null>(sessaoInicial.token)

  async function login(username: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Credenciais inválidas')
    const data = await res.json() as { token: string; user: Usuario }
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
