import type { ModuloConfig } from '@/types/modulo'

// ── Produtos ──────────────────────────────────────────────────────────────────

export const controlEstoque: ModuloConfig = {
  titulo: 'Controle de Estoque',
  subtitulo: 'Movimentações de entrada e saída de produtos',
  entidade: 'movimentação',
  colunas: [
    { key: 'data',        label: 'Data',       tipo: 'data' },
    { key: 'produto',     label: 'Produto',    tipo: 'texto' },
    { key: 'tipo',        label: 'Tipo',       tipo: 'badge', corBadge: { Entrada: 'green', Saída: 'red', Ajuste: 'yellow' } },
    { key: 'quantidade',  label: 'Qtd',        tipo: 'numero' },
    { key: 'saldoApos',   label: 'Saldo Após', tipo: 'numero' },
    { key: 'responsavel', label: 'Responsável', tipo: 'texto' },
  ],
  campos: [
    { key: 'data',        label: 'Data',        tipo: 'date',   required: true },
    { key: 'produto',     label: 'Produto',     tipo: 'text',   required: true, placeholder: 'Nome do produto' },
    { key: 'tipo',        label: 'Tipo',        tipo: 'select', opcoes: ['Entrada', 'Saída', 'Ajuste'], required: true },
    { key: 'quantidade',  label: 'Quantidade',  tipo: 'number', required: true, placeholder: '0' },
    { key: 'responsavel', label: 'Responsável', tipo: 'text',   required: true, placeholder: 'Nome do responsável' },
  ],
  dadosMock: [
    { id: 1, data: '2026-04-01', produto: 'Notebook Dell G15',   tipo: 'Entrada', quantidade: 20, saldoApos: 35, responsavel: 'Carlos Mendes' },
    { id: 2, data: '2026-04-03', produto: 'Mouse Logitech MX3',  tipo: 'Saída',   quantidade: 5,  saldoApos: 18, responsavel: 'Ana Paula'     },
    { id: 3, data: '2026-04-05', produto: 'Teclado Mecânico K95',tipo: 'Entrada', quantidade: 12, saldoApos: 12, responsavel: 'Carlos Mendes' },
    { id: 4, data: '2026-04-08', produto: 'Monitor LG 27"',      tipo: 'Saída',   quantidade: 3,  saldoApos: 7,  responsavel: 'Fernanda Lima' },
    { id: 5, data: '2026-04-10', produto: 'Headset HyperX',      tipo: 'Ajuste',  quantidade: 2,  saldoApos: 9,  responsavel: 'Ana Paula'     },
    { id: 6, data: '2026-04-12', produto: 'Webcam Logitech C920',tipo: 'Entrada', quantidade: 8,  saldoApos: 8,  responsavel: 'Carlos Mendes' },
    { id: 7, data: '2026-04-15', produto: 'Notebook Dell G15',   tipo: 'Saída',   quantidade: 4,  saldoApos: 31, responsavel: 'Fernanda Lima' },
  ],
}

export const tabelaPrecos: ModuloConfig = {
  titulo: 'Tabela de Preços',
  subtitulo: 'Controle de precificação e margens por produto',
  entidade: 'item de preço',
  colunas: [
    { key: 'produto',      label: 'Produto',       tipo: 'texto' },
    { key: 'categoria',    label: 'Categoria',     tipo: 'texto' },
    { key: 'custoBruto',   label: 'Custo',         tipo: 'moeda' },
    { key: 'margem',       label: 'Margem %',      tipo: 'numero' },
    { key: 'precoVenda',   label: 'Preço Venda',   tipo: 'moeda' },
    { key: 'vigencia',     label: 'Vigência',      tipo: 'data'  },
    { key: 'status',       label: 'Status',        tipo: 'badge', corBadge: { Vigente: 'green', Expirado: 'red', Rascunho: 'yellow' } },
  ],
  campos: [
    { key: 'produto',    label: 'Produto',     tipo: 'text',   required: true },
    { key: 'categoria',  label: 'Categoria',   tipo: 'select', opcoes: ['Informática', 'Periféricos', 'Redes', 'Armazenamento'] },
    { key: 'custoBruto', label: 'Custo (R$)',  tipo: 'number', required: true, placeholder: '0,00' },
    { key: 'margem',     label: 'Margem (%)',  tipo: 'number', required: true, placeholder: '30' },
    { key: 'vigencia',   label: 'Vigência',    tipo: 'date',   required: true },
    { key: 'status',     label: 'Status',      tipo: 'select', opcoes: ['Vigente', 'Expirado', 'Rascunho'] },
  ],
  dadosMock: [
    { id: 1, produto: 'Notebook Dell G15',    categoria: 'Informática', custoBruto: 2450.00, margem: 34, precoVenda: 3299.90, vigencia: '2026-06-30', status: 'Vigente'  },
    { id: 2, produto: 'Mouse Logitech MX3',   categoria: 'Periféricos', custoBruto:  289.00, margem: 38, precoVenda:  399.90, vigencia: '2026-06-30', status: 'Vigente'  },
    { id: 3, produto: 'Teclado Mecânico K95', categoria: 'Periféricos', custoBruto:  520.00, margem: 35, precoVenda:  699.90, vigencia: '2026-03-31', status: 'Expirado' },
    { id: 4, produto: 'Monitor LG 27"',       categoria: 'Periféricos', custoBruto:  890.00, margem: 32, precoVenda: 1179.00, vigencia: '2026-06-30', status: 'Vigente'  },
    { id: 5, produto: 'Switch TP-Link 24p',   categoria: 'Redes',       custoBruto:  340.00, margem: 40, precoVenda:  479.90, vigencia: '2026-12-31', status: 'Rascunho' },
  ],
}

// ── Recebimento ───────────────────────────────────────────────────────────────

