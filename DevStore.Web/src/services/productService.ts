import type { CreateProductRequest, Product, UpdateProductRequest } from '../types/product'

const BASE = '/api/products'

async function checarResposta(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`)
  return res
}

async function listar(): Promise<Product[]> {
  const res = await checarResposta(await fetch(BASE))
  return res.json()
}

async function buscarPorId(id: number): Promise<Product> {
  const res = await checarResposta(await fetch(`${BASE}/${id}`))
  return res.json()
}

async function criar(dados: CreateProductRequest): Promise<Product> {
  const res = await checarResposta(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
  )
  return res.json()
}

async function atualizar(id: number, dados: UpdateProductRequest): Promise<void> {
  await checarResposta(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
  )
}

async function remover(id: number): Promise<void> {
  await checarResposta(await fetch(`${BASE}/${id}`, { method: 'DELETE' }))
}

export const productService = { listar, buscarPorId, criar, atualizar, remover }
