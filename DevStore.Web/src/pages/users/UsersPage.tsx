import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { UserList } from '@/components/users/UserList'
import { UserForm } from '@/components/users/UserForm'
import type { User } from '@/types/user'

type EstadoFormulario =
  | { modo: 'criar' }
  | { modo: 'editar'; usuario: User }
  | null

export function UsersPage() {
  const [formulario, setFormulario] = useState<EstadoFormulario>(null)
  const [chaveReload, setChaveReload] = useState(0)

  const handleSucesso = useCallback(() => {
    setFormulario(null)
    setChaveReload((k) => k + 1)
  }, [])

  const handleEditar = useCallback((usuario: User) => {
    setFormulario({ modo: 'editar', usuario })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Controle de Acesso de Usuários</h2>
        <Button
          onClick={() => setFormulario((atual) => (atual ? null : { modo: 'criar' }))}
          variant={formulario ? 'outline' : 'default'}
        >
          {formulario ? 'Cancelar' : 'Novo Usuário'}
        </Button>
      </div>

      {formulario && (
        <UserForm
          usuario={formulario.modo === 'editar' ? formulario.usuario : undefined}
          onSucesso={handleSucesso}
        />
      )}

      <UserList key={chaveReload} onEditar={handleEditar} />
    </div>
  )
}
