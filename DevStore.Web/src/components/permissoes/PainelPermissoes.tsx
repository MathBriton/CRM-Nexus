import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CategoriaAccordion } from './CategoriaAccordion'
import type { ItemPermissao } from '@/types/permissao'

interface PainelPermissoesProps {
  titulo: string
  itens: ItemPermissao[]
  corTitulo: string
  onToggle: (codigo: string, habilitado: boolean) => void
}

export function PainelPermissoes({ titulo, itens, corTitulo, onToggle }: PainelPermissoesProps) {
  const [termoBusca, setTermoBusca] = useState('')

  const categorias = useMemo(() => {
    const mapa = new Map<string, ItemPermissao[]>()
    for (const item of itens) {
      const lista = mapa.get(item.categoria) ?? []
      lista.push(item)
      mapa.set(item.categoria, lista)
    }
    return mapa
  }, [itens])

  const totalHabilitados = itens.filter((i) => i.habilitado).length

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card">
        <h2 className={`text-sm font-bold uppercase tracking-wide ${corTitulo}`}>{titulo}</h2>
        <span className="text-xs text-muted-foreground">
          {totalHabilitados}/{itens.length} habilitados
        </span>
      </div>

      <div className="px-3 py-2 border-b bg-muted/30">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder={`Buscar em ${titulo.toLowerCase()}...`}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-0 max-h-[calc(100vh-320px)]">
        {itens.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-8">
            Nenhum item encontrado.
          </p>
        ) : (
          Array.from(categorias.entries()).map(([cat, catItens]) => (
            <CategoriaAccordion
              key={cat}
              nome={cat}
              itens={catItens}
              onToggle={onToggle}
              termoBusca={termoBusca}
            />
          ))
        )}
      </div>
    </div>
  )
}
