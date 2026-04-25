import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { DashboardPage } from './DashboardPage'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

describe('DashboardPage', () => {
  it('exibe o título de visão geral', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByRole('heading', { name: /visão geral/i })).toBeInTheDocument()
  })

  it('renderiza um card para cada categoria', () => {
    renderWithProviders(<DashboardPage />)
    const cards = screen.getAllByRole('button', { name: /ir para/i })
    expect(cards.length).toBe(7)
  })

  it('exibe o card de Produtos com menu mais acessado', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Cadastro de Produtos')).toBeInTheDocument()
  })

  it('exibe o painel financeiro com o gráfico', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('altera o período ao clicar nos botões', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DashboardPage />)

    const btnSemana = screen.getByRole('button', { name: /semana/i })
    await user.click(btnSemana)
    expect(btnSemana).toHaveAttribute('aria-pressed', 'true')
  })

  it('exibe os totais de receita, despesa e resultado', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Receita')).toBeInTheDocument()
    expect(screen.getByText('Despesa')).toBeInTheDocument()
    expect(screen.getByText('Resultado')).toBeInTheDocument()
  })
})
