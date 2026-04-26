import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from './DataTable'
import { FormModal } from './FormModal'
import type { ModuloConfig } from '@/types/modulo'

type Registro = Record<string, unknown>

let _proximoId = 1000

interface Props {
  config: ModuloConfig
}

export function TabelaCrud({ config }: Props) {
  const [dados, setDados] = useState<Registro[]>(config.dadosMock)
  const [modal, setModal] = useState<'novo' | Registro | null>(null)

  function salvar(form: Record<string, string>) {
    if (modal === 'novo') {
      setDados(prev => [...prev, { id: ++_proximoId, ...form }])
    } else {
      setDados(prev =>
        prev.map(r => (r.id === (modal as Registro).id ? { ...r, ...form } : r)),
      )
    }
    setModal(null)
  }

  function excluir(id: unknown) {
    setDados(prev => prev.filter(r => r.id !== id))
  }

  const temAcoes = config.campos.length > 0

  return (
    <div className="space-y-4">
      {temAcoes && (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setModal('novo')}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Criar
          </Button>
        </div>
      )}

      <DataTable
        colunas={config.colunas}
        dados={dados}
        acoes={
          temAcoes
            ? row => (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setModal(row)}
                    aria-label="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => excluir(row.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                  </Button>
                </>
              )
            : undefined
        }
      />

      {modal !== null && (
        <FormModal
          titulo={
            modal === 'novo' ? `Novo ${config.entidade}` : `Editar ${config.entidade}`
          }
          campos={config.campos}
          inicial={modal === 'novo' ? {} : (modal as Registro)}
          criarNovo={modal === 'novo'}
          onSalvar={salvar}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  )
}
