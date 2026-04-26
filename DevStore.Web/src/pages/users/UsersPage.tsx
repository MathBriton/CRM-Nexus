import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
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
        {formulario ? (
          <Button variant="outline" onClick={() => setFormulario(null)}>
            Cancelar
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setFormulario({ modo: 'criar' })}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Criar
          </Button>
        )}
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
