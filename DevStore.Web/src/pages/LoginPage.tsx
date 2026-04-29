import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setErro('Credenciais inválidas. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fundo com gradiente brand */}
      <div className="to-background pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/30 via-violet-900/15" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

      <Card className="border-border/50 relative w-full max-w-sm shadow-2xl backdrop-blur-sm">
        <CardHeader className="pb-4 text-center">
          {/* Logo mark */}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-lg shadow-purple-500/30">
            <span className="text-xl font-extrabold text-white select-none">N</span>
          </div>
          <CardTitle className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-2xl font-bold text-transparent">
            Nexus
          </CardTitle>
          <p className="text-muted-foreground text-sm">Entre com suas credenciais</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <p role="alert" className="text-destructive text-center text-sm">
                {erro}
              </p>
            )}
            <div className="space-y-1">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                autoComplete="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Admin@123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full border-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-violet-700"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
