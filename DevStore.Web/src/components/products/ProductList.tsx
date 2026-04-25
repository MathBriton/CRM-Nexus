import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Product } from '@/types/product'
import { productService } from '@/services/productService'

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

  if (carregando) return <p className="text-muted-foreground py-8 text-center">Carregando...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {produto.description}
                  </TableCell>
                  <TableCell>
                    {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={produto.stock > 0 ? 'default' : 'destructive'}>
                      {produto.stock} em estoque
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleExcluir(produto.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
