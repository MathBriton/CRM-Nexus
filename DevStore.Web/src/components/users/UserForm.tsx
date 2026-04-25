import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userService } from '@/services/userService'
import type { User, UserRole } from '@/types/user'

const ROLES: UserRole[] = ['Admin', 'Manager', 'User']
const ROLE_LABEL: Record<UserRole, string> = {
  Admin: 'Administrador',
  Manager: 'Gerente',
  User: 'Usuário',
}

interface UserFormProps {
  usuario?: User
  onSucesso: () => void
}

export function UserForm({ usuario, onSucesso }: UserFormProps) {
  const editando = !!usuario

  const [username, setUsername] = useState(usuario?.username ?? '')
  const [name, setName] = useState(usuario?.name ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(usuario?.role ?? 'User')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)

    try {
      if (editando) {
        await userService.atualizar(usuario.id, { name, email })
      } else {
        await userService.criar({ username, name, email, password, role })
      }
      onSucesso()
    } catch {
      setErro('Erro ao salvar usuário. Verifique os dados e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editando ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editando && (
            <div className="space-y-1">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome.usuario"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome Sobrenome"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@empresa.com"
              required
            />
          </div>

          {!editando && (
            <>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="role">Papel</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={enviando} className="w-full">
            {enviando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar usuário'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
