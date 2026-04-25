import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { UserForm } from './UserForm'
import type { User } from '@/types/user'

const usuarioExistente: User = {
  id: 1,
  username: 'admin',
  name: 'Administrador',
  email: 'admin@devstore.com',
  role: 'Admin',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
}

describe('UserForm — criar', () => {
  it('exibe título "Novo Usuário"', () => {
    renderWithProviders(<UserForm onSucesso={() => {}} />)
    expect(screen.getByRole('heading', { name: /novo usuário/i })).toBeInTheDocument()
  })

  it('exibe campos de username e senha no modo criar', () => {
    renderWithProviders(<UserForm onSucesso={() => {}} />)
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('chama onSucesso após criar com sucesso', async () => {
    const user = userEvent.setup()
    const onSucesso = vi.fn()
    renderWithProviders(<UserForm onSucesso={onSucesso} />)

    await user.type(screen.getByLabelText(/usuário/i), 'novousr')
    await user.type(screen.getByLabelText(/nome completo/i), 'Novo Usuário')
    await user.type(screen.getByLabelText(/e-mail/i), 'novo@dev.com')
    await user.type(screen.getByLabelText(/senha/i), 'Senha@123')
    await user.click(screen.getByRole('button', { name: /criar usuário/i }))

    await waitFor(() => expect(onSucesso).toHaveBeenCalledOnce())
  })
})

describe('UserForm — editar', () => {
  it('exibe título "Editar Usuário"', () => {
    renderWithProviders(<UserForm usuario={usuarioExistente} onSucesso={() => {}} />)
    expect(screen.getByRole('heading', { name: /editar usuário/i })).toBeInTheDocument()
  })

  it('não exibe campos de username e senha no modo editar', () => {
    renderWithProviders(<UserForm usuario={usuarioExistente} onSucesso={() => {}} />)
    expect(screen.queryByLabelText(/^usuário$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument()
  })

  it('preenche campos com dados do usuário', () => {
    renderWithProviders(<UserForm usuario={usuarioExistente} onSucesso={() => {}} />)
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Administrador')
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue('admin@devstore.com')
  })

  it('chama onSucesso após editar com sucesso', async () => {
    const user = userEvent.setup()
    const onSucesso = vi.fn()
    renderWithProviders(<UserForm usuario={usuarioExistente} onSucesso={onSucesso} />)

    await user.clear(screen.getByLabelText(/nome completo/i))
    await user.type(screen.getByLabelText(/nome completo/i), 'Admin Editado')
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => expect(onSucesso).toHaveBeenCalledOnce())
  })
})
