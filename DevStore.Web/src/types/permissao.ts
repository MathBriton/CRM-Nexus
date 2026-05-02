export interface NexusUsuario {
  id: number
  matricula: string
  filial: string
  nome: string
  login: string
}

export interface ItemPermissao {
  codigo: string
  nome: string
  categoria: string
  habilitado: boolean
}

export interface PermissoesUsuario {
  servicos: ItemPermissao[]
  consultas: ItemPermissao[]
}

export interface ImportarPermissoesPayload {
  matriculaOrigem: string
  filialOrigem: string
}

export interface SalvarPermissoesPayload {
  servicosHabilitados: string[]
  consultasHabilitadas: string[]
}
