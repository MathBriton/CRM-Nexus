import { http, HttpResponse } from 'msw'
import type { Product } from '../types/product'

export const produtos: Product[] = [
  { id: 1, name: 'Notebook', description: 'Notebook gamer', price: 4999, stock: 10, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Mouse', description: 'Mouse sem fio', price: 199, stock: 50, createdAt: '2026-01-02T00:00:00Z' },
]

export const handlers = [
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
]