export const ordensCompra: ModuloConfig = {
  titulo: 'Ordens de Compra',
  subtitulo: 'Gestão de ordens de compra enviadas a fornecedores',
  entidade: 'ordem de compra',
  colunas: [
    { key: 'numero',     label: 'Número',      tipo: 'texto' },
    { key: 'fornecedor', label: 'Fornecedor',  tipo: 'texto' },
    { key: 'emissao',    label: 'Emissão',     tipo: 'data'  },
    { key: 'entrega',    label: 'Entrega',     tipo: 'data'  },
    { key: 'valor',      label: 'Valor Total', tipo: 'moeda' },
    { key: 'status',     label: 'Status',      tipo: 'badge', corBadge: { Pendente: 'yellow', Aprovada: 'blue', Recebida: 'green', Cancelada: 'red' } },
  ],
  campos: [
    { key: 'fornecedor', label: 'Fornecedor',    tipo: 'text',   required: true },
    { key: 'emissao',    label: 'Data Emissão',  tipo: 'date',   required: true },
    { key: 'entrega',    label: 'Previsão Entrega', tipo: 'date' },
    { key: 'valor',      label: 'Valor Total (R$)', tipo: 'number', required: true },
    { key: 'status',     label: 'Status',        tipo: 'select', opcoes: ['Pendente', 'Aprovada', 'Recebida', 'Cancelada'] },
  ],
  dadosMock: [
    { id: 1, numero: 'OC-2026-001', fornecedor: 'Dell Brasil Ltda',       emissao: '2026-04-01', entrega: '2026-04-15', valor: 49000.00, status: 'Recebida'  },
    { id: 2, numero: 'OC-2026-002', fornecedor: 'Logitech do Brasil',     emissao: '2026-04-05', entrega: '2026-04-20', valor: 8750.00,  status: 'Aprovada'  },
    { id: 3, numero: 'OC-2026-003', fornecedor: 'LG Electronics Brasil',  emissao: '2026-04-10', entrega: '2026-04-25', valor: 23600.00, status: 'Pendente'  },
    { id: 4, numero: 'OC-2026-004', fornecedor: 'TP-Link Brasil',         emissao: '2026-04-12', entrega: '2026-04-28', valor: 5100.00,  status: 'Cancelada' },
    { id: 5, numero: 'OC-2026-005', fornecedor: 'HyperX Gaming Brasil',   emissao: '2026-04-18', entrega: '2026-05-05', valor: 12400.00, status: 'Pendente'  },
  ],
}

export const notasFiscais: ModuloConfig = {
  titulo: 'Notas Fiscais de Entrada',
  subtitulo: 'Registro e conferência de notas fiscais recebidas',
  entidade: 'nota fiscal',
  colunas: [
    { key: 'numero',     label: 'Nº NF',       tipo: 'texto' },
    { key: 'fornecedor', label: 'Fornecedor',  tipo: 'texto' },
    { key: 'emissao',    label: 'Emissão',     tipo: 'data'  },
    { key: 'entrada',    label: 'Entrada',     tipo: 'data'  },
    { key: 'valor',      label: 'Valor',       tipo: 'moeda' },
    { key: 'status',     label: 'Status',      tipo: 'badge', corBadge: { Conferida: 'green', Pendente: 'yellow', Divergência: 'red' } },
  ],
  campos: [
    { key: 'numero',     label: 'Número NF',    tipo: 'text',   required: true, placeholder: '000000' },
    { key: 'fornecedor', label: 'Fornecedor',   tipo: 'text',   required: true },
    { key: 'emissao',    label: 'Data Emissão', tipo: 'date',   required: true },
    { key: 'entrada',    label: 'Data Entrada', tipo: 'date',   required: true },
    { key: 'valor',      label: 'Valor (R$)',   tipo: 'number', required: true },
    { key: 'status',     label: 'Status',       tipo: 'select', opcoes: ['Conferida', 'Pendente', 'Divergência'] },
  ],
  dadosMock: [
    { id: 1, numero: '000001234', fornecedor: 'Dell Brasil Ltda',     emissao: '2026-04-14', entrada: '2026-04-15', valor: 49000.00, status: 'Conferida'   },
    { id: 2, numero: '000005678', fornecedor: 'Logitech do Brasil',   emissao: '2026-04-19', entrada: '2026-04-20', valor: 8750.00,  status: 'Conferida'   },
    { id: 3, numero: '000009012', fornecedor: 'LG Electronics Brasil',emissao: '2026-04-22', entrada: '2026-04-23', valor: 14100.00, status: 'Divergência' },
    { id: 4, numero: '000003456', fornecedor: 'HyperX Gaming Brasil', emissao: '2026-04-24', entrada: '2026-04-25', valor: 12400.00, status: 'Pendente'    },
  ],
}

export const fornecedores: ModuloConfig = {
  titulo: 'Fornecedores',
  subtitulo: 'Cadastro e gestão de fornecedores homologados',
  entidade: 'fornecedor',
  colunas: [
    { key: 'razaoSocial', label: 'Razão Social', tipo: 'texto' },
    { key: 'cnpj',        label: 'CNPJ',         tipo: 'texto' },
    { key: 'contato',     label: 'Contato',      tipo: 'texto' },
    { key: 'email',       label: 'E-mail',       tipo: 'email' },
    { key: 'cidade',      label: 'Cidade/UF',    tipo: 'texto' },
    { key: 'status',      label: 'Status',       tipo: 'badge', corBadge: { Ativo: 'green', Inativo: 'red', 'Em análise': 'yellow' } },
  ],
  campos: [
    { key: 'razaoSocial', label: 'Razão Social', tipo: 'text',  required: true },
    { key: 'cnpj',        label: 'CNPJ',         tipo: 'text',  required: true, placeholder: '00.000.000/0000-00' },
    { key: 'contato',     label: 'Contato',      tipo: 'text' },
    { key: 'email',       label: 'E-mail',       tipo: 'email' },
    { key: 'cidade',      label: 'Cidade/UF',    tipo: 'text' },
    { key: 'status',      label: 'Status',       tipo: 'select', opcoes: ['Ativo', 'Inativo', 'Em análise'] },
  ],
  dadosMock: [
    { id: 1, razaoSocial: 'Dell Brasil Ltda',          cnpj: '72.381.189/0001-10', contato: 'João Pereira',   email: 'joao@dell.com',      cidade: 'São Paulo/SP',   status: 'Ativo'      },
    { id: 2, razaoSocial: 'Logitech do Brasil',        cnpj: '09.164.435/0001-50', contato: 'Marcia Santos',  email: 'marcia@logitech.com',cidade: 'Curitiba/PR',    status: 'Ativo'      },
    { id: 3, razaoSocial: 'LG Electronics Brasil Ltda',cnpj: '56.928.380/0001-80', contato: 'Pedro Alves',    email: 'pedro@lg.com',       cidade: 'Manaus/AM',      status: 'Ativo'      },
    { id: 4, razaoSocial: 'TP-Link Brasil',            cnpj: '13.877.157/0001-04', contato: 'Carla Nunes',    email: 'carla@tplink.com',   cidade: 'São Paulo/SP',   status: 'Em análise' },
    { id: 5, razaoSocial: 'HyperX Gaming Brasil',      cnpj: '24.553.121/0001-33', contato: 'Lucas Ferreira', email: 'lucas@hyperx.com',   cidade: 'Porto Alegre/RS',status: 'Inativo'    },
  ],
}

