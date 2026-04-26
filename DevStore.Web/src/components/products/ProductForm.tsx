import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Product } from '@/types/product'
import { productService } from '@/services/productService'

interface Props {
  produto?: Product
  onSucesso: () => void
}

export function ProductForm({ produto, onSucesso }: Props) {
  const [nome, setNome] = useState(produto?.name ?? '')
  const [descricao, setDescricao] = useState(produto?.description ?? '')
  const [preco, setPreco] = useState(produto?.price ?? 0)
  const [estoque, setEstoque] = useState(produto?.stock ?? 0)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const dados = { name: nome, description: descricao, price: preco, stock: estoque }
    try {
      if (produto) {
        await productService.atualizar(produto.id, dados)
      } else {
        await productService.criar(dados)
      }
      onSucesso()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{produto ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="preco">Preço</Label>
            <Input
              id="preco"
              type="number"
              min={0.01}
              step={0.01}
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="estoque">Estoque</Label>
            <Input
              id="estoque"
              type="number"
              min={0}
              value={estoque}
              onChange={(e) => setEstoque(Number(e.target.value))}
              required
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            {enviando ? (
              <Button type="submit" disabled>Salvando...</Button>
            ) : produto ? (
              <Button type="submit">Salvar alterações</Button>
            ) : (
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-0 gap-1.5"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Criar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
