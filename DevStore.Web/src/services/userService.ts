import type { CreateUserRequest, UpdateUserRequest, User, UserRole } from '../types/user'

const BASE = '/api/users'

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

async function listar(): Promise<User[]> {
  const res = await checarResposta(await fetch(BASE, { headers: authHeaders() }))
  return res.json()
}

async function buscarPorId(id: number): Promise<User> {
  const res = await checarResposta(await fetch(`${BASE}/${id}`, { headers: authHeaders() }))
  return res.json()
}

async function criar(dados: CreateUserRequest): Promise<User> {
  const res = await checarResposta(
    await fetch(BASE, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(dados),
    })
  )
  return res.json()
}

async function atualizar(id: number, dados: UpdateUserRequest): Promise<void> {
  await checarResposta(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(dados),
    })
  )
}

async function alterarRole(id: number, role: UserRole): Promise<void> {
  await checarResposta(
    await fetch(`${BASE}/${id}/role`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role }),
    })
  )
}

async function desativar(id: number): Promise<void> {
  await checarResposta(
    await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
  )
}

export const userService = { listar, buscarPorId, criar, atualizar, alterarRole, desativar }