// ── Financeiro ────────────────────────────────────────────────────────────────

export const contasPagar: ModuloConfig = {
  titulo: 'Contas a Pagar',
  subtitulo: 'Controle de obrigações financeiras e vencimentos',
  entidade: 'conta a pagar',
  colunas: [
    { key: 'descricao',   label: 'Descrição',  tipo: 'texto' },
    { key: 'fornecedor',  label: 'Fornecedor', tipo: 'texto' },
    { key: 'vencimento',  label: 'Vencimento', tipo: 'data'  },
    { key: 'valor',       label: 'Valor',      tipo: 'moeda' },
    { key: 'categoria',   label: 'Categoria',  tipo: 'texto' },
    { key: 'status',      label: 'Status',     tipo: 'badge', corBadge: { Paga: 'green', Pendente: 'yellow', Vencida: 'red' } },
  ],
  campos: [
    { key: 'descricao',  label: 'Descrição',    tipo: 'text',   required: true },
    { key: 'fornecedor', label: 'Fornecedor',   tipo: 'text',   required: true },
    { key: 'vencimento', label: 'Vencimento',   tipo: 'date',   required: true },
    { key: 'valor',      label: 'Valor (R$)',   tipo: 'number', required: true },
    { key: 'categoria',  label: 'Categoria',    tipo: 'select', opcoes: ['Aluguel', 'Salários', 'Impostos', 'Fornecedores', 'Serviços', 'Outros'] },
    { key: 'status',     label: 'Status',       tipo: 'select', opcoes: ['Pendente', 'Paga', 'Vencida'] },
  ],
  dadosMock: [
    { id: 1, descricao: 'Aluguel sede — Abr/26',       fornecedor: 'Imobiliária Central',  vencimento: '2026-04-05', valor: 8500.00,  categoria: 'Aluguel',       status: 'Paga'     },
    { id: 2, descricao: 'Folha de pagamento Abr/26',   fornecedor: 'Departamento RH',      vencimento: '2026-04-07', valor: 45200.00, categoria: 'Salários',      status: 'Paga'     },
    { id: 3, descricao: 'Nota Fiscal Dell OC-2026-001',fornecedor: 'Dell Brasil Ltda',     vencimento: '2026-04-30', valor: 49000.00, categoria: 'Fornecedores',  status: 'Pendente' },
    { id: 4, descricao: 'DARF — Simples Nacional',     fornecedor: 'Receita Federal',      vencimento: '2026-04-20', valor: 3800.00,  categoria: 'Impostos',      status: 'Vencida'  },
    { id: 5, descricao: 'Internet e Telefonia',        fornecedor: 'Claro Empresas',       vencimento: '2026-05-05', valor: 980.00,   categoria: 'Serviços',      status: 'Pendente' },
    { id: 6, descricao: 'Manutenção de servidores',    fornecedor: 'TechSupport Ltda',     vencimento: '2026-05-15', valor: 2400.00,  categoria: 'Serviços',      status: 'Pendente' },
  ],
}

export const contasReceber: ModuloConfig = {
  titulo: 'Contas a Receber',
  subtitulo: 'Acompanhamento de recebíveis e inadimplência',
  entidade: 'conta a receber',
  colunas: [
    { key: 'descricao',  label: 'Descrição',  tipo: 'texto' },
    { key: 'cliente',    label: 'Cliente',    tipo: 'texto' },
    { key: 'vencimento', label: 'Vencimento', tipo: 'data'  },
    { key: 'valor',      label: 'Valor',      tipo: 'moeda' },
    { key: 'parcela',    label: 'Parcela',    tipo: 'texto' },
    { key: 'status',     label: 'Status',     tipo: 'badge', corBadge: { Recebida: 'green', 'A receber': 'blue', Atrasada: 'red', Negociando: 'yellow' } },
  ],
  campos: [
    { key: 'descricao',  label: 'Descrição',  tipo: 'text',   required: true },
    { key: 'cliente',    label: 'Cliente',    tipo: 'text',   required: true },
    { key: 'vencimento', label: 'Vencimento', tipo: 'date',   required: true },
    { key: 'valor',      label: 'Valor (R$)', tipo: 'number', required: true },
    { key: 'parcela',    label: 'Parcela',    tipo: 'text',   placeholder: 'Ex: 1/3' },
    { key: 'status',     label: 'Status',     tipo: 'select', opcoes: ['A receber', 'Recebida', 'Atrasada', 'Negociando'] },
  ],
  dadosMock: [
    { id: 1, descricao: 'Venda Notebooks — Contrato 112', cliente: 'Escritório Modelo SA',    vencimento: '2026-04-10', valor: 9899.70,  parcela: '1/3', status: 'Recebida'  },
    { id: 2, descricao: 'Venda Notebooks — Contrato 112', cliente: 'Escritório Modelo SA',    vencimento: '2026-05-10', valor: 9899.70,  parcela: '2/3', status: 'A receber' },
    { id: 3, descricao: 'Venda Periféricos — Pedido 089', cliente: 'Construtora Boa Obra',    vencimento: '2026-04-05', valor: 4750.00,  parcela: '—',   status: 'Atrasada'  },
    { id: 4, descricao: 'Suporte TI — Contrato Anual',    cliente: 'Clínica Saúde Total',     vencimento: '2026-05-01', valor: 1800.00,  parcela: '4/12',status: 'A receber' },
    { id: 5, descricao: 'Servidores Cloud — Pedido 203',  cliente: 'Transportadora Veloz',    vencimento: '2026-03-31', valor: 18200.00, parcela: '—',   status: 'Negociando'},
  ],
}

