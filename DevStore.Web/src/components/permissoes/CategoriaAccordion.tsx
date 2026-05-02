import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ItemPermissao } from '@/types/permissao'

interface CategoriaAccordionProps {
  nome: string
  itens: ItemPermissao[]
  onToggle: (codigo: string, habilitado: boolean) => void
  termoBusca: string
}

export function CategoriaAccordion({ nome, itens, onToggle, termoBusca }: CategoriaAccordionProps) {
  const [aberto, setAberto] = useState(false)

  const itensFiltrados = termoBusca
    ? itens.filter((i) => i.nome.toLowerCase().includes(termoBusca.toLowerCase()))
    : itens

  if (itensFiltrados.length === 0) return null

  const totalHabilitados = itensFiltrados.filter((i) => i.habilitado).length
  const todosHabilitados = totalHabilitados === itensFiltrados.length

  function toggleTodos() {
    const novoEstado = !todosHabilitados
    itensFiltrados.forEach((item) => onToggle(item.codigo, novoEstado))
  }

  return (
    <div className="border rounded overflow-hidden mb-2">
      <button
        onClick={() => setAberto((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-card hover:bg-muted/50 text-sm font-semibold transition-colors"
        aria-expanded={aberto}
      >
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todosHabilitados}
            onChange={toggleTodos}
            onClick={(e) => e.stopPropagation()}
            className="accent-violet-600 h-3.5 w-3.5 cursor-pointer"
            aria-label={`Selecionar todos em ${nome}`}
          />
          {nome}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-normal">
            {totalHabilitados}/{itensFiltrados.length}
          </span>
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform duration-200', aberto && 'rotate-180')}
          />
        </span>
      </button>

      {aberto && (
        <ul className="divide-y divide-border">
          {itensFiltrados.map((item) => (
            <li
              key={item.codigo}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-muted/30 transition-colors',
                item.habilitado && 'bg-muted/20',
              )}
              onClick={() => onToggle(item.codigo, !item.habilitado)}
            >
              <input
                type="checkbox"
                checked={item.habilitado}
                onChange={() => onToggle(item.codigo, !item.habilitado)}
                onClick={(e) => e.stopPropagation()}
                className="accent-violet-600 h-3.5 w-3.5 shrink-0 cursor-pointer"
                aria-label={item.nome}
              />
              <span
                className={cn(
                  'text-xs leading-snug',
                  item.habilitado ? 'font-semibold text-foreground' : 'text-muted-foreground',
                )}
              >
                {item.nome}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
