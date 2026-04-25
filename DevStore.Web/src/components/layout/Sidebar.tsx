import { NavLink, useNavigate } from 'react-router-dom'
import {
  Package, PackageCheck, DollarSign, FlaskConical,
  FileText, Users, Shield, LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const modulos = [
  { label: 'Produtos',        path: '/products',         icon: Package },
  { label: 'Recebimento',     path: '/receiving',        icon: PackageCheck },
  { label: 'Financeiro',      path: '/financial',        icon: DollarSign },
  { label: 'Insumos',         path: '/inputs',           icon: FlaskConical },
  { label: 'Fichas Técnicas', path: '/technical-sheets', icon: FileText },
  { label: 'Usuários',        path: '/users',            icon: Users },
  { label: 'Permissões',      path: '/permissions',      icon: Shield },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Package className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">DevStore</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {modulos.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
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
