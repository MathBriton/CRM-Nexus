import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import { DashboardLayout } from './DashboardLayout'

function renderDashboard(route = '/dashboard') {
  localStorage.setItem('auth_token', 'fake-jwt-token')
  localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))

  return renderWithProviders(
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<p>Conteúdo Dashboard</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('DashboardLayout', () => {
  it('exibe a sidebar de navegação', () => {
    renderDashboard()
    expect(screen.getByRole('button', { name: /administrador/i })).toBeInTheDocument()
  })

  it('renderiza o conteúdo da rota filha', () => {
    renderDashboard()
    expect(screen.getByText('Conteúdo Dashboard')).toBeInTheDocument()
  })

  it('exibe o nome do usuário na sidebar', () => {
    renderDashboard()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
