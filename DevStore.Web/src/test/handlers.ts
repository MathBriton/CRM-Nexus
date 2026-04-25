import { http, HttpResponse } from 'msw'
import type { Product } from '../types/product'
import type { User } from '../types/user'

export const usuarioAdmin = { id: 1, name: 'Admin', username: 'admin' }

export const usuarios: User[] = [
  { id: 1, username: 'admin', name: 'Administrador', email: 'admin@devstore.com', role: 'Admin', isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, username: 'gerente', name: 'Gerente', email: 'gerente@devstore.com', role: 'Manager', isActive: true, createdAt: '2026-01-02T00:00:00Z' },
]

export const produtos: Product[] = [
  { id: 1, name: 'Notebook', description: 'Notebook gamer', price: 4999, stock: 10, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Mouse', description: 'Mouse sem fio', price: 199, stock: 50, createdAt: '2026-01-02T00:00:00Z' },
]

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json() as { username: string; password: string }
    if (username === 'admin' && password === 'admin123') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        id: usuarioAdmin.id,
        username: usuarioAdmin.username,
        name: usuarioAdmin.name,
        role: 'Admin',
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      })
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }),

  http.get('/api/products', () => HttpResponse.json(produtos)),

  http.get('/api/products/:id', ({ params }) => {
    const produto = produtos.find((p) => p.id === Number(params.id))
    return produto ? HttpResponse.json(produto) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as Omit<Product, 'id' | 'createdAt'>
    const novo: Product = { id: 3, ...body, createdAt: new Date().toISOString() }
    return HttpResponse.json(novo, { status: 201 })
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const existe = produtos.some((p) => p.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const existe = produtos.some((p) => p.id === Number(params.id))
    return existe
      ? new HttpResponse(null, { status: 204 })
      : new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/users', () => HttpResponse.json(usuarios)),

  http.get('/api/users/:id', ({ params }) => {
    const usuario = usuarios.find((u) => u.id === Number(params.id))
    return usuario ? HttpResponse.json(usuario) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as Omit<User, 'id' | 'createdAt' | 'isActive'>
    const novo: User = { id: 3, ...body, isActive: true, createdAt: new Date().toISOString() }
    return HttpResponse.json(novo, { status: 201 })
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('/api/users/:id/role', async ({ params, request }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    return existe
      ? new HttpResponse(null, { status: 204 })
      : new HttpResponse(null, { status: 404 })
  }),
]
