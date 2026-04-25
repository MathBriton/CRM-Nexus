export interface ColunaConfig {
  key: string
  label: string
  tipo?: 'texto' | 'numero' | 'moeda' | 'data' | 'badge' | 'email'
  corBadge?: Record<string, 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'gray'>
  largeuraRelatorio?: number
}

export interface CampoForm {
  key: string
  label: string
  tipo: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea'
  opcoes?: string[]
  required?: boolean
  placeholder?: string
}

export interface ModuloConfig {
  titulo: string
  subtitulo: string
  entidade: string
  colunas: ColunaConfig[]
  campos: CampoForm[]
  dadosMock: Record<string, unknown>[]
}
