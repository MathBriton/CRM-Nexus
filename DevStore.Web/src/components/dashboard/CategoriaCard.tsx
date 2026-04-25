import { useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Categoria } from '@/data/dashboardMock'

const corClasses: Record<string, string> = {
  blue:   'bg-blue-50   text-blue-600   dark:bg-blue-950',
  green:  'bg-green-50  text-green-600  dark:bg-green-950',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950',
  cyan:   'bg-cyan-50   text-cyan-600   dark:bg-cyan-950',
  red:    'bg-red-50    text-red-600    dark:bg-red-950',
}

interface CategoriaCardProps {
  categoria: Categoria
}

export function CategoriaCard({ categoria }: CategoriaCardProps) {
  const navigate = useNavigate()
  const menuMaisUsado = [...categoria.menus].sort((a, b) => b.acessos - a.acessos)[0]
  const corClass = corClasses[categoria.cor] ?? corClasses.blue
  const Icon = categoria.icone

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(categoria.path)}
      role="button"
      aria-label={`Ir para ${categoria.nome}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={`rounded-lg p-2 ${corClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {categoria.menus.length} {categoria.menus.length === 1 ? 'menu' : 'menus'}
          </Badge>
        </div>
        <CardTitle className="text-base mt-2">{categoria.nome}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mt-1 rounded-md bg-muted/60 px-3 py-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Mais acessado</span>
          </div>
          <p className="text-sm font-medium truncate">{menuMaisUsado.nome}</p>
          <p className="text-xs text-muted-foreground">{menuMaisUsado.acessos.toLocaleString('pt-BR')} acessos</p>
        </div>
      </CardContent>
    </Card>
  )
}
