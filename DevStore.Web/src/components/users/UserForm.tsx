import { useState, useRef, useEffect } from 'react'
import { UserCircle2, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userService } from '@/services/userService'
import type { User, UserRole } from '@/types/user'
import type { NivelPermissao } from '@/pages/permissions/PermissionsPage'

const ROLES: { valor: UserRole; label: string }[] = [
  { valor: 'Admin', label: 'Administrador' },
  { valor: 'Manager', label: 'Gerente' },
  { valor: 'User', label: 'Usuário' },
]

function carregarPermissoes(): NivelPermissao[] {
  try {
    const raw = localStorage.getItem('devstore_permissoes')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface UserFormProps {
  usuario?: User
  onSucesso: () => void
}

export function UserForm({ usuario, onSucesso }: UserFormProps) {
  const editando = !!usuario
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(usuario?.avatarUrl ?? null)
  const [username, setUsername] = useState(usuario?.username ?? '')
  const [name, setName] = useState(usuario?.name ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(usuario?.role ?? 'User')
  const [permissaoId, setPermissaoId] = useState<string>('')
  const [permissoes, setPermissoes] = useState<NivelPermissao[]>([])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    setPermissoes(carregarPermissoes())
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="ring-border h-20 w-20 rounded-full object-cover ring-2"
                />
              ) : (
                <div className="bg-muted ring-border flex h-20 w-20 items-center justify-center rounded-full ring-2">
                  <UserCircle2 className="text-muted-foreground h-12 w-12" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-1 -bottom-1 rounded-full p-1.5 transition-colors"
                aria-label="Alterar foto"
              >
                <Upload className="h-3 w-3" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Selecionar foto de perfil"
              onChange={handleAvatarChange}
            />
            <p className="text-muted-foreground text-xs">Clique no ícone para carregar uma foto</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            )}

            <div className="space-y-1">
              <Label htmlFor="role">Papel no sistema</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-background w-full rounded-md border px-3 py-2 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r.valor} value={r.valor}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="permissao">Nível de permissão</Label>
              <select
                id="permissao"
                value={permissaoId}
                onChange={(e) => setPermissaoId(e.target.value)}
                className="bg-background w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Selecionar nível...</option>
                {permissoes
                  .slice()
                  .sort((a, b) => b.nivel - a.nivel)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      Nível {p.nivel} — {p.nome}
                    </option>
                  ))}
              </select>
              {permissoes.length === 0 && (
                <p className="text-muted-foreground text-xs">
                  Cadastre permissões no módulo <strong>Permissões</strong> para selecioná-las aqui.
                </p>
              )}
            </div>
          </div>

          {erro && (
            <p role="alert" className="text-destructive text-sm">
              {erro}
            </p>
          )}

          {enviando ? (
            <Button type="submit" disabled className="w-full">
              Salvando...
            </Button>
          ) : editando ? (
            <Button type="submit" className="w-full">
              Salvar alterações
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full gap-1.5 border-0 bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Criar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
