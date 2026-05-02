import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { NexusUsuario } from '@/types/permissao'

interface ModalImportarProps {
  usuarios: NexusUsuario[]
  onImportar: (matricula: string, filial: string) => Promise<void>
  onFechar: () => void
}

export function ModalImportar({ usuarios, onImportar, onFechar }: ModalImportarProps) {
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState<NexusUsuario | null>(null)
  const [importando, setImportando] = useState(false)

  const usuariosFiltrados = busca
    ? usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(busca.toLowerCase()) ||
          u.login.toLowerCase().includes(busca.toLowerCase()),
      )
    : usuarios.slice(0, 30)

  async function handleImportar() {
    if (!selecionado) return
    setImportando(true)
    try {
      await onImportar(selecionado.matricula, selecionado.filial)
      onFechar()
    } finally {
      setImportando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-md p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Importar Permissões de Outro Usuário</h3>
          <button
            onClick={onFechar}
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="busca-import" className="text-xs">
            Buscar usuário de origem
          </Label>
          <Input
            id="busca-import"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome ou login..."
            className="h-8 text-xs"
            autoFocus
          />
        </div>

        <div className="border rounded max-h-52 overflow-y-auto divide-y">
          {usuariosFiltrados.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum resultado.</p>
          ) : (
            usuariosFiltrados.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelecionado(u)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-muted/50 transition-colors ${
                  selecionado?.id === u.id ? 'bg-violet-500/10 font-semibold' : ''
                }`}
              >
                <span className="block">{u.nome}</span>
                <span className="text-muted-foreground">{u.login}</span>
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={onFechar}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleImportar} disabled={!selecionado || importando}>
            {importando ? 'Importando...' : 'Importar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
