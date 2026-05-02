import { http, HttpResponse } from 'msw'
import type { Product } from '../types/product'
import type { User } from '../types/user'
import type { NexusUsuario, ItemPermissao } from '../types/permissao'

export const usuarioAdmin = { id: 1, name: 'Admin', username: 'admin' }

export const usuarios: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Administrador',
    email: 'admin@devstore.com',
    role: 'Admin',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'gerente',
    name: 'Gerente Geral',
    email: 'gerente@devstore.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'maria.garcia',
    name: 'Maria Garcia',
    email: 'maria.garcia@devstore.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 4,
    username: 'carlos.mendes',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 5,
    username: 'ana.paula',
    name: 'Ana Paula Souza',
    email: 'ana.paula@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 6,
    username: 'fernanda.lima',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@devstore.com',
    role: 'User',
    isActive: false,
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 7,
    username: 'rafael.costa',
    name: 'Rafael Costa',
    email: 'rafael.costa@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 8,
    username: 'beatriz.souza',
    name: 'Beatriz Souza',
    email: 'beatriz.souza@devstore.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 9,
    username: 'lucas.ferreira',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 10,
    username: 'patricia.lima',
    name: 'Patrícia Lima',
    email: 'patricia.lima@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-01-22T00:00:00Z',
  },
  {
    id: 11,
    username: 'marcos.vieira',
    name: 'Marcos Vieira',
    email: 'marcos.vieira@devstore.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 12,
    username: 'silvia.rocha',
    name: 'Silvia Rocha',
    email: 'silvia.rocha@devstore.com',
    role: 'User',
    isActive: false,
    createdAt: '2026-02-03T00:00:00Z',
  },
  {
    id: 13,
    username: 'gustavo.lima',
    name: 'Gustavo Lima',
    email: 'gustavo.lima@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 14,
    username: 'joao.silva',
    name: 'João Silva',
    email: 'joao.silva@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-02-08T00:00:00Z',
  },
  {
    id: 15,
    username: 'carla.nunes',
    name: 'Carla Nunes',
    email: 'carla.nunes@devstore.com',
    role: 'User',
    isActive: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
]

export const produtos: Product[] = [
  {
    id: 1,
    name: 'Notebook Dell G15',
    description: 'Notebook gamer com RTX 4060 e 16GB RAM',
    price: 4999,
    stock: 15,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    description: 'Mouse sem fio ergonômico para produtividade',
    price: 399,
    stock: 42,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Teclado Mecânico K95',
    description: 'Teclado mecânico RGB com switches Cherry MX Red',
    price: 699,
    stock: 20,
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 34"',
    description: 'Monitor curvo ultrawide QHD 144Hz',
    price: 2199,
    stock: 8,
    createdAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 5,
    name: 'Headset HyperX Cloud II',
    description: 'Headset gamer 7.1 surround com espuma de memória',
    price: 499,
    stock: 25,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 6,
    name: 'Webcam Logitech C920 Pro',
    description: 'Webcam Full HD 1080p com autofoco',
    price: 349,
    stock: 18,
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 7,
    name: 'SSD Samsung 1TB NVMe',
    description: 'SSD M.2 PCIe Gen4 com velocidade de 7000 MB/s',
    price: 599,
    stock: 30,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 8,
    name: 'Hub USB-C 7 em 1',
    description: 'Hub multiporta com HDMI, USB 3.0, leitor SD e PD 100W',
    price: 189,
    stock: 50,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 9,
    name: 'Cadeira Gamer DXRacer',
    description: 'Cadeira ergonômica com suporte lombar e apoio de braço 4D',
    price: 1899,
    stock: 7,
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 10,
    name: 'Switch TP-Link TL-SG1024D',
    description: 'Switch de rede não gerenciável 24 portas Gigabit',
    price: 479,
    stock: 12,
    createdAt: '2026-01-22T00:00:00Z',
  },
  {
    id: 11,
    name: 'Roteador Asus RT-AX88U',
    description: 'Roteador Wi-Fi 6 dual band AX6000',
    price: 1299,
    stock: 6,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 12,
    name: 'Impressora HP LaserJet Pro',
    description: 'Impressora laser monocromática com Wi-Fi e duplex automático',
    price: 1099,
    stock: 10,
    createdAt: '2026-02-03T00:00:00Z',
  },
  {
    id: 13,
    name: 'Nobreak APC 1500VA',
    description: 'Nobreak interativo com 8 tomadas e proteção completa',
    price: 849,
    stock: 9,
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 14,
    name: 'Cabo HDMI 2.1 — 3m',
    description: 'Cabo HDMI 2.1 certificado para 8K60Hz e 4K120Hz',
    price: 79,
    stock: 100,
    createdAt: '2026-02-08T00:00:00Z',
  },
  {
    id: 15,
    name: 'Suporte Duplo de Monitor',
    description: 'Suporte articulado para dois monitores até 32" VESA 75/100',
    price: 329,
    stock: 14,
    createdAt: '2026-02-10T00:00:00Z',
  },
]

let _nextProductId = produtos.length + 1
let _nextUserId = usuarios.length + 1

