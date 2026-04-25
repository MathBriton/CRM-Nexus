import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { Sidebar } from './Sidebar'

function renderSidebar(route = '/products') {
  return renderWithProviders(<Sidebar />, { route })
}

describe('Sidebar', () => {
  it('exibe todos os módulos de navegação', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /ir para o dashboard/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /dashboard/i })).toHaveLength(2)
    expect(screen.getByRole('link', { name: /produtos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /recebimento/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /financeiro/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /insumos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /fichas técnicas/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /usuários/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /permissões/i })).toBeInTheDocument()
  })

  it('destaca o link da rota ativa', () => {
    renderSidebar('/products')
    const linkAtivo = screen.getByRole('link', { name: /produtos/i })
    expect(linkAtivo).toHaveAttribute('aria-current', 'page')
  })

  it('não destaca links de rotas inativas', () => {
    renderSidebar('/products')
    const linkInativo = screen.getByRole('link', { name: /financeiro/i })
    expect(linkInativo).not.toHaveAttribute('aria-current', 'page')
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
})
