import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('exibe o título da aplicação', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /devstore/i })).toBeInTheDocument()
  })

  it('exibe a lista de produtos ao carregar', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Notebook')).toBeInTheDocument())
  })

  it('exibe o formulário ao clicar em Novo Produto', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /novo produto/i }))

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
  })

  it('oculta o formulário após criar produto com sucesso', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /novo produto/i }))
    await user.type(screen.getByLabelText(/nome/i), 'Teclado')
    await user.type(screen.getByLabelText(/descrição/i), 'Mecânico')
    await user.type(screen.getByLabelText(/preço/i), '350')
    await user.type(screen.getByLabelText(/estoque/i), '20')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() =>
      expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
    )
  })

  it('recarrega a lista após criar produto', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => screen.getByText('Notebook'))
    await user.click(screen.getByRole('button', { name: /novo produto/i }))
    await user.type(screen.getByLabelText(/nome/i), 'Teclado')
    await user.type(screen.getByLabelText(/descrição/i), 'Mecânico')
    await user.type(screen.getByLabelText(/preço/i), '350')
    await user.type(screen.getByLabelText(/estoque/i), '20')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() =>
      expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
    )
    expect(screen.getByText('Notebook')).toBeInTheDocument()
  })

  it('abre formulário de edição ao clicar em Editar na lista', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => screen.getByText('Notebook'))
    await user.click(screen.getAllByRole('button', { name: /editar/i })[0])

    expect(screen.getByLabelText(/nome/i)).toHaveValue('Notebook')
  })

  it('exibe título Editar Produto no formulário de edição', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => screen.getByText('Notebook'))
    await user.click(screen.getAllByRole('button', { name: /editar/i })[0])

    expect(screen.getByRole('heading', { name: /editar produto/i })).toBeInTheDocument()
  })

  it('oculta formulário após editar produto com sucesso', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => screen.getByText('Notebook'))
    await user.click(screen.getAllByRole('button', { name: /editar/i })[0])
    await user.clear(screen.getByLabelText(/nome/i))
    await user.type(screen.getByLabelText(/nome/i), 'Notebook Pro')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() =>
      expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
    )
  })

  it('botão Cancelar oculta o formulário', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /novo produto/i }))
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
  })
})