export const nexusUsuarios: NexusUsuario[] = [
  { id: 1, matricula: 'MAT001', filial: '01', nome: 'Ana Paula Ferreira', login: 'ana.paula' },
  { id: 2, matricula: 'MAT002', filial: '01', nome: 'Carlos Eduardo Mendes', login: 'carlos.mendes' },
  { id: 3, matricula: 'MAT003', filial: '02', nome: 'Fernanda Lima Santos', login: 'fernanda.lima' },
  { id: 4, matricula: 'MAT004', filial: '01', nome: 'João Paulo Silva', login: 'joao.silva' },
  { id: 5, matricula: 'MAT005', filial: '02', nome: 'Maria Clara Oliveira', login: 'maria.oliveira' },
]

const mockPermissoesServicos: ItemPermissao[] = [
  { codigo: '1', nome: 'Acessos Usuários', categoria: 'Administrador', habilitado: true },
  { codigo: '2', nome: 'Gerenciar Menus', categoria: 'Administrador', habilitado: false },
  { codigo: '3', nome: 'Aprovador FNC', categoria: 'Cadastros FNC', habilitado: true },
  { codigo: '4', nome: 'Defeitos de FNC', categoria: 'Cadastros FNC', habilitado: false },
  { codigo: '5', nome: 'Alterar Risco', categoria: 'Financeiro', habilitado: true },
  { codigo: '6', nome: 'Cadastro Canhoto', categoria: 'Financeiro', habilitado: true },
  { codigo: '7', nome: 'Solicitar Aumento de Crédito', categoria: 'Financeiro', habilitado: false },
]

const mockPermissoesConsultas: ItemPermissao[] = [
  { codigo: '1', nome: 'Carteira', categoria: 'Comercial', habilitado: true },
  { codigo: '2', nome: 'Faturamento detalhado', categoria: 'Comercial', habilitado: false },
  { codigo: '3', nome: 'IQF - Analítico', categoria: 'Compras', habilitado: true },
  { codigo: '4', nome: 'Buscar Nota Fiscal', categoria: 'Financeiro', habilitado: false },
  { codigo: '5', nome: 'Comissões', categoria: 'Financeiro', habilitado: true },
]

const permissoesUsuarios = new Map<string, { servicos: ItemPermissao[]; consultas: ItemPermissao[] }>()

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string }
    if (username === 'admin' && password === 'admin123') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        id: usuarioAdmin.id,
        username: usuarioAdmin.username,
        name: usuarioAdmin.name,
        role: 'Admin',
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      })
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }),

  http.get('/api/products', () => HttpResponse.json(produtos)),

  http.get('/api/products/:id', ({ params }) => {
    const produto = produtos.find((p) => p.id === Number(params.id))
    return produto ? HttpResponse.json(produto) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/products', async ({ request }) => {
    const body = (await request.json()) as Omit<Product, 'id' | 'createdAt'>
    const novo: Product = { id: _nextProductId++, ...body, createdAt: new Date().toISOString() }
    return HttpResponse.json(novo, { status: 201 })
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const existe = produtos.some((p) => p.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const existe = produtos.some((p) => p.id === Number(params.id))
    return existe
      ? new HttpResponse(null, { status: 204 })
      : new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/users', () => HttpResponse.json(usuarios)),

  http.get('/api/users/:id', ({ params }) => {
    const usuario = usuarios.find((u) => u.id === Number(params.id))
    return usuario ? HttpResponse.json(usuario) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id' | 'createdAt' | 'isActive'>
    const novo: User = {
      id: _nextUserId++,
      ...body,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(novo, { status: 201 })
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('/api/users/:id/role', async ({ params, request }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    if (!existe) return new HttpResponse(null, { status: 404 })
    await request.json()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const existe = usuarios.some((u) => u.id === Number(params.id))
    return existe
      ? new HttpResponse(null, { status: 204 })
      : new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/permissoes/usuarios', () => HttpResponse.json(nexusUsuarios)),

  http.get('/api/permissoes/usuario/:matricula/:filial', ({ params }) => {
    const chave = `${params.matricula}|${params.filial}`
    const salvo = permissoesUsuarios.get(chave)
    return HttpResponse.json({
      servicos: salvo?.servicos ?? mockPermissoesServicos,
      consultas: salvo?.consultas ?? mockPermissoesConsultas,
    })
  }),

  http.post('/api/permissoes/usuario/:matricula/:filial', async ({ params, request }) => {
    const body = (await request.json()) as {
      servicosHabilitados: string[]
      consultasHabilitadas: string[]
    }
    const chave = `${params.matricula}|${params.filial}`
    permissoesUsuarios.set(chave, {
      servicos: mockPermissoesServicos.map((s) => ({
        ...s,
        habilitado: body.servicosHabilitados.includes(s.codigo),
      })),
      consultas: mockPermissoesConsultas.map((c) => ({
        ...c,
        habilitado: body.consultasHabilitadas.includes(c.codigo),
      })),
    })
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/permissoes/usuario/:matricula/:filial/importar', () =>
    new HttpResponse(null, { status: 204 }),
  ),
]
