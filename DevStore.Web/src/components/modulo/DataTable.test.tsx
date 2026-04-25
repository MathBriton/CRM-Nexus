import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { ColunaConfig } from '@/types/modulo'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const colunas: ColunaConfig[] = [
  { key: 'nome',   label: 'Nome',   tipo: 'texto' },
  { key: 'data',   label: 'Data',   tipo: 'data'  },
  { key: 'planta', label: 'Planta', tipo: 'texto' },
  { key: 'valor',  label: 'Valor',  tipo: 'moeda' },
  { key: 'status', label: 'Status', tipo: 'badge',
    corBadge: { Ativo: 'green', Inativo: 'red' } },
]

const dados = [
  { id: 1, nome: 'Alpha',   data: '2026-01-15', planta: 'Pirapetinga', valor: 100, status: 'Ativo'   },
  { id: 2, nome: 'Beta',    data: '2026-02-20', planta: 'Uberaba',     valor: 200, status: 'Inativo' },
  { id: 3, nome: 'Gamma',   data: '2026-03-10', planta: 'Saquarema',   valor: 300, status: 'Ativo'   },
  { id: 4, nome: 'Delta',   data: '2026-04-05', planta: 'Pirapetinga', valor: 400, status: 'Ativo'   },
  { id: 5, nome: 'Epsilon', data: '2026-01-28', planta: 'Uberaba',     valor: 500, status: 'Inativo' },
]

// Gera n registros para testar paginação
function gerarDados(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    nome: `Item ${i + 1}`,
    data: '2026-01-01',
    planta: 'Pirapetinga',
    valor: i * 100,
    status: 'Ativo',
  }))
}

// ── Renderização básica ───────────────────────────────────────────────────────

describe('DataTable — renderização', () => {
  it('exibe os cabeçalhos das colunas', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByRole('columnheader', { name: /nome/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /data/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /planta/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /valor/i })).toBeInTheDocument()
  })

  it('exibe todos os registros na primeira página (padrão 10)', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Epsilon')).toBeInTheDocument()
  })

  it('formata coluna moeda com R$', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument()
  })

  it('formata coluna data (contém ano 2026)', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    // A formatação exata depende da locale do runtime; verificamos o ano presente
    const celulasData = screen.getAllByText(/2026/)
    expect(celulasData.length).toBeGreaterThan(0)
  })

  it('renderiza badges coloridos para coluna badge', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    const badges = screen.getAllByText('Ativo')
    expect(badges.length).toBeGreaterThan(0)
    expect(badges[0].className).toMatch(/bg-green/)
  })

  it('exibe coluna de ações quando prop acoes é fornecida', () => {
    render(
      <DataTable
        colunas={colunas}
        dados={dados}
        acoes={() => <button>Editar</button>}
      />,
    )
    expect(screen.getByRole('columnheader', { name: /ações/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(5)
  })

  it('omite coluna de ações quando prop acoes é ausente', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.queryByRole('columnheader', { name: /ações/i })).not.toBeInTheDocument()
  })

  it('exibe mensagem quando não há registros', () => {
    render(<DataTable colunas={colunas} dados={[]} />)
    expect(screen.getByText(/nenhum registro disponível/i)).toBeInTheDocument()
  })
})

// ── Contador de registros ─────────────────────────────────────────────────────

describe('DataTable — contador de registros', () => {
  it('exibe contador correto com todos os dados', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 1–5 de 5 registro(s)')
  })

  it('exibe "Nenhum registro" quando dados estão vazios', () => {
    render(<DataTable colunas={colunas} dados={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum registro encontrado')
  })
})

// ── Busca ─────────────────────────────────────────────────────────────────────

describe('DataTable — busca global', () => {
  it('campo de busca está presente e acessível', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/filtrar/i)).toBeInTheDocument()
  })

  it('filtra registros ao digitar no campo de busca', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'Alpha')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('busca é case-insensitive', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'alpha')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('busca em todas as colunas', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'Saquarema')
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('exibe mensagem quando busca não retorna resultados', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'xyzabc123')
    expect(screen.getByText(/nenhum resultado para os filtros/i)).toBeInTheDocument()
  })

  it('atualiza contador ao filtrar', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'Pirapetinga')
    expect(screen.getByRole('status')).toHaveTextContent('de 2 registro(s)')
  })
})

// ── Filtro por planta ─────────────────────────────────────────────────────────

describe('DataTable — filtro por planta', () => {
  it('exibe seletor de planta quando dados têm campo planta', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByLabelText(/filtrar por planta/i)).toBeInTheDocument()
  })

  it('oculta seletor de planta quando dados não têm campo planta', () => {
    const dadosSemPlanta = dados.map(({ planta: _, ...rest }) => rest)
    render(<DataTable colunas={colunas} dados={dadosSemPlanta} />)
    expect(screen.queryByLabelText(/filtrar por planta/i)).not.toBeInTheDocument()
  })

  it('filtra por Pirapetinga', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.selectOptions(screen.getByLabelText(/filtrar por planta/i), 'Pirapetinga')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })

  it('filtra por Uberaba', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.selectOptions(screen.getByLabelText(/filtrar por planta/i), 'Uberaba')
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Epsilon')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('exibe todas as plantas na lista', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    const select = screen.getByLabelText(/filtrar por planta/i)
    expect(within(select).getByText('Pirapetinga')).toBeInTheDocument()
    expect(within(select).getByText('Uberaba')).toBeInTheDocument()
    expect(within(select).getByText('Saquarema')).toBeInTheDocument()
  })
})

