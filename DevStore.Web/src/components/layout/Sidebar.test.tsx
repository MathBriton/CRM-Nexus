import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { Sidebar } from './Sidebar'

function renderSidebar(route = '/products') {
  return renderWithProviders(<Sidebar />, { route })
}

describe('Sidebar', () => {
  it('exibe link da marca Nexus e link do dashboard', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /ir para o dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeInTheDocument()
  })

  it('exibe todos os botões de categoria de navegação', () => {
    renderSidebar()
    expect(screen.getByRole('button', { name: /produtos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /recebimento/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /financeiro/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /insumos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fichas técnicas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /usuários/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /permissões/i })).toBeInTheDocument()
  })

  it('abre accordion ao clicar em uma categoria', async () => {
    const user = userEvent.setup()
    renderSidebar('/dashboard')
    await user.click(screen.getByRole('button', { name: /financeiro/i }))
    expect(screen.getByRole('link', { name: /contas a pagar/i })).toBeInTheDocument()
  })

  it('fecha accordion de outra categoria ao abrir nova', async () => {
    const user = userEvent.setup()
    renderSidebar('/dashboard')
    await user.click(screen.getByRole('button', { name: /financeiro/i }))
    expect(screen.getByRole('link', { name: /contas a pagar/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /insumos/i }))
    expect(screen.queryByRole('link', { name: /contas a pagar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /movimentação/i })).toBeInTheDocument()
  })

  it('exibe botão de logout', () => {
    localStorage.setItem('auth_token', 'fake-jwt-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))
    renderSidebar()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('exibe nome do usuário logado', () => {
    localStorage.setItem('auth_token', 'fake-jwt-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))
    renderSidebar()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('exibe botão de alternar tema', () => {
    renderSidebar()
    const toggleBtn = screen.getByRole('button', { name: /modo/i })
    expect(toggleBtn).toBeInTheDocument()
  })
})
