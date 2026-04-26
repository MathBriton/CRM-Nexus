import { useState, useRef, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Search, X, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import type { ColunaConfig } from '@/types/modulo'

// ── Constantes ─────────────────────────────────────────────────────────────────

export const PLANTAS = ['Pirapetinga', 'Uberaba', 'Saquarema'] as const
const TAMANHOS_PAGINA = [10, 25, 50, 100, 250, 500, 1000] as const

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function BadgeColorido({ valor, corBadge }: { valor: string; corBadge: Record<string, string> }) {
  const cls = COR_BADGE[corBadge[valor] ?? 'gray'] ?? COR_BADGE.gray
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', cls)}>
      {valor}
    </span>
  )
}

function formatarCelula(valor: unknown, col: ColunaConfig): React.ReactNode {
  if (valor === null || valor === undefined) return '—'
  if (col.tipo === 'moeda') return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`
  if (col.tipo === 'badge' && col.corBadge)
    return <BadgeColorido valor={String(valor)} corBadge={col.corBadge} />
  if (col.tipo === 'data') {
    try { return new Date(String(valor)).toLocaleDateString('pt-BR') } catch { /* noop */ }
  }
  return String(valor)
}

// ── Paginação ──────────────────────────────────────────────────────────────────

function gerarPaginas(atual: number, total: number): number[] {
  const visíveis = Math.min(5, total)
  let inicio = Math.max(1, atual - 2)
  const fim = Math.min(total, inicio + visíveis - 1)
  inicio = Math.max(1, fim - visíveis + 1)
  return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
}

// ── Componente principal ───────────────────────────────────────────────────────

type Registro = Record<string, unknown>

export interface DataTableProps {
  colunas: ColunaConfig[]
  dados: Registro[]
  /** Renderiza botões de ação na última coluna. Ausente = coluna omitida. */
  acoes?: (row: Registro) => React.ReactNode
}

export function DataTable({ colunas, dados, acoes }: DataTableProps) {
  const [busca, setBusca] = useState('')
  const [planta, setPlanta] = useState('')
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [pagina, setPagina] = useState(1)
  const [tamPagina, setTamPagina] = useState<number>(10)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Ctrl+K foca a busca ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // ── Resetar página ao mudar filtros ─────────────────────────────────────────
  useEffect(() => { setPagina(1) }, [busca, planta, dataInicio, dataFim, tamPagina])

  // ── Metadados dos dados ──────────────────────────────────────────────────────
  const temPlanta = useMemo(() => dados.some(r => 'planta' in r), [dados])
  const colsDatas = useMemo(
    () => colunas.filter(c => c.tipo === 'data').map(c => c.key),
    [colunas],
  )

  // ── Dados filtrados ──────────────────────────────────────────────────────────
  const dadosFiltrados = useMemo(() => {
    let r = dados

    if (busca.trim()) {
      const q = busca.trim().toLowerCase()
      r = r.filter(row =>
        Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q)),
      )
    }

    if (planta) {
      r = r.filter(row => row.planta === planta)
    }

    if (colsDatas.length > 0 && (dataInicio || dataFim)) {
      const inicioStr = dataInicio ? format(dataInicio, 'yyyy-MM-dd') : ''
      const fimStr = dataFim ? format(dataFim, 'yyyy-MM-dd') : ''
      r = r.filter(row =>
        colsDatas.some(key => {
          const d = String(row[key] ?? '').substring(0, 10)
          if (!d) return false
          if (inicioStr && d < inicioStr) return false
          if (fimStr && d > fimStr) return false
          return true
        }),
      )
    }

    return r
  }, [dados, busca, planta, dataInicio, dataFim, colsDatas])

  // ── Paginação ────────────────────────────────────────────────────────────────
  const total = dadosFiltrados.length
  const totalPaginas = Math.max(1, Math.ceil(total / tamPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * tamPagina
  const fim = Math.min(inicio + tamPagina, total)
  const dadosPagina = dadosFiltrados.slice(inicio, fim)
  const paginas = gerarPaginas(paginaAtual, totalPaginas)

  const temFiltros = busca || planta || dataInicio || dataFim

  function limpar() {
    setBusca(''); setPlanta(''); setDataInicio(undefined); setDataFim(undefined)
    inputRef.current?.focus()
  }

  // ── Classes reutilizáveis ────────────────────────────────────────────────────
  const selectCls =
    'h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="space-y-3">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filtros da tabela">

        {/* Busca global */}
        <div className="relative">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="search"
            role="searchbox"
            placeholder="Filtrar… (Ctrl+K)"
            value={busca}
            onChange={e => setBusca(e.target.value.slice(0, 200))}
            className="pl-8 w-56"
            maxLength={200}
            aria-label="Filtrar registros"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Filtro por planta */}
        {temPlanta && (
          <select
            value={planta}
            onChange={e => setPlanta(e.target.value)}
            className={selectCls}
            aria-label="Filtrar por planta"
          >
            <option value="">Todas as plantas</option>
            {PLANTAS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}

        {/* Filtro de intervalo de data — calendário shadcn/ui */}
        {colsDatas.length > 0 && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground select-none">De</span>
              {/* Input oculto para acessibilidade e testes */}
              <input
                type="date"
                value={dataInicio ? format(dataInicio, 'yyyy-MM-dd') : ''}
                onChange={e => setDataInicio(e.target.value ? parseISO(e.target.value) : undefined)}
                max={dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined}
                aria-label="Data início"
                className="sr-only"
                tabIndex={-1}
              />
              <DatePicker
                value={dataInicio}
                onChange={setDataInicio}
                placeholder="Data início"
                toDate={dataFim}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground select-none">Até</span>
              {/* Input oculto para acessibilidade e testes */}
              <input
                type="date"
                value={dataFim ? format(dataFim, 'yyyy-MM-dd') : ''}
                onChange={e => setDataFim(e.target.value ? parseISO(e.target.value) : undefined)}
                min={dataInicio ? format(dataInicio, 'yyyy-MM-dd') : undefined}
                aria-label="Data fim"
                className="sr-only"
                tabIndex={-1}
              />
              <DatePicker
                value={dataFim}
                onChange={setDataFim}
                placeholder="Data fim"
                fromDate={dataInicio}
              />
            </div>
          </>
        )}

        {/* Limpar filtros */}
        {temFiltros && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpar}
            className="h-9 gap-1 text-muted-foreground"
            aria-label="Limpar todos os filtros"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Limpar
          </Button>
        )}
      </div>

      {/* ── Tabela ──────────────────────────────────────────────────────────── */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm" aria-label="Tabela de dados">
          <thead>
            <tr className="border-b bg-muted/50">
              {colunas.map(c => (
                <th
                  key={c.key}
                  scope="col"
                  className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap"
                >
                  {c.label}
                </th>
              ))}
              {acoes && (
                <th scope="col" className="h-10 px-4 text-right font-medium text-muted-foreground">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dadosPagina.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length + (acoes ? 1 : 0)}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {temFiltros
                    ? 'Nenhum resultado para os filtros aplicados.'
                    : 'Nenhum registro disponível.'}
                </td>
              </tr>
            ) : (
              dadosPagina.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  {colunas.map(c => (
                    <td key={c.key} className="py-2.5 px-4 whitespace-nowrap">
                      {formatarCelula(row[c.key], c)}
                    </td>
                  ))}
                  {acoes && (
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      {acoes(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Rodapé: contador + tamanho de página + paginação ─────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Contador */}
        <p
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground"
        >
          {total === 0
            ? 'Nenhum registro encontrado'
            : `Exibindo ${inicio + 1}–${fim} de ${total} registro(s)`}
        </p>

        <div className="flex items-center gap-3">

          {/* Linhas por página */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground select-none">Linhas:</span>
            <select
              value={tamPagina}
              onChange={e => setTamPagina(Number(e.target.value))}
              className={cn(selectCls, 'h-8 px-2 w-auto')}
              aria-label="Registros por página"
            >
              {TAMANHOS_PAGINA.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <nav aria-label="Paginação" className="flex items-center gap-1">
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPagina(1)}
                disabled={paginaAtual === 1}
                aria-label="Primeira página"
              >
                <ChevronsLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>

              {paginas.map(n => (
                <Button
                  key={n}
                  variant={n === paginaAtual ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPagina(n)}
                  aria-label={`Página ${n}`}
                  aria-current={n === paginaAtual ? 'page' : undefined}
                >
                  {n}
                </Button>
              ))}

              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPagina(totalPaginas)}
                disabled={paginaAtual === totalPaginas}
                aria-label="Última página"
              >
                <ChevronsRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
