import type {
  NexusUsuario,
  ImportarPermissoesPayload,
  PermissoesUsuario,
  SalvarPermissoesPayload,
} from '@/types/permissao'

const BASE = '/api/permissoes'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function respostaOuErro<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(body || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listarUsuarios(): Promise<NexusUsuario[]> {
  const res = await fetch(`${BASE}/usuarios`, { headers: authHeaders() })
  return respostaOuErro<NexusUsuario[]>(res)
}

export async function carregarPermissoes(
  matricula: string,
  filial: string,
): Promise<PermissoesUsuario> {
  const res = await fetch(`${BASE}/usuario/${matricula}/${filial}`, {
    headers: authHeaders(),
  })
  return respostaOuErro<PermissoesUsuario>(res)
}

export async function salvarPermissoes(
  matricula: string,
  filial: string,
  payload: SalvarPermissoesPayload,
): Promise<void> {
  const res = await fetch(`${BASE}/usuario/${matricula}/${filial}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(body || `HTTP ${res.status}`)
  }
}

export async function importarPermissoes(
  matriculaDestino: string,
  filialDestino: string,
  payload: ImportarPermissoesPayload,
): Promise<void> {
  const res = await fetch(`${BASE}/usuario/${matriculaDestino}/${filialDestino}/importar`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(body || `HTTP ${res.status}`)
  }
}
