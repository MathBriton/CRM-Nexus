import { FileDown, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from './DataTable'
import { exportarPDF, exportarExcel } from './exportar'
import type { ColunaConfig } from '@/types/modulo'

interface Props {
  titulo: string
  colunas: ColunaConfig[]
  dados: Record<string, unknown>[]
}

export default function TabelaRelatorio({ titulo, colunas, dados }: Props) {
  return (
    <div className="space-y-4">
      {/* Cabeçalho com botões de exportação */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Relatório — {titulo}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="gap-1.5 border-0 bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800"
            onClick={() => exportarPDF(titulo, colunas, dados)}
            aria-label={`Exportar ${titulo} em PDF`}
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            PDF
          </Button>
          <Button
            size="sm"
            className="gap-1.5 border-0 bg-green-600 text-white shadow-sm hover:bg-green-700 active:bg-green-800"
            onClick={() => exportarExcel(titulo, colunas, dados)}
            aria-label={`Exportar ${titulo} em Excel`}
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            Excel
          </Button>
        </div>
      </div>

      <DataTable colunas={colunas} dados={dados} />
    </div>
  )
}
