import { useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, PackageCheck, DollarSign,
  FlaskConical, FileText, Users, Shield, LogOut, ChevronDown,
  Sun, Moon,
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
    label: 'Produtos',
    path: '/products',
    icon: Package,
    corIcon: 'text-blue-500',
    menus: [
      { label: 'Controle de Estoque', path: '/products/estoque' },
      { label: 'Tabela de Preços',    path: '/products/precos' },
    ],
  },
  {
    label: 'Recebimento',
    path: '/receiving',
    icon: PackageCheck,
    corIcon: 'text-green-500',
    menus: [
      { label: 'Ordens de Compra',  path: '/receiving/orders' },
      { label: 'Notas Fiscais',     path: '/receiving/invoices' },
      { label: 'Fornecedores',      path: '/receiving/suppliers' },
    ],
  },
  {
    label: 'Financeiro',
    path: '/financial',
    icon: DollarSign,
    corIcon: 'text-yellow-500',
    menus: [
      { label: 'Contas a Pagar',   path: '/financial/payables' },
      { label: 'Contas a Receber', path: '/financial/receivables' },
      { label: 'Centros de Custo', path: '/financial/cost-centers' },
    ],
  },
  {
    label: 'Insumos',
    path: '/inputs',
    icon: FlaskConical,
    corIcon: 'text-purple-500',
    menus: [
      { label: 'Cadastro',               path: '/inputs/cadastro' },
      { label: 'Movimentação',           path: '/inputs/movements' },
      { label: 'Solicitações de Compra', path: '/inputs/requests' },
    ],
  },
  {
    label: 'Fichas Técnicas',
    path: '/technical-sheets',
    icon: FileText,
    corIcon: 'text-orange-500',
    menus: [
      { label: 'Fichas de Produção',    path: '/technical-sheets/sheets' },
      { label: 'Composição',            path: '/technical-sheets/composition' },
      { label: 'Controle de Qualidade', path: '/technical-sheets/quality' },
    ],
  },
  {
    label: 'Usuários',
    path: '/users',
    icon: Users,
    corIcon: 'text-cyan-500',
    menus: [
      { label: 'Grupos de Acesso',     path: '/users/groups' },
      { label: 'Histórico de Acessos', path: '/users/history' },
    ],
  },
  {
    label: 'Permissões',
    path: '/permissions',
    icon: Shield,
    corIcon: 'text-red-500',
    menus: [
      { label: 'Perfis de Acesso', path: '/permissions/profiles' },
      { label: 'Log de Auditoria', path: '/permissions/audit' },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  const [aberto, setAberto] = useState<string | null>(() => {
    const ativa = categorias.find(c => pathname.startsWith(c.path))
    return ativa?.label ?? null
  })

  function toggleCategoria(label: string) {
    setAberto(prev => (prev === label ? null : label))
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-card">

      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-700/10 to-transparent" />
        <Link
          to="/dashboard"
          className="relative flex items-center gap-3 px-5 py-4 transition-opacity hover:opacity-90"
          aria-label="Ir para o dashboard"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-md shadow-purple-500/30">
            <span className="select-none text-base font-extrabold tracking-tight text-white">N</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-base font-bold text-transparent">
              Nexus
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Sistema de Gestão
            </span>
          </div>
        </Link>
      </div>

      {/* ── Navegação ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
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
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          Dashboard
        </NavLink>

        {/* Categorias com accordion exclusivo */}
        {categorias.map(cat => {
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
                <cat.icon className={cn('h-4 w-4 shrink-0', cat.corIcon)} />
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
                <div className="ml-7 mt-0.5 mb-1 space-y-0.5 border-l border-border pl-3">
                  {cat.menus.map(menu => (
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
      <div className="border-t px-4 py-3 flex items-center justify-between gap-2">
        <span className="min-w-0 text-sm font-medium truncate">{user?.name}</span>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
