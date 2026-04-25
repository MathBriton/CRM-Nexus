export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  createdAt: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stock: number
}

export type UpdateProductRequest = CreateProductRequest
