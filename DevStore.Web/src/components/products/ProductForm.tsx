import { useState } from 'react'
import type { Product } from '../../types/product'
import { productService } from '../../services/productService'

interface Props {
  produto?: Product
  onSucesso: () => void
}

export function ProductForm({ produto, onSucesso }: Props) {
  const [nome, setNome] = useState(produto?.name ?? '')
  const [descricao, setDescricao] = useState(produto?.description ?? '')
  const [preco, setPreco] = useState(produto?.price ?? 0)
  const [estoque, setEstoque] = useState(produto?.stock ?? 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dados = { name: nome, description: descricao, price: preco, stock: estoque }

    if (produto) {
      await productService.atualizar(produto.id, dados)
    } else {
      await productService.criar(dados)
    }

    onSucesso()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nome">Nome</label>
        <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="descricao">Descrição</label>
        <input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>
      <div>
        <label htmlFor="preco">Preço</label>
        <input id="preco" type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} required />
      </div>
      <div>
        <label htmlFor="estoque">Estoque</label>
        <input id="estoque" type="number" value={estoque} onChange={(e) => setEstoque(Number(e.target.value))} required />
      </div>
      <button type="submit">Salvar</button>
    </form>
  )
}
