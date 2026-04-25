import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductList } from './ProductList'

describe('ProductList', () => {
  it('exibe loading enquanto carrega', () => {
    render(<ProductList />)
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('exibe os produtos após carregar', async () => {
    render(<ProductList />)
    await waitFor(() => expect(screen.getByText('Notebook')).toBeInTheDocument())
    expect(screen.getByText('Mouse')).toBeInTheDocument()
  })

  it('exibe preço formatado em reais', async () => {
    render(<ProductList />)
    await waitFor(() => expect(screen.getByText(/R\$\s*4\.999/)).toBeInTheDocument())
  })

  it('exibe estoque de cada produto', async () => {
    render(<ProductList />)
    await waitFor(() => expect(screen.getByText(/10 em estoque/i)).toBeInTheDocument())
  })

  it('remove produto ao clicar em excluir', async () => {
    const user = userEvent.setup()
    render(<ProductList />)

    await waitFor(() => screen.getByText('Notebook'))
    const botoes = screen.getAllByRole('button', { name: /excluir/i })
    await user.click(botoes[0])

    await waitFor(() =>
      expect(screen.queryByText('Notebook')).not.toBeInTheDocument()
    )
  })
})
