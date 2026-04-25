import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ColunaConfig, ModuloConfig } from '@/types/modulo'
import { FormModal } from './FormModal'

type Registro = Record<string, unknown>

const COR_BADGE: Record<string, string> = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  orange: 'bg-orange-100 text-orange-800',
  gray:   'bg-gray-100 text-gray-700',
  cyan:   'bg-cyan-100 text-cyan-800',
}

function CelulaBadge({ valor, corBadge }: { valor: string; corBadge: Record<string, string> }) {
  const cls = COR_BADGE[corBadge[valor] ?? 'gray'] ?? COR_BADGE.gray
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', cls)}>
      {valor}
    </span>
  )
}

function formatarCelula(valor: unknown, col: ColunaConfig): React.ReactNode {
  if (col.tipo === 'moeda') return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`
  if (col.tipo === 'badge' && col.corBadge)
    return <CelulaBadge valor={String(valor)} corBadge={col.corBadge} />
  if (col.tipo === 'data') {
    try { return new Date(String(valor)).toLocaleDateString('pt-BR') } catch { /* noop */ }
  }
  return String(valor ?? '')
}

let _proximoId = 1000

interface Props {
  config: ModuloConfig
}

export function TabelaCrud({ config }: Props) {
  const [dados, setDados] = useState<Registro[]>(config.dadosMock)
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<'novo' | Registro | null>(null)

  const dadosFiltrados = busca.trim()
    ? dados.filter(row =>
        Object.values(row).some(v =>
          String(v).toLowerCase().includes(busca.toLowerCase()),
        ),
      )
    : dados

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
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="max-w-xs"
        />
        {temAcoes && (
          <Button size="sm" onClick={() => setModal('novo')}>
            <Plus className="h-4 w-4 mr-1" />
            Novo {config.entidade}
          </Button>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {config.colunas.map(c => (
                <th
                  key={c.key}
                  className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap"
                >
                  {c.label}
                </th>
              ))}
              {temAcoes && (
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={config.colunas.length + (temAcoes ? 1 : 0)}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              dadosFiltrados.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  {config.colunas.map(c => (
                    <td key={c.key} className="py-2.5 px-4 whitespace-nowrap">
                      {formatarCelula(row[c.key], c)}
                    </td>
                  ))}
                  {temAcoes && (
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setModal(row)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => excluir(row.id)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{dadosFiltrados.length} registro(s)</p>

      {modal !== null && (
        <FormModal
          titulo={
            modal === 'novo'
              ? `Novo ${config.entidade}`
              : `Editar ${config.entidade}`
          }
          campos={config.campos}
          inicial={modal === 'novo' ? {} : (modal as Registro)}
          onSalvar={salvar}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  )
}
