import { useEffect, useState } from 'react'
import type { Product } from '../../types/product'
import { productService } from '../../services/productService'

export function ProductList() {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    productService.listar().then((data) => {
      setProdutos(data)
      setCarregando(false)
    })
  }, [])

  async function handleExcluir(id: number) {
    await productService.remover(id)
    setProdutos((prev) => prev.filter((p) => p.id !== id))
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <ul>
      {produtos.map((produto) => (
        <li key={produto.id}>
          <strong>{produto.name}</strong>
          <span> — {produto.description}</span>
          <span> — {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span> — {produto.stock} em estoque</span>
          <button onClick={() => handleExcluir(produto.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  )
}
