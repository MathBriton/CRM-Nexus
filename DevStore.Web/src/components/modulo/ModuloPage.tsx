import { useState, Suspense, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import { mapaConfiguracoes } from '@/data/modulos/configuracoes'
import { TabelaCrud } from './TabelaCrud'

const TabelaRelatorio = lazy(() => import('./TabelaRelatorio'))

type Aba = 'cadastro' | 'relatorio'

export function ModuloPage() {
  const { pathname } = useLocation()
  const config = mapaConfiguracoes[pathname]
  const [aba, setAba] = useState<Aba>('cadastro')

  if (!config) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2">
        <p className="text-sm">
          Módulo não encontrado para a rota{' '}
          <code className="bg-muted rounded px-1 text-xs">{pathname}</code>
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-8 py-5">
        <h1 className="text-xl font-semibold">{config.titulo}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{config.subtitulo}</p>
      </div>

      <div className="border-b px-8">
        <div className="flex gap-6" role="tablist">
          {(['cadastro', 'relatorio'] as Aba[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={aba === tab}
              onClick={() => setAba(tab)}
              className={`-mb-px border-b-2 py-3 text-sm font-medium transition-colors ${
                aba === tab
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
            >
              {tab === 'cadastro' ? 'Cadastro' : 'Relatório'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        {aba === 'cadastro' && <TabelaCrud config={config} />}

        {aba === 'relatorio' && (
          <Suspense
            fallback={
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm">Carregando relatório...</span>
              </div>
            }
          >
            <TabelaRelatorio
              titulo={config.titulo}
              colunas={config.colunas}
              dados={config.dadosMock}
            />
          </Suspense>
        )}
      </div>
    </div>
  )
}
