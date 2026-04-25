import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

function ComponenteDeTesteAuth() {
  const { user, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="autenticado">{isAuthenticated ? 'sim' : 'não'}</span>
      <span data-testid="usuario">{user?.name ?? 'nenhum'}</span>
      <button onClick={() => login('admin', 'admin123')}>Login válido</button>
      <button onClick={() => login('x', 'errado')}>Login inválido</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function renderAuth() {
  return render(<AuthProvider><ComponenteDeTesteAuth /></AuthProvider>)
}

describe('AuthContext', () => {
  it('inicia não autenticado', () => {
    renderAuth()
    expect(screen.getByTestId('autenticado')).toHaveTextContent('não')
    expect(screen.getByTestId('usuario')).toHaveTextContent('nenhum')
  })

  it('autentica com credenciais válidas', async () => {
    const user = userEvent.setup()
    renderAuth()

    await user.click(screen.getByRole('button', { name: /login válido/i }))

    await waitFor(() =>
      expect(screen.getByTestId('autenticado')).toHaveTextContent('sim')
    )
    expect(screen.getByTestId('usuario')).toHaveTextContent('Admin')
  })

  it('lança erro com credenciais inválidas', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await expect(result.current.login('x', 'errado')).rejects.toThrow('Credenciais inválidas')
  })

  it('desloga e limpa o estado', async () => {
    const user = userEvent.setup()
    renderAuth()

    await user.click(screen.getByRole('button', { name: /login válido/i }))
    await waitFor(() => expect(screen.getByTestId('autenticado')).toHaveTextContent('sim'))

    await user.click(screen.getByRole('button', { name: /logout/i }))

    expect(screen.getByTestId('autenticado')).toHaveTextContent('não')
    expect(screen.getByTestId('usuario')).toHaveTextContent('nenhum')
  })

  it('persiste sessão via localStorage', async () => {
    const user = userEvent.setup()
    renderAuth()

    await user.click(screen.getByRole('button', { name: /login válido/i }))
    await waitFor(() => expect(screen.getByTestId('autenticado')).toHaveTextContent('sim'))

    expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token')
  })

  it('restaura sessão ao inicializar com token no localStorage', async () => {
    localStorage.setItem('auth_token', 'fake-jwt-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))

    renderAuth()

    expect(screen.getByTestId('autenticado')).toHaveTextContent('sim')
    expect(screen.getByTestId('usuario')).toHaveTextContent('Admin')
  })
})
