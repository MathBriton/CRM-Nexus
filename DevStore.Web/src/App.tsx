import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ProductList } from '@/components/products/ProductList'
import { ProductForm } from '@/components/products/ProductForm'

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [chaveReload, setChaveReload] = useState(0)

  const handleSucesso = useCallback(() => {
    setMostrarFormulario(false)
    setChaveReload((k) => k + 1)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">DevStore</h1>
          <Button onClick={() => setMostrarFormulario((v) => !v)} variant={mostrarFormulario ? 'outline' : 'default'}>
            {mostrarFormulario ? 'Cancelar' : 'Novo Produto'}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {mostrarFormulario && <ProductForm onSucesso={handleSucesso} />}
        <ProductList key={chaveReload} />
      </main>
    </div>
  )
}

export default App
