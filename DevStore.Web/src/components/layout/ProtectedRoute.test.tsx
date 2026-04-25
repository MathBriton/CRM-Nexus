import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redireciona para /login quando não autenticado', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<p>Página de Login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<p>Conteúdo Protegido</p>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument()
  })

  it('exibe conteúdo quando autenticado', () => {
    localStorage.setItem('auth_token', 'fake-jwt-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<p>Página de Login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<p>Conteúdo Protegido</p>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument()
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument()
  })
})