export const centrosCusto: ModuloConfig = {
  titulo: 'Centros de Custo',
  subtitulo: 'Estrutura orçamentária por departamento e projeto',
  entidade: 'centro de custo',
  colunas: [
    { key: 'codigo',       label: 'Código',      tipo: 'texto'  },
    { key: 'nome',         label: 'Nome',        tipo: 'texto'  },
    { key: 'tipo',         label: 'Tipo',        tipo: 'badge',  corBadge: { Departamento: 'blue', Projeto: 'purple', Produto: 'orange' } },
    { key: 'responsavel',  label: 'Responsável', tipo: 'texto'  },
    { key: 'orcamento',    label: 'Orçamento',   tipo: 'moeda'  },
    { key: 'realizado',    label: 'Realizado',   tipo: 'moeda'  },
  ],
  campos: [
    { key: 'codigo',      label: 'Código',       tipo: 'text',   required: true, placeholder: 'CC-000' },
    { key: 'nome',        label: 'Nome',         tipo: 'text',   required: true },
    { key: 'tipo',        label: 'Tipo',         tipo: 'select', opcoes: ['Departamento', 'Projeto', 'Produto'] },
    { key: 'responsavel', label: 'Responsável',  tipo: 'text',   required: true },
    { key: 'orcamento',   label: 'Orçamento (R$)', tipo: 'number', required: true },
  ],
  dadosMock: [
    { id: 1, codigo: 'CC-001', nome: 'Comercial',           tipo: 'Departamento', responsavel: 'Marcos Vieira',  orcamento: 85000, realizado: 72400 },
    { id: 2, codigo: 'CC-002', nome: 'Tecnologia da Informação', tipo: 'Departamento', responsavel: 'Beatriz Souza', orcamento: 120000, realizado: 98500 },
    { id: 3, codigo: 'CC-003', nome: 'Recursos Humanos',    tipo: 'Departamento', responsavel: 'Patrícia Lima',  orcamento: 55000,  realizado: 51200 },
    { id: 4, codigo: 'CC-100', nome: 'Projeto Alpha — ERP', tipo: 'Projeto',      responsavel: 'Beatriz Souza',  orcamento: 200000, realizado: 145000},
    { id: 5, codigo: 'CC-101', nome: 'Projeto Beta — App',  tipo: 'Projeto',      responsavel: 'Rafael Costa',   orcamento: 80000,  realizado: 34200 },
    { id: 6, codigo: 'PR-001', nome: 'Linha Corporativa',   tipo: 'Produto',      responsavel: 'Marcos Vieira',  orcamento: 350000, realizado: 289000},
  ],
}

// ── Insumos ───────────────────────────────────────────────────────────────────

export const cadastroInsumos: ModuloConfig = {
  titulo: 'Cadastro de Insumos',
  subtitulo: 'Registro de matérias-primas e insumos de produção',
  entidade: 'insumo',
  colunas: [
    { key: 'codigo',      label: 'Código',       tipo: 'texto'  },
    { key: 'nome',        label: 'Nome',         tipo: 'texto'  },
    { key: 'unidade',     label: 'UN',           tipo: 'texto'  },
    { key: 'estoque',     label: 'Estoque',      tipo: 'numero' },
    { key: 'estoqueMin',  label: 'Est. Mínimo',  tipo: 'numero' },
    { key: 'custoMedio',  label: 'Custo Médio',  tipo: 'moeda'  },
    { key: 'status',      label: 'Status',       tipo: 'badge',  corBadge: { Normal: 'green', Baixo: 'yellow', Crítico: 'red' } },
  ],
  campos: [
    { key: 'codigo',     label: 'Código',         tipo: 'text',   required: true, placeholder: 'INS-000' },
    { key: 'nome',       label: 'Nome',           tipo: 'text',   required: true },
    { key: 'unidade',    label: 'Unidade',        tipo: 'select', opcoes: ['UN', 'KG', 'L', 'M', 'M²', 'CX', 'PC'] },
    { key: 'estoqueMin', label: 'Estoque Mínimo', tipo: 'number', required: true },
    { key: 'custoMedio', label: 'Custo Médio (R$)', tipo: 'number' },
  ],
  dadosMock: [
    { id: 1, codigo: 'INS-001', nome: 'Placa de MDF 15mm',      unidade: 'M²', estoque: 240, estoqueMin: 50,  custoMedio: 89.90,  status: 'Normal'  },
    { id: 2, codigo: 'INS-002', nome: 'Parafuso M4 × 20mm',     unidade: 'CX', estoque: 12,  estoqueMin: 20,  custoMedio: 34.50,  status: 'Baixo'   },
    { id: 3, codigo: 'INS-003', nome: 'Tinta Acrílica Branca',  unidade: 'L',  estoque: 3,   estoqueMin: 10,  custoMedio: 28.00,  status: 'Crítico' },
    { id: 4, codigo: 'INS-004', nome: 'Cola PVA Industrial',    unidade: 'KG', estoque: 45,  estoqueMin: 15,  custoMedio: 12.80,  status: 'Normal'  },
    { id: 5, codigo: 'INS-005', nome: 'Dobradiça Inox 40mm',    unidade: 'UN', estoque: 380, estoqueMin: 100, custoMedio: 4.20,   status: 'Normal'  },
    { id: 6, codigo: 'INS-006', nome: 'Perfil Alumínio 2m',     unidade: 'UN', estoque: 8,   estoqueMin: 15,  custoMedio: 67.00,  status: 'Crítico' },
  ],
}

