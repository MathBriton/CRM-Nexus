import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ProductList } from '@/components/products/ProductList'
import { ProductForm } from '@/components/products/ProductForm'
import type { Product } from '@/types/product'

type EstadoFormulario =
  | { modo: 'criar' }
  | { modo: 'editar'; produto: Product }
  | null

function App() {
  const [formulario, setFormulario] = useState<EstadoFormulario>(null)
  const [chaveReload, setChaveReload] = useState(0)

  const handleSucesso = useCallback(() => {
    setFormulario(null)
    setChaveReload((k) => k + 1)
  }, [])

  const handleEditar = useCallback((produto: Product) => {
    setFormulario({ modo: 'editar', produto })
  }, [])

  const handleNovoClick = useCallback(() => {
    setFormulario((atual) => (atual ? null : { modo: 'criar' }))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">DevStore</h1>
          <Button
            onClick={handleNovoClick}
            variant={formulario ? 'outline' : 'default'}
          >
            {formulario ? 'Cancelar' : 'Novo Produto'}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {formulario && (
          <ProductForm
            produto={formulario.modo === 'editar' ? formulario.produto : undefined}
            onSucesso={handleSucesso}
          />
        )}
        <ProductList key={chaveReload} onEditar={handleEditar} />
      </main>
    </div>
  )
}

export default App
