import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PainelPermissoes } from '@/components/permissoes/PainelPermissoes'
import { ModalImportar } from '@/components/permissoes/ModalImportar'
import {
  listarUsuarios,
  carregarPermissoes,
  salvarPermissoes,
  importarPermissoes,
} from '@/services/permissaoService'
import type { NexusUsuario, ItemPermissao } from '@/types/permissao'

export function AcessosUsuariosPage() {
  const [usuarios, setUsuarios] = useState<NexusUsuario[]>([])
  const [buscaUsuario, setBuscaUsuario] = useState('')
  const [selecionado, setSelecionado] = useState<NexusUsuario | null>(null)
  const [servicos, setServicos] = useState<ItemPermissao[]>([])
  const [consultas, setConsultas] = useState<ItemPermissao[]>([])
  const [carregando, setCarregando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => toast.error('Falha ao carregar lista de usuários.'))
  }, [])

  const usuariosFiltrados = buscaUsuario
    ? usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
          u.login.toLowerCase().includes(buscaUsuario.toLowerCase()),
      )
    : usuarios

  async function selecionarUsuario(usuario: NexusUsuario) {
    setSelecionado(usuario)
    setBuscaUsuario(usuario.nome)
    setCarregando(true)
    try {
      const { servicos: s, consultas: c } = await carregarPermissoes(
        usuario.matricula,
        usuario.filial,
      )
      setServicos(s)
      setConsultas(c)
    } catch {
      toast.error('Falha ao carregar permissões.')
    } finally {
      setCarregando(false)
    }
  }

  const toggleServico = useCallback((codigo: string, habilitado: boolean) => {
    setServicos((prev) => prev.map((i) => (i.codigo === codigo ? { ...i, habilitado } : i)))
  }, [])

  const toggleConsulta = useCallback((codigo: string, habilitado: boolean) => {
    setConsultas((prev) => prev.map((i) => (i.codigo === codigo ? { ...i, habilitado } : i)))
  }, [])

  async function handleSalvar() {
    if (!selecionado) return
    setSalvando(true)
    try {
      await salvarPermissoes(selecionado.matricula, selecionado.filial, {
        servicosHabilitados: servicos.filter((i) => i.habilitado).map((i) => i.codigo),
        consultasHabilitadas: consultas.filter((i) => i.habilitado).map((i) => i.codigo),
      })
      toast.success('Permissões salvas com sucesso.')
    } catch {
      toast.error('Falha ao salvar permissões.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleImportar(matriculaOrigem: string, filialOrigem: string) {
    if (!selecionado) return
    await importarPermissoes(selecionado.matricula, selecionado.filial, {
      matriculaOrigem,
      filialOrigem,
    })
    const { servicos: s, consultas: c } = await carregarPermissoes(
      selecionado.matricula,
      selecionado.filial,
    )
    setServicos(s)
    setConsultas(c)
    toast.success('Permissões importadas com sucesso.')
  }

  return (
    <div className="flex flex-col gap-5 p-6 h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold">Acessos de Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie permissões de serviços e consultas por usuário.
          </p>
        </div>
        {selecionado && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalImportar(true)}>
              Importar de outro usuário
            </Button>
            <Button size="sm" onClick={handleSalvar} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar permissões'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <Label htmlFor="busca-usuario" className="text-xs font-semibold">
          Usuário
        </Label>
        <div className="relative">
          <Input
            id="busca-usuario"
            value={buscaUsuario}
            onChange={(e) => {
              setBuscaUsuario(e.target.value)
              if (selecionado && e.target.value !== selecionado.nome) setSelecionado(null)
            }}
            placeholder="Buscar por nome ou login..."
            className="h-9 text-sm"
            autoComplete="off"
          />
          {buscaUsuario && !selecionado && usuariosFiltrados.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border rounded-md bg-card shadow-lg max-h-52 overflow-y-auto divide-y text-sm">
              {usuariosFiltrados.slice(0, 20).map((u) => (
                <li key={u.id}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                    onClick={() => selecionarUsuario(u)}
                  >
                    <span className="block font-medium">{u.nome}</span>
                    <span className="text-xs text-muted-foreground">{u.login}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {carregando && (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando permissões...</p>
      )}

      {!carregando && selecionado && (
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <PainelPermissoes
            titulo="Serviços"
            itens={servicos}
            corTitulo="text-blue-500"
            onToggle={toggleServico}
          />
          <PainelPermissoes
            titulo="Consultas"
            itens={consultas}
            corTitulo="text-emerald-500"
            onToggle={toggleConsulta}
          />
        </div>
      )}

      {!selecionado && !carregando && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Selecione um usuário para gerenciar suas permissões.
        </div>
      )}

      {modalImportar && (
        <ModalImportar
          usuarios={usuarios.filter((u) => u.id !== selecionado?.id)}
          onImportar={handleImportar}
          onFechar={() => setModalImportar(false)}
        />
      )}
    </div>
  )
}
