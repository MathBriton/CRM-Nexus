import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { Sidebar } from './Sidebar'

function renderSidebar(route = '/dashboard') {
  return renderWithProviders(<Sidebar />, { route })
}

describe('Sidebar', () => {
  it('exibe link da marca Nexus e link do dashboard', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /ir para o dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeInTheDocument()
  })

  it('exibe o rótulo de seção Serviços', () => {
    renderSidebar()
    expect(screen.getByText(/^serviços$/i)).toBeInTheDocument()
  })

  it('exibe todos os botões de categoria de navegação', () => {
    renderSidebar()
    expect(screen.getByRole('button', { name: /administrador/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /financeiro/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^pedidos$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sgq/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /validações/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /desenvolvimento/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /expedição/i })).toBeInTheDocument()
  })

  it('abre accordion ao clicar em uma categoria', async () => {
    const user = userEvent.setup()
    renderSidebar('/dashboard')
    await user.click(screen.getByRole('button', { name: /^pedidos$/i }))
    expect(screen.getByRole('link', { name: /^pedidos brasil$/i })).toBeInTheDocument()
  })

  it('fecha accordion de outra categoria ao abrir nova', async () => {
    const user = userEvent.setup()
    renderSidebar('/dashboard')
    await user.click(screen.getByRole('button', { name: /^pedidos$/i }))
    expect(screen.getByRole('link', { name: /^pedidos brasil$/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /financeiro/i }))
    expect(screen.queryByRole('link', { name: /^pedidos brasil$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /alterar risco/i })).toBeInTheDocument()
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
