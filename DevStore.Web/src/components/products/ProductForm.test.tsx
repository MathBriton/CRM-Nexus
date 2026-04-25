import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductForm } from './ProductForm'

describe('ProductForm', () => {
  it('exibe os campos do formulário', () => {
    render(<ProductForm onSucesso={() => {}} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/preço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estoque/i)).toBeInTheDocument()
  })

  it('chama onSucesso após criar produto com sucesso', async () => {
    const user = userEvent.setup()
    const onSucesso = vi.fn()
    render(<ProductForm onSucesso={onSucesso} />)

    await user.type(screen.getByLabelText(/nome/i), 'Teclado')
    await user.type(screen.getByLabelText(/descrição/i), 'Mecânico')
    await user.type(screen.getByLabelText(/preço/i), '350')
    await user.type(screen.getByLabelText(/estoque/i), '20')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(onSucesso).toHaveBeenCalledOnce())
  })

  it('preenche os campos ao editar produto existente', () => {
    const produto = { id: 1, name: 'Notebook', description: 'Gamer', price: 4999, stock: 10, createdAt: '' }
    render(<ProductForm produto={produto} onSucesso={() => {}} />)

    expect(screen.getByLabelText(/nome/i)).toHaveValue('Notebook')
    expect(screen.getByLabelText(/preço/i)).toHaveValue(4999)
    expect(screen.getByLabelText(/estoque/i)).toHaveValue(10)
  })

  it('chama onSucesso após atualizar produto com sucesso', async () => {
    const user = userEvent.setup()
    const onSucesso = vi.fn()
    const produto = { id: 1, name: 'Notebook', description: 'Gamer', price: 4999, stock: 10, createdAt: '' }
    render(<ProductForm produto={produto} onSucesso={onSucesso} />)

    await user.clear(screen.getByLabelText(/nome/i))
    await user.type(screen.getByLabelText(/nome/i), 'Notebook Pro')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(onSucesso).toHaveBeenCalledOnce())
  })
})
