import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ProductsPage } from './ProductsPage'

function renderPage() {
  return renderWithProviders(<ProductsPage />)
}

describe('ProductsPage', () => {
  it('exibe o título do módulo', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /controle de produtos/i })).toBeInTheDocument()
  })

  it('exibe a lista de produtos', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Notebook')).toBeInTheDocument())
  })

  it('exibe formulário ao clicar em Novo Produto', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /novo produto/i }))

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
  })

  it('abre formulário de edição ao clicar em Editar', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getByText('Notebook'))
    await user.click(screen.getAllByRole('button', { name: /editar/i })[0])

    expect(screen.getByLabelText(/nome/i)).toHaveValue('Notebook')
  })
})
