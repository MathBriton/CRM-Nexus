import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LoginPage } from './LoginPage'

function renderLogin() {
  return renderWithProviders(<LoginPage />)
}

describe('LoginPage', () => {
  it('exibe campos de usuário e senha', () => {
    renderLogin()
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('exibe o nome do sistema', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: /nexus/i })).toBeInTheDocument()
  })

  it('exibe erro com credenciais inválidas', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/usuário/i), 'invalido')
    await user.type(screen.getByLabelText(/senha/i), 'errado')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/credenciais inválidas/i)
    )
  })

  it('reabilita o botão após falha no login', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/usuário/i), 'invalido')
    await user.type(screen.getByLabelText(/senha/i), 'errado')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled()
  })

  it('não exibe erro antes de submeter', () => {
    renderLogin()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
