import { useState, useCallback } from 'react'
import { ProductList } from './components/products/ProductList'
import { ProductForm } from './components/products/ProductForm'

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [chaveReload, setChaveReload] = useState(0)

  const handleSucesso = useCallback(() => {
    setMostrarFormulario(false)
    setChaveReload((k) => k + 1)
  }, [])

  return (
    <main>
      <header>
        <h1>DevStore</h1>
        <button onClick={() => setMostrarFormulario((v) => !v)}>
          {mostrarFormulario ? 'Cancelar' : 'Novo Produto'}
        </button>
      </header>

      {mostrarFormulario && <ProductForm onSucesso={handleSucesso} />}

      <ProductList key={chaveReload} />
    </main>
  )
}

export default App