export const movimentacaoInsumos: ModuloConfig = {
  titulo: 'Movimentação de Insumos',
  subtitulo: 'Entradas e saídas do almoxarifado de insumos',
  entidade: 'movimentação',
  colunas: [
    { key: 'data',         label: 'Data',        tipo: 'data'  },
    { key: 'insumo',       label: 'Insumo',      tipo: 'texto' },
    { key: 'tipo',         label: 'Tipo',        tipo: 'badge', corBadge: { Entrada: 'green', Saída: 'red', Devolução: 'blue' } },
    { key: 'quantidade',   label: 'Quantidade',  tipo: 'numero'},
    { key: 'unidade',      label: 'UN',          tipo: 'texto' },
    { key: 'solicitante',  label: 'Solicitante', tipo: 'texto' },
  ],
  campos: [
    { key: 'data',        label: 'Data',        tipo: 'date',   required: true },
    { key: 'insumo',      label: 'Insumo',      tipo: 'text',   required: true },
    { key: 'tipo',        label: 'Tipo',        tipo: 'select', opcoes: ['Entrada', 'Saída', 'Devolução'] },
    { key: 'quantidade',  label: 'Quantidade',  tipo: 'number', required: true },
    { key: 'solicitante', label: 'Solicitante', tipo: 'text',   required: true },
  ],
  dadosMock: [
    { id: 1, data: '2026-04-10', insumo: 'Placa de MDF 15mm',   tipo: 'Entrada',   quantidade: 80,  unidade: 'M²', solicitante: 'Almoxarifado' },
    { id: 2, data: '2026-04-11', insumo: 'Cola PVA Industrial',  tipo: 'Saída',     quantidade: 5,   unidade: 'KG', solicitante: 'Linha A'      },
    { id: 3, data: '2026-04-12', insumo: 'Dobradiça Inox 40mm', tipo: 'Saída',     quantidade: 40,  unidade: 'UN', solicitante: 'Linha B'      },
    { id: 4, data: '2026-04-14', insumo: 'Parafuso M4 × 20mm',  tipo: 'Entrada',   quantidade: 5,   unidade: 'CX', solicitante: 'Compras'      },
    { id: 5, data: '2026-04-15', insumo: 'Cola PVA Industrial',  tipo: 'Devolução', quantidade: 2,   unidade: 'KG', solicitante: 'Linha A'      },
    { id: 6, data: '2026-04-18', insumo: 'Tinta Acrílica Branca',tipo: 'Entrada',   quantidade: 20,  unidade: 'L',  solicitante: 'Almoxarifado' },
  ],
}

export const solicitacoesCompra: ModuloConfig = {
  titulo: 'Solicitações de Compra',
  subtitulo: 'Requisições de insumos geradas pela produção',
  entidade: 'solicitação',
  colunas: [
    { key: 'numero',      label: 'Número',      tipo: 'texto' },
    { key: 'insumo',      label: 'Insumo',      tipo: 'texto' },
    { key: 'quantidade',  label: 'Quantidade',  tipo: 'numero'},
    { key: 'solicitante', label: 'Solicitante', tipo: 'texto' },
    { key: 'data',        label: 'Solicitado',  tipo: 'data'  },
    { key: 'status',      label: 'Status',      tipo: 'badge', corBadge: { Aberta: 'yellow', Aprovada: 'blue', Comprada: 'green', Recusada: 'red' } },
  ],
  campos: [
    { key: 'insumo',      label: 'Insumo',      tipo: 'text',   required: true },
    { key: 'quantidade',  label: 'Quantidade',  tipo: 'number', required: true },
    { key: 'solicitante', label: 'Solicitante', tipo: 'text',   required: true },
    { key: 'data',        label: 'Data',        tipo: 'date',   required: true },
    { key: 'status',      label: 'Status',      tipo: 'select', opcoes: ['Aberta', 'Aprovada', 'Comprada', 'Recusada'] },
  ],
  dadosMock: [
    { id: 1, numero: 'SC-2026-001', insumo: 'Tinta Acrílica Branca', quantidade: 30, solicitante: 'Linha A',    data: '2026-04-15', status: 'Aprovada' },
    { id: 2, numero: 'SC-2026-002', insumo: 'Parafuso M4 × 20mm',    quantidade: 10, solicitante: 'Linha B',    data: '2026-04-16', status: 'Comprada' },
    { id: 3, numero: 'SC-2026-003', insumo: 'Perfil Alumínio 2m',     quantidade: 20, solicitante: 'Manutenção', data: '2026-04-18', status: 'Aberta'   },
    { id: 4, numero: 'SC-2026-004', insumo: 'Cola PVA Industrial',     quantidade: 15, solicitante: 'Linha A',    data: '2026-04-20', status: 'Recusada' },
    { id: 5, numero: 'SC-2026-005', insumo: 'Placa de MDF 15mm',      quantidade: 40, solicitante: 'Linha B',    data: '2026-04-22', status: 'Aberta'   },
  ],
}

// ── Fichas Técnicas ───────────────────────────────────────────────────────────

