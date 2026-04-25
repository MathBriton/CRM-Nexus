import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { UserList } from './UserList'

describe('UserList', () => {
  it('exibe os usuários carregados', async () => {
    renderWithProviders(<UserList onEditar={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('gerente')).toBeInTheDocument()
    })
  })

  it('exibe badges de papel e status', async () => {
    renderWithProviders(<UserList onEditar={() => {}} />)

    await waitFor(() => {
      expect(screen.getAllByText('Administrador')).not.toHaveLength(0)
      expect(screen.getAllByText('Ativo')).toHaveLength(2)
    })
  })

  it('chama onEditar ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const onEditar = vi.fn()
    renderWithProviders(<UserList onEditar={onEditar} />)

    await waitFor(() => screen.getAllByRole('button', { name: 'Editar' }))
    await user.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(onEditar).toHaveBeenCalledWith(expect.objectContaining({ username: 'admin' }))
  })

  it('botão desativar chama o serviço', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserList onEditar={() => {}} />)

    await waitFor(() => screen.getAllByRole('button', { name: 'Desativar' }))
    await user.click(screen.getAllByRole('button', { name: 'Desativar' })[0])

    await waitFor(() => {
      expect(screen.getAllByText('Inativo')).toHaveLength(1)
    })
  })
})
