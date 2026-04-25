import { useState, useCallback } from 'react'
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
        <Button
          onClick={() => setFormulario((atual) => (atual ? null : { modo: 'criar' }))}
          variant={formulario ? 'outline' : 'default'}
        >
          {formulario ? 'Cancelar' : 'Novo Produto'}
        </Button>
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
