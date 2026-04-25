import { Package, PackageCheck, DollarSign, FlaskConical, FileText, Users, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MenuCategoria {
  nome: string
  acessos: number
}

export interface Categoria {
  nome: string
  icone: LucideIcon
  cor: string
  path: string
  menus: MenuCategoria[]
}

export const categoriasMock: Categoria[] = [
  {
    nome: 'Produtos',
    icone: Package,
    cor: 'blue',
    path: '/products',
    menus: [
      { nome: 'Cadastro de Produtos', acessos: 342 },
      { nome: 'Listagem de Produtos', acessos: 289 },
      { nome: 'Relatório de Estoque', acessos: 156 },
      { nome: 'Importação em Lote', acessos: 87 },
      { nome: 'Histórico de Preços', acessos: 64 },
    ],
  },
  {
    nome: 'Recebimento',
    icone: PackageCheck,
    cor: 'green',
    path: '/receiving',
    menus: [
      { nome: 'Novo Recebimento', acessos: 198 },
      { nome: 'Consulta de Notas', acessos: 175 },
      { nome: 'Relatório de Entradas', acessos: 92 },
      { nome: 'Conferência de Itens', acessos: 61 },
    ],
  },
  {
    nome: 'Financeiro',
    icone: DollarSign,
    cor: 'yellow',
    path: '/financial',
    menus: [
      { nome: 'Fluxo de Caixa', acessos: 415 },
      { nome: 'Lançamentos', acessos: 308 },
      { nome: 'Contas a Pagar', acessos: 241 },
      { nome: 'Contas a Receber', acessos: 220 },
      { nome: 'DRE', acessos: 103 },
      { nome: 'Relatório Mensal', acessos: 88 },
    ],
  },
  {
    nome: 'Insumos',
    icone: FlaskConical,
    cor: 'purple',
    path: '/inputs',
    menus: [
      { nome: 'Cadastro de Insumos', acessos: 134 },
      { nome: 'Movimentação', acessos: 118 },
      { nome: 'Estoque Atual', acessos: 97 },
      { nome: 'Solicitação de Compra', acessos: 54 },
    ],
  },
  {
    nome: 'Fichas Técnicas',
    icone: FileText,
    cor: 'orange',
    path: '/technical-sheets',
    menus: [
      { nome: 'Nova Ficha', acessos: 89 },
      { nome: 'Consulta de Fichas', acessos: 76 },
      { nome: 'Impressão', acessos: 43 },
    ],
  },
  {
    nome: 'Usuários',
    icone: Users,
    cor: 'cyan',
    path: '/users',
    menus: [
      { nome: 'Cadastro de Usuário', acessos: 72 },
      { nome: 'Listagem de Usuários', acessos: 58 },
      { nome: 'Redefinir Senha', acessos: 31 },
    ],
  },
  {
    nome: 'Permissões',
    icone: Shield,
    cor: 'red',
    path: '/permissions',
    menus: [
      { nome: 'Níveis de Acesso', acessos: 45 },
      { nome: 'Atribuição de Permissões', acessos: 38 },
    ],
  },
]

export type PeriodoFinanceiro =
  | 'semana'
  | 'mes'
  | 'trimestre'
  | 'semestre'
  | 'terceiro-trimestre'
  | 'ano'

export interface DadoPeriodo {
  label: string
  receita: number
  despesa: number
}

export const dadosFinanceiros: Record<PeriodoFinanceiro, DadoPeriodo[]> = {
  semana: [
    { label: 'Seg', receita: 3200, despesa: 1800 },
    { label: 'Ter', receita: 2800, despesa: 2100 },
    { label: 'Qua', receita: 4100, despesa: 2400 },
    { label: 'Qui', receita: 3700, despesa: 1950 },
    { label: 'Sex', receita: 5200, despesa: 3100 },
    { label: 'Sáb', receita: 2100, despesa: 900 },
    { label: 'Dom', receita: 1400, despesa: 600 },
  ],
  mes: [
    { label: 'Sem 1', receita: 18400, despesa: 11200 },
    { label: 'Sem 2', receita: 21300, despesa: 13800 },
    { label: 'Sem 3', receita: 19700, despesa: 12500 },
    { label: 'Sem 4', receita: 23100, despesa: 14900 },
  ],
  trimestre: [
    { label: 'Jan', receita: 72000, despesa: 44000 },
    { label: 'Fev', receita: 68000, despesa: 41500 },
    { label: 'Mar', receita: 85000, despesa: 52000 },
  ],
  semestre: [
    { label: 'Jan', receita: 72000, despesa: 44000 },
    { label: 'Fev', receita: 68000, despesa: 41500 },
    { label: 'Mar', receita: 85000, despesa: 52000 },
    { label: 'Abr', receita: 91000, despesa: 56000 },
    { label: 'Mai', receita: 88000, despesa: 54000 },
    { label: 'Jun', receita: 95000, despesa: 58000 },
  ],
  'terceiro-trimestre': [
    { label: 'Jul', receita: 102000, despesa: 63000 },
    { label: 'Ago', receita: 98000, despesa: 60000 },
    { label: 'Set', receita: 110000, despesa: 67000 },
  ],
  ano: [
    { label: 'Jan', receita: 72000, despesa: 44000 },
    { label: 'Fev', receita: 68000, despesa: 41500 },
    { label: 'Mar', receita: 85000, despesa: 52000 },
    { label: 'Abr', receita: 91000, despesa: 56000 },
    { label: 'Mai', receita: 88000, despesa: 54000 },
    { label: 'Jun', receita: 95000, despesa: 58000 },
    { label: 'Jul', receita: 102000, despesa: 63000 },
    { label: 'Ago', receita: 98000, despesa: 60000 },
    { label: 'Set', receita: 110000, despesa: 67000 },
    { label: 'Out', receita: 119000, despesa: 72000 },
    { label: 'Nov', receita: 128000, despesa: 78000 },
    { label: 'Dez', receita: 145000, despesa: 88000 },
  ],
}

export const periodos: { valor: PeriodoFinanceiro; label: string }[] = [
  { valor: 'semana', label: 'Semana' },
  { valor: 'mes', label: 'Mês' },
  { valor: 'trimestre', label: 'Trimestre' },
  { valor: 'semestre', label: 'Semestre' },
  { valor: 'terceiro-trimestre', label: '3º Trimestre' },
  { valor: 'ano', label: 'Ano' },
]
