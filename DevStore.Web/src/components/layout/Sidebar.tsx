import { useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  UserCog,
  ClipboardList,
  Calculator,
  Recycle,
  UserCheck,
  ShoppingCart,
  Code2,
  Truck,
  Wallet,
  Receipt,
  Users,
  ShieldCheck,
  Wrench,
  BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface SubMenu {
  label: string
  path: string
}

interface Categoria {
  label: string
  path: string
  icon: React.ElementType
  corIcon: string
  menus: SubMenu[]
}

const categorias: Categoria[] = [
  {
    label: 'Administrador',
    path: '/admin',
    icon: UserCog,
    corIcon: 'text-red-500',
    menus: [
      { label: 'Acessos Usuários', path: '/admin/acessos-usuarios' },
      { label: 'Alterar usuário Nexus', path: '/admin/alterar-usuario-nexus' },
      { label: 'Cadastrar Usuário Nexus', path: '/admin/cadastrar-usuario-nexus' },
      { label: 'Cancelar Usuários', path: '/admin/cancelar-usuarios' },
      { label: 'Criação Usuários AD', path: '/admin/criacao-usuarios-ad' },
      { label: 'Desativar usuário Nexus', path: '/admin/desativar-usuario-nexus' },
      { label: 'Gerenciar Menus', path: '/admin/gerenciar-menus' },
      { label: 'Permissões de Usuário', path: '/admin/permissoes-usuario' },
      { label: 'Relatório de Permissão de Usuários', path: '/admin/relatorio-permissoes' },
      { label: 'Revisão de Usuários', path: '/admin/revisao-usuarios' },
    ],
  },
  {
    label: 'Cadastros FNC',
    path: '/cadastros-fnc',
    icon: ClipboardList,
    corIcon: 'text-orange-500',
    menus: [
      { label: 'Aprovador FNC', path: '/cadastros-fnc/aprovador' },
      { label: 'Defeitos de FNC', path: '/cadastros-fnc/defeitos' },
      { label: 'Responsável FNC', path: '/cadastros-fnc/responsavel' },
      { label: 'Setores de FNC', path: '/cadastros-fnc/setores' },
    ],
  },
  {
    label: 'Cadastros Orçamento',
    path: '/cadastros-orcamento',
    icon: Calculator,
    corIcon: 'text-amber-500',
    menus: [
      { label: 'Analista de Orçamento', path: '/cadastros-orcamento/analista' },
      { label: 'Aprovadores de Orçamento', path: '/cadastros-orcamento/aprovadores' },
      { label: 'Faixas de Aprovador de Orçamento', path: '/cadastros-orcamento/faixas-aprovador' },
    ],
  },
  {
    label: 'Cavaco/Aparas',
    path: '/cavaco-aparas',
    icon: Recycle,
    corIcon: 'text-lime-500',
    menus: [
      { label: 'Cadastro de Fornecedor', path: '/cavaco-aparas/cadastro-fornecedor' },
      { label: 'Controle de Recebimento', path: '/cavaco-aparas/controle-recebimento' },
    ],
  },
  {
    label: 'Cliente',
    path: '/cliente',
    icon: UserCheck,
    corIcon: 'text-green-500',
    menus: [{ label: 'Cadastro Unificado', path: '/cliente/cadastro-unificado' }],
  },
  {
    label: 'Compras',
    path: '/compras',
    icon: ShoppingCart,
    corIcon: 'text-teal-500',
    menus: [{ label: 'Classificar notas', path: '/compras/classificar-notas' }],
  },
  {
    label: 'Desenvolvimento',
    path: '/desenvolvimento',
    icon: Code2,
    corIcon: 'text-cyan-500',
    menus: [
      { label: 'Alteração de Produtos', path: '/desenvolvimento/alteracao-produtos' },
      { label: 'Aprovação Comercial SPD', path: '/desenvolvimento/aprovacao-comercial-spd' },
      { label: 'Lote Piloto', path: '/desenvolvimento/lote-piloto' },
      { label: 'Solicitação de SPD V2', path: '/desenvolvimento/solicitacao-spd-v2' },
      {
        label: 'Solicitação de projeto ao Desenvolvimento (SPD)',
        path: '/desenvolvimento/solicitacao-spd',
      },
    ],
  },
  {
    label: 'Expedição',
    path: '/expedicao',
    icon: Truck,
    corIcon: 'text-sky-500',
    menus: [
      { label: 'Checklist Transporte', path: '/expedicao/checklist-transporte' },
      { label: 'Gerenciar Cargas', path: '/expedicao/gerenciar-cargas' },
    ],
  },
  {
    label: 'Financeiro',
    path: '/financeiro',
    icon: Wallet,
    corIcon: 'text-blue-500',
    menus: [
      { label: 'Alterar Risco', path: '/financeiro/alterar-risco' },
      { label: 'Cadastro Canhoto', path: '/financeiro/cadastro-canhoto' },
      { label: 'Solicitar Aumento de Crédito', path: '/financeiro/solicitar-aumento-credito' },
      {
        label: 'Solicitar Transferência de Crédito',
        path: '/financeiro/solicitar-transferencia-credito',
      },
      { label: 'Validadores de Crédito', path: '/financeiro/validadores-credito' },
    ],
  },
  {
    label: 'Pedidos',
    path: '/pedidos',
    icon: Receipt,
    corIcon: 'text-indigo-500',
    menus: [
      { label: 'Alterar Pedidos Brasil', path: '/pedidos/alterar-pedidos-brasil' },
      { label: 'Definir Entrega no Fim de Semana', path: '/pedidos/entrega-fim-semana' },
      { label: 'Inclusão OBS NF', path: '/pedidos/inclusao-obs-nf' },
      { label: 'Liberar emissão de pedido para esta data', path: '/pedidos/liberar-emissao' },
      { label: 'Orçamento Brasil', path: '/pedidos/orcamento-brasil' },
      { label: 'Parâmetros Pedidos', path: '/pedidos/parametros' },
      { label: 'Pedido de chapa', path: '/pedidos/pedido-chapa' },
      { label: 'Pedidos', path: '/pedidos/pedidos' },
      { label: 'Pedidos Brasil', path: '/pedidos/pedidos-brasil' },
      { label: 'Pedidos Digitados', path: '/pedidos/pedidos-digitados' },
      { label: 'Solicitar Alteração de Pedido', path: '/pedidos/solicitar-alteracao' },
    ],
  },
  {
    label: 'RH',
    path: '/rh',
    icon: Users,
    corIcon: 'text-violet-500',
    menus: [
      { label: 'Importar do ADP', path: '/rh/importar-adp' },
      { label: 'Impressão de Crachá', path: '/rh/impressao-cracha' },
    ],
  },
  {
    label: 'SGQ',
    path: '/sgq',
    icon: ShieldCheck,
    corIcon: 'text-purple-500',
    menus: [
      { label: 'Analisar FNC', path: '/sgq/analisar-fnc' },
      { label: 'Aprovação FNC', path: '/sgq/aprovacao-fnc' },
      { label: 'Cadastro Refugo PPM', path: '/sgq/cadastro-refugo-ppm' },
      { label: 'Cadastro de FNC - Brasil', path: '/sgq/cadastro-fnc-brasil' },
      { label: 'Responder FNC', path: '/sgq/responder-fnc' },
    ],
  },
  {
    label: 'Utilitários',
    path: '/utilitarios',
    icon: Wrench,
    corIcon: 'text-fuchsia-500',
    menus: [{ label: 'Alterar Senha', path: '/utilitarios/alterar-senha' }],
  },
  {
    label: 'Validações',
    path: '/validacoes',
    icon: BadgeCheck,
    corIcon: 'text-rose-500',
    menus: [
      { label: 'Papel', path: '/validacoes/papel' },
      { label: 'Parâmetros Validação de Pedidos', path: '/validacoes/parametros-validacao' },
      { label: 'Solicitações de Crédito', path: '/validacoes/solicitacoes-credito' },
      { label: 'Validar Alteração de Pedido', path: '/validacoes/validar-alteracao-pedido' },
      { label: 'Validar Pedido', path: '/validacoes/validar-pedido' },
      { label: 'Validar Pedido Brasil', path: '/validacoes/validar-pedido-brasil' },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  const [aberto, setAberto] = useState<string | null>(() => {
    const ativa = categorias.find((c) => pathname.startsWith(c.path))
    return ativa?.label ?? null
  })

  function toggleCategoria(label: string) {
    setAberto((prev) => (prev === label ? null : label))
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="bg-card flex h-full w-60 flex-col border-r">
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-700/10 to-transparent" />
        <Link
          to="/dashboard"
          className="relative flex items-center gap-3 px-5 py-4 transition-opacity hover:opacity-90"
          aria-label="Ir para o dashboard"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-md shadow-purple-500/30">
            <span className="text-base font-extrabold tracking-tight text-white select-none">
              N
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-base font-bold text-transparent">
              Nexus
            </span>
          </div>
        </Link>
      </div>

      {/* ── Navegação ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          <LayoutDashboard className="h-4 w-4 shrink-0 text-purple-400 dark:text-purple-300 [filter:brightness(1.2)_drop-shadow(0_0_6px_currentColor)]" />
          Dashboard
        </NavLink>

        {/* Seção Serviços */}
        <p className="text-muted-foreground/60 mt-3 mb-1 px-3 text-[10px] font-semibold tracking-widest uppercase">
          Serviços
        </p>

        {/* Categorias com accordion exclusivo */}
        {categorias.map((cat) => {
          const estaAberto = aberto === cat.label
          const estaAtivo = pathname.startsWith(cat.path)

          return (
            <div key={cat.path}>
              {/* Botão da categoria — apenas abre/fecha dropdown, sem navegar */}
              <button
                onClick={() => toggleCategoria(cat.label)}
                aria-expanded={estaAberto}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  estaAberto || estaAtivo
                    ? 'bg-primary/10 text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <cat.icon
                  className={cn(
                    'h-4 w-4 shrink-0 [filter:brightness(1.2)_drop-shadow(0_0_6px_currentColor)]',
                    cat.corIcon,
                  )}
                />
                <span className="flex-1 truncate text-left">{cat.label}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                    estaAberto && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Sub-menus */}
              {estaAberto && (
                <div className="border-border mt-0.5 mb-1 ml-7 space-y-0.5 border-l pl-3">
                  {cat.menus.map((menu) => (
                    <NavLink
                      key={menu.path}
                      to={menu.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      {menu.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Rodapé: usuário + dark mode + logout ─────────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <span className="min-w-0 truncate text-sm font-medium">{user?.name}</span>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