export const fichasProducao: ModuloConfig = {
  titulo: 'Fichas de Produção',
  subtitulo: 'Especificação técnica dos produtos fabricados',
  entidade: 'ficha de produção',
  colunas: [
    { key: 'codigo',      label: 'Código',         tipo: 'texto'  },
    { key: 'produto',     label: 'Produto',        tipo: 'texto'  },
    { key: 'rendimento',  label: 'Rendimento',     tipo: 'texto'  },
    { key: 'tempoPreparo',label: 'Tempo (min)',     tipo: 'numero' },
    { key: 'custoProd',   label: 'Custo Produção', tipo: 'moeda'  },
    { key: 'versao',      label: 'Versão',         tipo: 'badge',  corBadge: { Ativa: 'green', Rascunho: 'yellow', Obsoleta: 'gray' } },
  ],
  campos: [
    { key: 'codigo',      label: 'Código',       tipo: 'text',   required: true, placeholder: 'FP-000' },
    { key: 'produto',     label: 'Produto',      tipo: 'text',   required: true },
    { key: 'rendimento',  label: 'Rendimento',   tipo: 'text',   placeholder: 'Ex: 10 unidades' },
    { key: 'tempoPreparo',label: 'Tempo (min)',   tipo: 'number', required: true },
    { key: 'custoProd',   label: 'Custo (R$)',   tipo: 'number' },
    { key: 'versao',      label: 'Versão',       tipo: 'select', opcoes: ['Ativa', 'Rascunho', 'Obsoleta'] },
  ],
  dadosMock: [
    { id: 1, codigo: 'FP-001', produto: 'Mesa Home Office 1,20m',      rendimento: '1 unidade',  tempoPreparo: 180, custoProd: 380.00, versao: 'Ativa'    },
    { id: 2, codigo: 'FP-002', produto: 'Cadeira Executiva Base Prata', rendimento: '1 unidade',  tempoPreparo: 95,  custoProd: 290.00, versao: 'Ativa'    },
    { id: 3, codigo: 'FP-003', produto: 'Prateleira Suspensa 80cm',    rendimento: '2 unidades', tempoPreparo: 60,  custoProd: 95.00,  versao: 'Ativa'    },
    { id: 4, codigo: 'FP-004', produto: 'Armário Organizador 4 portas',rendimento: '1 unidade',  tempoPreparo: 240, custoProd: 520.00, versao: 'Rascunho' },
    { id: 5, codigo: 'FP-005', produto: 'Mesa de Canto L',             rendimento: '1 unidade',  tempoPreparo: 150, custoProd: 310.00, versao: 'Obsoleta' },
  ],
}

export const composicaoProdutos: ModuloConfig = {
  titulo: 'Composição de Produtos',
  subtitulo: 'Lista de materiais (BOM) por produto fabricado',
  entidade: 'item de composição',
  colunas: [
    { key: 'produto',    label: 'Produto',     tipo: 'texto'  },
    { key: 'insumo',     label: 'Insumo',      tipo: 'texto'  },
    { key: 'quantidade', label: 'Quantidade',  tipo: 'numero' },
    { key: 'unidade',    label: 'UN',          tipo: 'texto'  },
    { key: 'custo',      label: 'Custo',       tipo: 'moeda'  },
    { key: 'perdaMed',   label: 'Perda %',     tipo: 'numero' },
  ],
  campos: [
    { key: 'produto',    label: 'Produto',    tipo: 'text',   required: true },
    { key: 'insumo',     label: 'Insumo',     tipo: 'text',   required: true },
    { key: 'quantidade', label: 'Quantidade', tipo: 'number', required: true },
    { key: 'unidade',    label: 'Unidade',    tipo: 'select', opcoes: ['UN', 'KG', 'L', 'M', 'M²'] },
    { key: 'perdaMed',   label: 'Perda % (média)', tipo: 'number', placeholder: '0' },
  ],
  dadosMock: [
    { id: 1, produto: 'Mesa Home Office 1,20m', insumo: 'Placa de MDF 15mm',     quantidade: 3.2, unidade: 'M²', custo: 287.68, perdaMed: 5 },
    { id: 2, produto: 'Mesa Home Office 1,20m', insumo: 'Perfil Alumínio 2m',    quantidade: 2,   unidade: 'UN', custo: 134.00, perdaMed: 2 },
    { id: 3, produto: 'Mesa Home Office 1,20m', insumo: 'Parafuso M4 × 20mm',   quantidade: 0.2, unidade: 'CX', custo: 6.90,   perdaMed: 0 },
    { id: 4, produto: 'Prateleira Suspensa 80cm',insumo: 'Placa de MDF 15mm',    quantidade: 0.8, unidade: 'M²', custo: 71.92,  perdaMed: 5 },
    { id: 5, produto: 'Prateleira Suspensa 80cm',insumo: 'Dobradiça Inox 40mm',  quantidade: 4,   unidade: 'UN', custo: 16.80,  perdaMed: 0 },
    { id: 6, produto: 'Prateleira Suspensa 80cm',insumo: 'Cola PVA Industrial',   quantidade: 0.3, unidade: 'KG', custo: 3.84,   perdaMed: 3 },
  ],
}

export const controleQualidade: ModuloConfig = {
  titulo: 'Controle de Qualidade',
  subtitulo: 'Registros de inspeção e conformidade dos produtos',
  entidade: 'registro de qualidade',
  colunas: [
    { key: 'data',         label: 'Data',        tipo: 'data'  },
    { key: 'produto',      label: 'Produto',     tipo: 'texto' },
    { key: 'lote',         label: 'Lote',        tipo: 'texto' },
    { key: 'responsavel',  label: 'Inspetor',    tipo: 'texto' },
    { key: 'resultado',    label: 'Resultado',   tipo: 'badge', corBadge: { Aprovado: 'green', Reprovado: 'red', 'Em análise': 'yellow' } },
    { key: 'observacao',   label: 'Observação',  tipo: 'texto' },
  ],
  campos: [
    { key: 'data',        label: 'Data',        tipo: 'date',     required: true },
    { key: 'produto',     label: 'Produto',     tipo: 'text',     required: true },
    { key: 'lote',        label: 'Lote',        tipo: 'text',     required: true, placeholder: 'LOT-000' },
    { key: 'responsavel', label: 'Inspetor',    tipo: 'text',     required: true },
    { key: 'resultado',   label: 'Resultado',   tipo: 'select',   opcoes: ['Aprovado', 'Reprovado', 'Em análise'] },
    { key: 'observacao',  label: 'Observação',  tipo: 'textarea' },
  ],
  dadosMock: [
    { id: 1, data: '2026-04-05', produto: 'Mesa Home Office 1,20m',       lote: 'LOT-042', responsavel: 'Gustavo Lima',    resultado: 'Aprovado',    observacao: '' },
    { id: 2, data: '2026-04-08', produto: 'Cadeira Executiva Base Prata', lote: 'LOT-043', responsavel: 'Gustavo Lima',    resultado: 'Reprovado',   observacao: 'Base fora de alinhamento — retorno para ajuste' },
    { id: 3, data: '2026-04-10', produto: 'Prateleira Suspensa 80cm',     lote: 'LOT-044', responsavel: 'Silvia Rocha',    resultado: 'Aprovado',    observacao: '' },
    { id: 4, data: '2026-04-14', produto: 'Mesa Home Office 1,20m',       lote: 'LOT-045', responsavel: 'Silvia Rocha',    resultado: 'Em análise',  observacao: 'Verificar acabamento lateral' },
    { id: 5, data: '2026-04-18', produto: 'Armário Organizador 4 portas', lote: 'LOT-046', responsavel: 'Gustavo Lima',    resultado: 'Aprovado',    observacao: '' },
  ],
}

