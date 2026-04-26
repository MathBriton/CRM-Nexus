import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductList } from '@/components/products/ProductList'
import { ProductForm } from '@/components/products/ProductForm'
import type { Product } from '@/types/product'

type EstadoFormulario =
  | { modo: 'criar' }
  | { modo: 'editar'; produto: Product }
  | null

export function ProductsPage() {
  const [formulario, setFormulario] = useState<EstadoFormulario>(null)
  const [chaveReload, setChaveReload] = useState(0)

  const handleSucesso = useCallback(() => {
    setFormulario(null)
    setChaveReload((k) => k + 1)
  }, [])

  const handleEditar = useCallback((produto: Product) => {
    setFormulario({ modo: 'editar', produto })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Controle de Produtos</h2>
        {formulario ? (
          <Button variant="outline" onClick={() => setFormulario(null)}>
            Cancelar
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setFormulario({ modo: 'criar' })}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Criar
          </Button>
        )}
      </div>

      {formulario && (
        <ProductForm
          produto={formulario.modo === 'editar' ? formulario.produto : undefined}
          onSucesso={handleSucesso}
        />
      )}

      <ProductList key={chaveReload} onEditar={handleEditar} />
    </div>
  )
}
