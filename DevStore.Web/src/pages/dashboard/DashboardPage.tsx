import { CategoriaCard } from '@/components/dashboard/CategoriaCard'
import { GraficoFinanceiro } from '@/components/dashboard/GraficoFinanceiro'
import { categoriasMock } from '@/data/dashboardMock'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">Visão Geral</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Resumo de acessos por categoria e menu mais utilizado.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoriasMock.map((cat) => (
            <CategoriaCard key={cat.nome} categoria={cat} />
          ))}
        </div>
      </div>

      <GraficoFinanceiro />
    </div>
  )
}
