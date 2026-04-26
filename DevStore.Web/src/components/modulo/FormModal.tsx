import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { CampoForm } from '@/types/modulo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  titulo: string
  campos: CampoForm[]
  inicial?: Record<string, unknown>
  criarNovo?: boolean
  onSalvar: (dados: Record<string, string>) => void
  onCancelar: () => void
}

export function FormModal({ titulo, campos, inicial = {}, criarNovo = false, onSalvar, onCancelar }: Props) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(campos.map(c => [c.key, String(inicial[c.key] ?? '')])),
  )

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSalvar(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{titulo}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {campos.map(campo => (
            <div key={campo.key} className="space-y-1">
              <Label htmlFor={campo.key}>{campo.label}</Label>
              {campo.tipo === 'select' ? (
                <select
                  id={campo.key}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form[campo.key]}
                  onChange={e => set(campo.key, e.target.value)}
                  required={campo.required}
                >
                  <option value="">Selecione...</option>
                  {campo.opcoes?.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              ) : campo.tipo === 'textarea' ? (
                <textarea
                  id={campo.key}
                  className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form[campo.key]}
                  onChange={e => set(campo.key, e.target.value)}
                  placeholder={campo.placeholder}
                  required={campo.required}
                />
              ) : (
                <Input
                  id={campo.key}
                  type={campo.tipo}
                  value={form[campo.key]}
                  onChange={e => set(campo.key, e.target.value)}
                  placeholder={campo.placeholder}
                  required={campo.required}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-3">
            <Button type="button" variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
            {criarNovo ? (
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Criar
              </Button>
            ) : (
              <Button type="submit">Salvar alterações</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