// ── Filtro por intervalo de data ──────────────────────────────────────────────

describe('DataTable — filtro de data', () => {
  it('exibe inputs de data início e data fim quando colunas têm tipo data', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByLabelText(/data início/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data fim/i)).toBeInTheDocument()
  })

  it('oculta filtros de data quando não há colunas de data', () => {
    const colunasSemData = colunas.filter(c => c.tipo !== 'data')
    render(<DataTable colunas={colunasSemData} dados={dados} />)
    expect(screen.queryByLabelText(/data início/i)).not.toBeInTheDocument()
  })

  it('filtra por data início', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    fireEvent.change(screen.getByLabelText(/data início/i), { target: { value: '2026-03-01' } })
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filtra por data fim', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    fireEvent.change(screen.getByLabelText(/data fim/i), { target: { value: '2026-01-31' } })
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Epsilon')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filtra por intervalo de data completo', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    fireEvent.change(screen.getByLabelText(/data início/i), { target: { value: '2026-02-01' } })
    fireEvent.change(screen.getByLabelText(/data fim/i), { target: { value: '2026-02-28' } })
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })
})

// ── Limpar filtros ────────────────────────────────────────────────────────────

describe('DataTable — limpar filtros', () => {
  it('botão Limpar aparece quando há filtro ativo', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.queryByLabelText(/limpar/i)).not.toBeInTheDocument()
    await user.type(screen.getByRole('searchbox'), 'Alpha')
    expect(screen.getByLabelText(/limpar/i)).toBeInTheDocument()
  })

  it('botão Limpar restaura todos os registros', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={dados} />)
    await user.type(screen.getByRole('searchbox'), 'Alpha')
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText(/limpar/i))
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})

// ── Paginação ─────────────────────────────────────────────────────────────────

describe('DataTable — paginação', () => {
  it('não exibe paginação quando registros cabem em uma página', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.queryByLabelText(/paginação/i)).not.toBeInTheDocument()
  })

  it('exibe paginação quando registros excedem o tamanho da página', () => {
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    expect(screen.getByLabelText(/paginação/i)).toBeInTheDocument()
  })

  it('exibe apenas a primeira página inicialmente', () => {
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 11')).not.toBeInTheDocument()
  })

  it('navega para a próxima página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    await user.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    expect(screen.getByText('Item 11')).toBeInTheDocument()
  })

  it('navega para a última página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(25)} />)
    await user.click(screen.getByRole('button', { name: /última página/i }))
    expect(screen.getByText('Item 21')).toBeInTheDocument()
  })

  it('navega para a primeira página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(25)} />)
    await user.click(screen.getByRole('button', { name: /última página/i }))
    await user.click(screen.getByRole('button', { name: /primeira página/i }))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('botão "primeira página" desabilitado na página 1', () => {
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    expect(screen.getByRole('button', { name: /primeira página/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botão "última página" desabilitado na última página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    await user.click(screen.getByRole('button', { name: /última página/i }))
    expect(screen.getByRole('button', { name: /última página/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('página atual tem aria-current="page"', () => {
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    const paginaAtual = screen.getByRole('button', { name: 'Página 1' })
    expect(paginaAtual).toHaveAttribute('aria-current', 'page')
  })

  it('contador exibe intervalo correto na segunda página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(15)} />)
    await user.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 11–15 de 15 registro(s)')
  })

  it('volta para página 1 ao mudar tamanho da página', async () => {
    const user = userEvent.setup()
    render(<DataTable colunas={colunas} dados={gerarDados(25)} />)
    await user.click(screen.getByRole('button', { name: /próxima página/i }))
    await user.selectOptions(screen.getByLabelText(/registros por página/i), '25')
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 1–25 de 25 registro(s)')
  })
})

// ── Atalho Ctrl+K ─────────────────────────────────────────────────────────────

describe('DataTable — atalho Ctrl+K', () => {
  it('Ctrl+K foca o campo de busca', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(document.activeElement).toBe(input)
  })

  it('Meta+K foca o campo de busca (macOS)', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(document.activeElement).toBe(input)
  })
})

// ── Segurança / XSS ───────────────────────────────────────────────────────────

describe('DataTable — segurança', () => {
  it('renderiza input malicioso como texto sem executar HTML', () => {
    const dadosMaliciosos = [
      { id: 1, nome: '<script>alert(1)</script>', data: '2026-01-01', planta: 'Pirapetinga', valor: 0, status: 'Ativo' },
    ]
    render(<DataTable colunas={colunas} dados={dadosMaliciosos} />)
    // Texto renderizado como string literal, não como HTML
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument()
    // Nenhum script deve ter sido injetado no DOM
    expect(document.querySelectorAll('script')).toHaveLength(0)
  })

  it('campo de busca tem maxLength=200', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByRole('searchbox')).toHaveAttribute('maxLength', '200')
  })

  it('inputs de data têm type=date', () => {
    render(<DataTable colunas={colunas} dados={dados} />)
    expect(screen.getByLabelText(/data início/i)).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText(/data fim/i)).toHaveAttribute('type', 'date')
  })
})
