import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { ColunaConfig } from '@/types/modulo'

export function exportarPDF(
  titulo: string,
  colunas: ColunaConfig[],
  dados: Record<string, unknown>[],
) {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(titulo, 14, 16)
  autoTable(doc, {
    startY: 24,
    head: [colunas.map(c => c.label)],
    body: dados.map(row => colunas.map(c => String(row[c.key] ?? ''))),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 30, 30] },
  })
  doc.save(`${titulo.replace(/\s+/g, '_')}.pdf`)
}

export function exportarExcel(
  titulo: string,
  colunas: ColunaConfig[],
  dados: Record<string, unknown>[],
) {
  const ws = XLSX.utils.json_to_sheet(
    dados.map(row =>
      Object.fromEntries(colunas.map(c => [c.label, row[c.key] ?? ''])),
    ),
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, titulo.slice(0, 31))
  XLSX.writeFile(wb, `${titulo.replace(/\s+/g, '_')}.xlsx`)
}