// ── Usuários ──────────────────────────────────────────────────────────────────

export const gruposAcesso: ModuloConfig = {
  titulo: 'Grupos de Acesso',
  subtitulo: 'Agrupamento de usuários com perfis de permissão compartilhados',
  entidade: 'grupo',
  colunas: [
    { key: 'nome',        label: 'Nome do Grupo', tipo: 'texto'  },
    { key: 'descricao',   label: 'Descrição',     tipo: 'texto'  },
    { key: 'nivel',       label: 'Nível',         tipo: 'numero' },
    { key: 'membros',     label: 'Membros',       tipo: 'numero' },
    { key: 'status',      label: 'Status',        tipo: 'badge',  corBadge: { Ativo: 'green', Inativo: 'red' } },
  ],
  campos: [
    { key: 'nome',      label: 'Nome do Grupo', tipo: 'text',   required: true },
    { key: 'descricao', label: 'Descrição',     tipo: 'textarea' },
    { key: 'nivel',     label: 'Nível (1–5)',   tipo: 'number', required: true },
    { key: 'status',    label: 'Status',        tipo: 'select', opcoes: ['Ativo', 'Inativo'] },
  ],
  dadosMock: [
    { id: 1, nome: 'Administradores', descricao: 'Acesso completo ao sistema',          nivel: 5, membros: 2,  status: 'Ativo'   },
    { id: 2, nome: 'Gerência',        descricao: 'Acesso gerencial — dashboards e relatórios', nivel: 4, membros: 4,  status: 'Ativo'   },
    { id: 3, nome: 'Operacional TI',  descricao: 'Equipe de suporte e manutenção',      nivel: 3, membros: 6,  status: 'Ativo'   },
    { id: 4, nome: 'Financeiro',      descricao: 'Módulo financeiro e relatórios',      nivel: 3, membros: 3,  status: 'Ativo'   },
    { id: 5, nome: 'Produção',        descricao: 'Acesso aos módulos de produção',      nivel: 2, membros: 12, status: 'Ativo'   },
    { id: 6, nome: 'Visitante',       descricao: 'Somente leitura — módulos básicos',  nivel: 1, membros: 0,  status: 'Inativo' },
  ],
}

export const historicoAcessos: ModuloConfig = {
  titulo: 'Histórico de Acessos',
  subtitulo: 'Log de autenticações e ações dos usuários no sistema',
  entidade: 'registro de acesso',
  colunas: [
    { key: 'dataHora',   label: 'Data/Hora',  tipo: 'texto' },
    { key: 'usuario',    label: 'Usuário',    tipo: 'texto' },
    { key: 'acao',       label: 'Ação',       tipo: 'badge', corBadge: { Login: 'green', Logout: 'gray', 'Alteração': 'blue', 'Tentativa falha': 'red' } },
    { key: 'modulo',     label: 'Módulo',     tipo: 'texto' },
    { key: 'ip',         label: 'IP',         tipo: 'texto' },
    { key: 'resultado',  label: 'Resultado',  tipo: 'badge', corBadge: { Sucesso: 'green', Falha: 'red' } },
  ],
  campos: [],
  dadosMock: [
    { id: 1, dataHora: '25/04/2026 08:12', usuario: 'admin',     acao: 'Login',          modulo: 'Auth',       ip: '192.168.1.10',  resultado: 'Sucesso' },
    { id: 2, dataHora: '25/04/2026 08:15', usuario: 'maria.g',   acao: 'Login',          modulo: 'Auth',       ip: '192.168.1.22',  resultado: 'Sucesso' },
    { id: 3, dataHora: '25/04/2026 09:03', usuario: 'joao.s',    acao: 'Tentativa falha',modulo: 'Auth',       ip: '200.140.20.5',  resultado: 'Falha'   },
    { id: 4, dataHora: '25/04/2026 09:45', usuario: 'admin',     acao: 'Alteração',      modulo: 'Usuários',   ip: '192.168.1.10',  resultado: 'Sucesso' },
    { id: 5, dataHora: '25/04/2026 10:30', usuario: 'maria.g',   acao: 'Logout',         modulo: 'Auth',       ip: '192.168.1.22',  resultado: 'Sucesso' },
    { id: 6, dataHora: '25/04/2026 11:00', usuario: 'carlos.m',  acao: 'Login',          modulo: 'Auth',       ip: '192.168.1.31',  resultado: 'Sucesso' },
    { id: 7, dataHora: '25/04/2026 11:22', usuario: 'carlos.m',  acao: 'Alteração',      modulo: 'Financeiro', ip: '192.168.1.31',  resultado: 'Sucesso' },
  ],
}

// ── Permissões ────────────────────────────────────────────────────────────────

