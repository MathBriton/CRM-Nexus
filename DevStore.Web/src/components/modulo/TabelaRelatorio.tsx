import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ColunaConfig } from '@/types/modulo'
import { exportarPDF, exportarExcel } from './exportar'

const COR_BADGE: Record<string, string> = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  orange: 'bg-orange-100 text-orange-800',
  gray:   'bg-gray-100 text-gray-700',
  cyan:   'bg-cyan-100 text-cyan-800',
  purple: 'bg-purple-100 text-purple-800',
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

interface Props {
  titulo: string
  colunas: ColunaConfig[]
  dados: Record<string, unknown>[]
}

export default function TabelaRelatorio({ titulo, colunas, dados }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {dados.length} registro(s) encontrado(s)
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportarPDF(titulo, colunas, dados)}
          >
            Exportar PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportarExcel(titulo, colunas, dados)}
          >
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {colunas.map(c => (
                <th
                  key={c.key}
                  className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum dado disponível
                </td>
              </tr>
            ) : (
              dados.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  {colunas.map(c => (
                    <td key={c.key} className="py-2.5 px-4 whitespace-nowrap">
                      {formatarCelula(row[c.key], c)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
