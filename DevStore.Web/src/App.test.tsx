import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

function autenticar() {
  localStorage.setItem('auth_token', 'fake-jwt-token')
  localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Admin', username: 'admin' }))
}

describe('App — roteamento', () => {
  it('exibe login ao acessar rota desconhecida sem autenticação', () => {
    renderApp('/qualquer-coisa')
    expect(screen.getByRole('heading', { name: /devstore/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
  })

  it('redireciona para /login sem autenticação ao acessar rota protegida', () => {
    renderApp('/products')
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
  })

  it('exibe dashboard ao acessar /products autenticado', async () => {
    autenticar()
    renderApp('/products')
    await waitFor(() => expect(screen.getByText('Notebook')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /produtos/i })).toBeInTheDocument()
  })

  it('navega para /financial via sidebar', async () => {
    autenticar()
    const user = userEvent.setup()
    renderApp('/products')

    await waitFor(() => screen.getByRole('link', { name: /financeiro/i }))
    await user.click(screen.getByRole('link', { name: /financeiro/i }))

    expect(screen.getByRole('heading', { name: /financeiro/i })).toBeInTheDocument()
  })

  it('redireciona para /login após logout', async () => {
    autenticar()
    const user = userEvent.setup()
    renderApp('/products')

    await waitFor(() => screen.getByRole('button', { name: /sair/i }))
    await user.click(screen.getByRole('button', { name: /sair/i }))

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
  })

  it('redireciona / para /products quando autenticado', async () => {
    autenticar()
    renderApp('/')
    await waitFor(() => expect(screen.getByText('Notebook')).toBeInTheDocument())
  })
})