export const perfisAcesso: ModuloConfig = {
  titulo: 'Perfis de Acesso',
  subtitulo: 'Definição de permissões por módulo e perfil de usuário',
  entidade: 'perfil de acesso',
  colunas: [
    { key: 'perfil',    label: 'Perfil',          tipo: 'texto' },
    { key: 'modulo',    label: 'Módulo',          tipo: 'texto' },
    { key: 'criar',     label: 'Criar',           tipo: 'badge', corBadge: { Sim: 'green', Não: 'gray' } },
    { key: 'editar',    label: 'Editar',          tipo: 'badge', corBadge: { Sim: 'green', Não: 'gray' } },
    { key: 'excluir',   label: 'Excluir',         tipo: 'badge', corBadge: { Sim: 'green', Não: 'gray' } },
    { key: 'relatorio', label: 'Relatórios',      tipo: 'badge', corBadge: { Sim: 'green', Não: 'gray' } },
  ],
  campos: [
    { key: 'perfil',    label: 'Perfil',     tipo: 'select', opcoes: ['Administrador', 'Gerente', 'Operador', 'Visualizador'] },
    { key: 'modulo',    label: 'Módulo',     tipo: 'select', opcoes: ['Produtos', 'Recebimento', 'Financeiro', 'Insumos', 'Fichas Técnicas', 'Usuários', 'Permissões'] },
    { key: 'criar',     label: 'Criar',      tipo: 'select', opcoes: ['Sim', 'Não'] },
    { key: 'editar',    label: 'Editar',     tipo: 'select', opcoes: ['Sim', 'Não'] },
    { key: 'excluir',   label: 'Excluir',    tipo: 'select', opcoes: ['Sim', 'Não'] },
    { key: 'relatorio', label: 'Relatórios', tipo: 'select', opcoes: ['Sim', 'Não'] },
  ],
  dadosMock: [
    { id: 1, perfil: 'Administrador', modulo: 'Produtos',      criar: 'Sim', editar: 'Sim', excluir: 'Sim', relatorio: 'Sim' },
    { id: 2, perfil: 'Gerente',       modulo: 'Produtos',      criar: 'Sim', editar: 'Sim', excluir: 'Não', relatorio: 'Sim' },
    { id: 3, perfil: 'Operador',      modulo: 'Produtos',      criar: 'Sim', editar: 'Sim', excluir: 'Não', relatorio: 'Não' },
    { id: 4, perfil: 'Visualizador',  modulo: 'Produtos',      criar: 'Não', editar: 'Não', excluir: 'Não', relatorio: 'Sim' },
    { id: 5, perfil: 'Administrador', modulo: 'Financeiro',    criar: 'Sim', editar: 'Sim', excluir: 'Sim', relatorio: 'Sim' },
    { id: 6, perfil: 'Gerente',       modulo: 'Financeiro',    criar: 'Não', editar: 'Não', excluir: 'Não', relatorio: 'Sim' },
    { id: 7, perfil: 'Operador',      modulo: 'Financeiro',    criar: 'Não', editar: 'Não', excluir: 'Não', relatorio: 'Não' },
  ],
}

export const logAuditoria: ModuloConfig = {
  titulo: 'Log de Auditoria',
  subtitulo: 'Rastreamento completo de alterações no sistema',
  entidade: 'evento de auditoria',
  colunas: [
    { key: 'dataHora',  label: 'Data/Hora',  tipo: 'texto' },
    { key: 'usuario',   label: 'Usuário',    tipo: 'texto' },
    { key: 'entidade',  label: 'Entidade',   tipo: 'texto' },
    { key: 'operacao',  label: 'Operação',   tipo: 'badge', corBadge: { Criação: 'green', Edição: 'blue', Exclusão: 'red', Consulta: 'gray' } },
    { key: 'descricao', label: 'Descrição',  tipo: 'texto' },
    { key: 'ip',        label: 'IP',         tipo: 'texto' },
  ],
  campos: [],
  dadosMock: [
    { id: 1, dataHora: '25/04/2026 08:20', usuario: 'admin',    entidade: 'Produto',   operacao: 'Criação',  descricao: 'Criou "Notebook Dell G15"',          ip: '192.168.1.10' },
    { id: 2, dataHora: '25/04/2026 09:05', usuario: 'maria.g',  entidade: 'Usuário',   operacao: 'Edição',   descricao: 'Alterou e-mail do usuário joao.s',   ip: '192.168.1.22' },
    { id: 3, dataHora: '25/04/2026 09:48', usuario: 'admin',    entidade: 'Permissão', operacao: 'Edição',   descricao: 'Alterou perfil "Operador" — Financeiro',ip: '192.168.1.10'},
    { id: 4, dataHora: '25/04/2026 10:15', usuario: 'carlos.m', entidade: 'Produto',   operacao: 'Exclusão', descricao: 'Removeu "Switch antigo 8p"',         ip: '192.168.1.31' },
    { id: 5, dataHora: '25/04/2026 11:30', usuario: 'maria.g',  entidade: 'Fornecedor',operacao: 'Criação',  descricao: 'Cadastrou "HyperX Gaming Brasil"',   ip: '192.168.1.22' },
    { id: 6, dataHora: '25/04/2026 11:55', usuario: 'admin',    entidade: 'Relatório', operacao: 'Consulta', descricao: 'Gerou relatório de Contas a Pagar',  ip: '192.168.1.10' },
  ],
}

// ── Mapa path → config ────────────────────────────────────────────────────────

export const mapaConfiguracoes: Record<string, ModuloConfig> = {
  '/products/estoque':              controlEstoque,
  '/products/precos':               tabelaPrecos,
  '/receiving/orders':              ordensCompra,
  '/receiving/invoices':            notasFiscais,
  '/receiving/suppliers':           fornecedores,
  '/financial/payables':            contasPagar,
  '/financial/receivables':         contasReceber,
  '/financial/cost-centers':        centrosCusto,
  '/inputs/cadastro':               cadastroInsumos,
  '/inputs/movements':              movimentacaoInsumos,
  '/inputs/requests':               solicitacoesCompra,
  '/technical-sheets/sheets':       fichasProducao,
  '/technical-sheets/composition':  composicaoProdutos,
  '/technical-sheets/quality':      controleQualidade,
  '/users/groups':                  gruposAcesso,
  '/users/history':                 historicoAcessos,
  '/permissions/profiles':          perfisAcesso,
  '/permissions/audit':             logAuditoria,
}
