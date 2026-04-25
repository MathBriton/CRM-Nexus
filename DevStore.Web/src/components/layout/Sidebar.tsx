import { useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, PackageCheck, DollarSign,
  FlaskConical, FileText, Users, Shield, LogOut, ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
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

  const [abertos, setAbertos] = useState<Set<string>>(() => {
    const s = new Set<string>()
    categorias.forEach(c => {
      if (pathname.startsWith(c.path)) s.add(c.label)
    })
    return s
  })

  function toggleCategoria(label: string) {
    setAbertos(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-card">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-6 py-5 border-b hover:bg-muted/50 transition-colors"
        aria-label="Ir para o dashboard"
      >
        <Package className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">DevStore</span>
      </Link>

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

        {/* Categorias com accordion */}
        {categorias.map(cat => {
          const aberto = abertos.has(cat.label)
          return (
            <div key={cat.path}>
              {/* Linha da categoria: NavLink + botão chevron */}
              <div className="relative flex items-center">
                <NavLink
                  to={cat.path}
                  end={false}
                  onClick={() => { if (!aberto) toggleCategoria(cat.label) }}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-1 items-center gap-3 rounded-md px-3 py-2 pr-8 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  <cat.icon className={cn('h-4 w-4 shrink-0', cat.corIcon)} />
                  <span className="truncate">{cat.label}</span>
                </NavLink>

                <button
                  onClick={() => toggleCategoria(cat.label)}
                  className="absolute right-1 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Expandir ${cat.label}`}
                  aria-expanded={aberto}
                >
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      aberto && 'rotate-180',
                    )}
                  />
                </button>
              </div>

              {/* Sub-menus */}
              {aberto && (
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

      <div className="border-t px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium truncate">{user?.name}</span>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  )
}
