import { useState, useEffect } from 'react'
import { Trash2, Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface NivelPermissao {
  id: string
  nome: string
  descricao: string
  nivel: number
  cor: string
}

const COR_OPTIONS = [
  { valor: 'red',    label: 'Vermelho' },
  { valor: 'orange', label: 'Laranja'  },
  { valor: 'yellow', label: 'Amarelo'  },
  { valor: 'green',  label: 'Verde'    },
  { valor: 'blue',   label: 'Azul'     },
  { valor: 'purple', label: 'Roxo'     },
]

const COR_BADGE: Record<string, string> = {
  red:    'bg-red-100    text-red-700    border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green:  'bg-green-100  text-green-700  border-green-200',
  blue:   'bg-blue-100   text-blue-700   border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}

const STORAGE_KEY = 'devstore_permissoes'

const permissoesPadrao: NivelPermissao[] = [
  { id: '1', nome: 'Administrador', descricao: 'Acesso total ao sistema',            nivel: 5, cor: 'red'    },
  { id: '2', nome: 'Gerente',       descricao: 'Acesso gerencial aos módulos',       nivel: 4, cor: 'orange' },
  { id: '3', nome: 'Operador',      descricao: 'Acesso operacional ao sistema',      nivel: 3, cor: 'blue'   },
  { id: '4', nome: 'Visualizador',  descricao: 'Somente leitura',                   nivel: 2, cor: 'green'  },
  { id: '5', nome: 'Restrito',      descricao: 'Acesso mínimo — apenas login',       nivel: 1, cor: 'yellow' },
]

function carregarPermissoes(): NivelPermissao[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : permissoesPadrao
  } catch {
    return permissoesPadrao
  }
}

function salvarPermissoes(lista: NivelPermissao[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

export function PermissionsPage() {
  const [permissoes, setPermissoes] = useState<NivelPermissao[]>(carregarPermissoes)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [nivel, setNivel] = useState(1)
  const [cor, setCor] = useState('blue')
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    salvarPermissoes(permissoes)
  }, [permissoes])

  function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('O nome é obrigatório.'); return }

    const nova: NivelPermissao = {
      id: Date.now().toString(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      nivel,
      cor,
    }
    setPermissoes((prev) => [...prev].sort((a, b) => b.nivel - a.nivel).concat(nova).sort((a, b) => b.nivel - a.nivel))
    setNome(''); setDescricao(''); setNivel(1); setCor('blue')
    setErro(null); setMostrarForm(false)
  }

  function handleRemover(id: string) {
    setPermissoes((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Controle de Permissões de Usuário</h2>
        {mostrarForm ? (
          <Button variant="outline" onClick={() => setMostrarForm(false)}>
            Cancelar
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setMostrarForm(true)}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Criar
          </Button>
        )}
      </div>

      {mostrarForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Permissão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCriar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="perm-nome">Nome</Label>
                  <Input id="perm-nome" value={nome} onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Supervisor" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="perm-nivel">Nível (1–5)</Label>
                  <Input id="perm-nivel" type="number" min={1} max={5} value={nivel}
                    onChange={(e) => setNivel(Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="perm-descricao">Descrição</Label>
                <Input id="perm-descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o nível de acesso" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="perm-cor">Cor</Label>
                <select id="perm-cor" value={cor} onChange={(e) => setCor(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm">
                  {COR_OPTIONS.map((c) => (
                    <option key={c.valor} value={c.valor}>{c.label}</option>
                  ))}
                </select>
              </div>
              {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Criar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {permissoes
          .slice()
          .sort((a, b) => b.nivel - a.nivel)
          .map((p) => (
            <Card key={p.id}>
              <CardContent className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{p.nome}</span>
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${COR_BADGE[p.cor] ?? COR_BADGE.blue}`}>
                        Nível {p.nivel}
                      </span>
                    </div>
                    {p.descricao && (
                      <p className="text-xs text-muted-foreground truncate">{p.descricao}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${p.nome}`}
                  onClick={() => handleRemover(p.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
