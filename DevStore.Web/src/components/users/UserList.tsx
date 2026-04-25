import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { userService } from '@/services/userService'
import type { User } from '@/types/user'

const ROLE_LABEL: Record<string, string> = {
  Admin: 'Administrador',
  Manager: 'Gerente',
  User: 'Usuário',
}

interface UserListProps {
  onEditar: (user: User) => void
}

export function UserList({ onEditar }: UserListProps) {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    userService
      .listar()
      .then(setUsuarios)
      .catch(() => setErro('Erro ao carregar usuários.'))
      .finally(() => setCarregando(false))
  }, [])

  async function handleDesativar(id: number) {
    await userService.desativar(id)
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: false } : u)))
  }

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p role="alert">{erro}</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell className="font-mono text-sm">{usuario.username}</TableCell>
            <TableCell>{usuario.name}</TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{ROLE_LABEL[usuario.role] ?? usuario.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={usuario.isActive ? 'default' : 'secondary'}>
                {usuario.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button size="sm" variant="outline" onClick={() => onEditar(usuario)}>
                Editar
              </Button>
              {usuario.isActive && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDesativar(usuario.id)}
                >
                  Desativar
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
