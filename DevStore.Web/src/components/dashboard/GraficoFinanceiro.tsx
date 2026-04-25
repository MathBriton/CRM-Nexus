import { useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dadosFinanceiros, periodos } from '@/data/dashboardMock'
import type { PeriodoFinanceiro } from '@/data/dashboardMock'
import { cn } from '@/lib/utils'

function formatarReais(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function GraficoFinanceiro() {
  const [periodo, setPeriodo] = useState<PeriodoFinanceiro>('mes')
  const dados = dadosFinanceiros[periodo]

  const totalReceita = dados.reduce((s, d) => s + d.receita, 0)
  const totalDespesa = dados.reduce((s, d) => s + d.despesa, 0)
  const resultado = totalReceita - totalDespesa

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Receita vs Despesa</CardTitle>

          <div className="flex flex-wrap gap-1" role="group" aria-label="Selecionar período">
            {periodos.map((p) => (
              <button
                key={p.valor}
                onClick={() => setPeriodo(p.valor)}
                aria-pressed={periodo === p.valor}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  periodo === p.valor
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Receita</p>
            <p className="text-lg font-semibold text-green-600">{formatarReais(totalReceita)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Despesa</p>
            <p className="text-lg font-semibold text-red-500">{formatarReais(totalDespesa)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Resultado</p>
            <p className={cn('text-lg font-semibold', resultado >= 0 ? 'text-green-600' : 'text-red-500')}>
              {formatarReais(resultado)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={52} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatarReais(value),
                  name === 'receita' ? 'Receita' : 'Despesa',
                ]}
              />
              <Legend formatter={(v) => (v === 'receita' ? 'Receita' : 'Despesa')} />
              <Area type="monotone" dataKey="receita" stroke="#22c55e" fill="url(#gradReceita)" strokeWidth={2} />
              <Area type="monotone" dataKey="despesa" stroke="#ef4444" fill="url(#gradDespesa)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
