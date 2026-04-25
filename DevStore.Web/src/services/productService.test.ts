import { describe, it, expect, beforeEach } from 'vitest'
import { productService } from './productService'
import { produtos } from '../test/handlers'
import { server } from '../test/server'
import { http, HttpResponse } from 'msw'

describe('productService', () => {
  it('listar: envia header Authorization quando token presente', async () => {
    localStorage.setItem('auth_token', 'test-token-123')
    let authHeader: string | null = null

    server.use(
      http.get('/api/products', ({ request }) => {
        authHeader = request.headers.get('Authorization')
        return HttpResponse.json([])
      })
    )

    await productService.listar()
    expect(authHeader).toBe('Bearer test-token-123')
  })

  it('listar: retorna todos os produtos', async () => {
    const resultado = await productService.listar()
    expect(resultado).toHaveLength(2)
    expect(resultado[0].name).toBe('Notebook')
  })

  it('buscarPorId: retorna produto existente', async () => {
    const resultado = await productService.buscarPorId(1)
    expect(resultado.name).toBe('Notebook')
  })

  it('buscarPorId: lança erro para id inexistente', async () => {
    await expect(productService.buscarPorId(999)).rejects.toThrow()
  })

  it('criar: retorna produto criado com status 201', async () => {
    const resultado = await productService.criar({
      name: 'Teclado',
      description: 'Teclado mecânico',
      price: 350,
      stock: 20,
    })
    expect(resultado.id).toBeDefined()
    expect(resultado.name).toBe('Teclado')
  })

  it('atualizar: resolve sem erro para id existente', async () => {
    await expect(
      productService.atualizar(produtos[0].id, {
        name: 'Notebook Pro',
        description: 'Atualizado',
        price: 5999,
        stock: 5,
      })
    ).resolves.toBeUndefined()
  })

  it('atualizar: lança erro para id inexistente', async () => {
    await expect(
      productService.atualizar(999, { name: 'X', description: 'X', price: 1, stock: 1 })
    ).rejects.toThrow()
  })

  it('remover: resolve sem erro para id existente', async () => {
    await expect(productService.remover(produtos[0].id)).resolves.toBeUndefined()
  })

  it('remover: lança erro para id inexistente', async () => {
    await expect(productService.remover(999)).rejects.toThrow()
  })
})
