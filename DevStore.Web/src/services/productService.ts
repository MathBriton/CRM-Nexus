import type { CreateProductRequest, Product, UpdateProductRequest } from '../types/product'

const BASE = '/api/products'

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = localStorage.getItem('auth_token')
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function checarResposta(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`)
  return res
}

async function listar(): Promise<Product[]> {
  const res = await checarResposta(await fetch(BASE, { headers: authHeaders() }))
  return res.json()
}

async function buscarPorId(id: number): Promise<Product> {
  const res = await checarResposta(await fetch(`${BASE}/${id}`, { headers: authHeaders() }))
  return res.json()
}

async function criar(dados: CreateProductRequest): Promise<Product> {
  const res = await checarResposta(
    await fetch(BASE, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(dados),
    })
  )
  return res.json()
}

async function atualizar(id: number, dados: UpdateProductRequest): Promise<void> {
  await checarResposta(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(dados),
    })
  )
}

async function remover(id: number): Promise<void> {
  await checarResposta(await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() }))
}

export const productService = { listar, buscarPorId, criar, atualizar, remover }
