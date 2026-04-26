# DevStore — Referência Técnica de Projeto

> Documento vivo. Atualizar conforme o projeto evolui.
> Finalidade: guia de contexto para onboarding, code-review e futuras iterações com IA.

---

## Stack Geral

| Camada        | Tecnologia                                    | Versão   |
|---------------|-----------------------------------------------|----------|
| Backend       | .NET / ASP.NET Core                           | 10       |
| ORM           | Entity Framework Core + SQLite                | 10       |
| Autenticação  | JWT (Bearer token, 8h de expiração)           | —        |
| Frontend      | React + Vite + TypeScript                     | 19 / 8 / 6 |
| UI Components | shadcn/ui base-nova (`@base-ui/react`)        | —        |
| Estilização   | Tailwind CSS v4 (CSS-first config)            | 4        |
| Testes FE     | Vitest + Testing Library + MSW               | 4 / 16 / 2 |
| Testes BE     | xUnit + FluentAssertions + Testcontainers    | —        |

---

## Backend (.NET)

### Arquitetura

```
DevStore.Api            → Controllers, Program.cs, Middlewares
DevStore.Domain         → Entities, Interfaces, Value Objects
DevStore.Infrastructure → EF Core DbContext, Repositories, JWT service
DevStore.UnitTests      → xUnit: Domain e Application
DevStore.IntegrationTests → Testcontainers (banco real em container)
```

### Padrões aplicados

- **Clean Architecture** — separação em camadas (Domain, Application, Infrastructure, Presentation)
- **SOLID** — Single Responsibility em cada serviço; Dependency Inversion via interfaces
- **Repository Pattern** — `IProductRepository`, `IUserRepository`
- **JWT Authentication** — `JwtService` gera e valida tokens; middleware de autorização por role
- **EF Core Migrations** — SQLite em dev; estrutura preparada para PostgreSQL em prod
- **Fluent Validation** — validação de DTOs nos endpoints

### Endpoints principais

```
POST   /api/auth/login           → retorna JWT + dados do usuário
GET    /api/products             → lista produtos (paginado)
POST   /api/products             → cria produto
PUT    /api/products/{id}        → atualiza produto
DELETE /api/products/{id}        → remove produto
GET    /api/users                → lista usuários
POST   /api/users                → cria usuário
PUT    /api/users/{id}           → atualiza usuário
PUT    /api/users/{id}/role      → altera papel do usuário
DELETE /api/users/{id}           → desativa usuário
```

### Boas Práticas BE

- Controllers magros — lógica nos services, não nos controllers
- DTOs separados de Entities (nunca expor a entidade diretamente)
- `async/await` em toda a cadeia de I/O
- Logs estruturados via `ILogger<T>`
- CORS configurado explicitamente (não usar `*` em prod)
- Senhas com `BCrypt.Net`; nunca armazenar plain text

---

## Frontend (React + TypeScript)

### Estrutura de pastas

```
src/
  components/
    layout/           → Sidebar, DashboardLayout, ProtectedRoute
    modulo/           → TabelaCrud, DataTable, FormModal (componentes genéricos de CRUD)
    products/         → ProductList, ProductForm
    users/            → UserList, UserForm
    ui/               → shadcn/ui primitivos (button, input, card…)
    ErrorBoundary.tsx → Captura erros de render global
  contexts/
    AuthContext.tsx   → JWT, login/logout, user state
    ThemeContext.tsx  → Dark/Light mode com persistência em localStorage
  data/
    modulos/
      configuracoes.ts → Configurações e dadosMock de todos os módulos CRUD
  pages/
    LoginPage.tsx
    NotFoundPage.tsx
    dashboard/DashboardPage.tsx
    products/ProductsPage.tsx
    users/UsersPage.tsx
    permissions/PermissionsPage.tsx
    … (receiving, financial, inputs, technical-sheets)
  services/
    productService.ts → Chamadas REST para /api/products
    userService.ts    → Chamadas REST para /api/users
  test/
    handlers.ts       → MSW handlers (mock de 15 produtos, 15 usuários)
    server.ts         → setupServer do MSW
    renderWithProviders.tsx → render com todos os Providers
  types/
    product.ts / user.ts / modulo.ts
```

### Componentes de destaque

#### `TabelaCrud`
Componente genérico de CRUD baseado em `ModuloConfig`:
- Lê `dadosMock` da configuração e mantém estado local
- `salvar()` → cria ou atualiza + dispara `toast.success()`
- `excluir()` → remove + dispara `toast.success()`
- Integra `DataTable` (busca, filtros, paginação) + `FormModal`

#### `DataTable`
Data grid reutilizável:
- Busca global (todos os campos, case-insensitive, XSS-safe via `maxLength`)
- Filtro por planta (select dropdown)
- Filtro de intervalo de data (date inputs + sr-only para acessibilidade)
- Paginação: tamanhos 10 / 25 / 50 / 100 / 250 / 500 / 1000
- Atalho `Ctrl+K` / `⌘+K` para focar a busca

#### `DatePicker`
Calendário com `react-day-picker v9` + `date-fns` + locale `ptBR`:
- UI: `Popover` + `Calendar` de shadcn/ui
- Acessibilidade: `<input type="date" className="sr-only">` síncrono para testes

#### `ThemeContext`
- Aplica classe `dark` no `<html>` sem flash (FOUC-free)
- Persiste em `localStorage('nexus_theme')`
- Toggle exposto via `useTheme()` hook

#### `ErrorBoundary`
- Class component com `getDerivedStateFromError`
- Renderiza tela amigável de erro com botão "Tentar novamente"

#### Toast (sonner)
- `<Toaster richColors position="top-right" closeButton />` no `DashboardLayout`
- Usado em: `TabelaCrud` (salvar/excluir), `ProductForm`, `UserForm`

### Estilização

- **Tailwind CSS v4** com `@custom-variant dark (&:where(.dark, .dark *))` 
- Paleta **dark mode** em OKLCH com tons violet/purple (realça diferença de tonalidade)
- Ícones da sidebar com `drop-shadow` colorido (`filter: brightness(1.2) drop-shadow(0 0 6px currentColor)`)
- Sidebar com accordion exclusivo (apenas uma categoria aberta por vez)
- Gradiente brand: `from-purple-500 to-violet-700`
- Favicon SVG com gradiente purple + letra N

### Boas Práticas FE

- **TypeScript estrito** — sem `any`, tipos explícitos em todos os serviços
- **Sem comentários desnecessários** — código auto-documentado por nomes de função/variável
- **Componentes pequenos** — uma responsabilidade por componente
- **Custom hooks** — `useAuth`, `useTheme` encapsulam lógica de contexto
- **Sem prop-drilling excessivo** — Context API para estado global

---

## Testes

### Frontend (Vitest + Testing Library + MSW)

```bash
npx vitest run          # todos os testes
npx vitest run --coverage  # cobertura (v8)
```

- **MSW** intercepta todas as chamadas REST em memória (sem rede real)
- **renderWithProviders** encapsula `MemoryRouter + AuthProvider + ThemeProvider`
- Abordagem: **TDD/BDD** — testes escritos antes ou junto da feature
- Cobertura: 132 testes em 16 arquivos
- Exclusões de cobertura: `src/components/ui/**`, `src/data/**`, `src/main.tsx`

### Backend (xUnit + Testcontainers)

- **Unit tests** — Domain puro, sem I/O
- **Integration tests** — Testcontainers sobe SQLite/PostgreSQL real em Docker
- **FluentAssertions** — assertions legíveis em inglês fluente
- **Extreme Programming** — pair programming implícito com IA; refatoração contínua; integração frequente

---

## Qualidade e Ferramentas

| Ferramenta         | Propósito                                |
|--------------------|------------------------------------------|
| Prettier           | Formatação automática (`.prettierrc`)    |
| prettier-plugin-tailwindcss | Ordenação de classes Tailwind   |
| husky + lint-staged | Pre-commit hooks (format + typecheck)  |
| ESLint             | Linting TypeScript/React                |
| Vitest coverage-v8 | Relatório HTML/LCOV de cobertura        |

### Scripts disponíveis

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (TypeScript + Vite)
npm run test         # testes em watch mode
npm run test:run     # testes once (CI)
npm run coverage     # cobertura de código
npm run format       # formata com Prettier
npm run format:check # verifica formatação (CI)
npm run lint         # ESLint
```

---

## Melhorias Sugeridas (roadmap)

### Performance
- [ ] Code splitting com `lazy()` + `Suspense` por rota (chunks atuais > 500 kB)
- [ ] React Query / TanStack Query para cache e revalidação das chamadas REST
- [ ] Virtual scrolling no DataTable para datasets > 1000 linhas

### Segurança
- [ ] Refresh token (token de curta duração + refresh de longa duração)
- [ ] Rate limiting no backend (ex.: `AspNetCoreRateLimit`)
- [ ] Content Security Policy (CSP) no Vite/nginx
- [ ] HTTPS only em produção (HSTS)
- [ ] Validação do lado do servidor em todos os DTOs (FluentValidation)

### Qualidade de Código
- [ ] Aumentar cobertura de testes para > 80% (atualmente ~60%)
- [ ] Testes E2E com Playwright (happy path de login + CRUD de produto)
- [ ] Storybook para documentar e testar componentes UI em isolamento
- [ ] Configurar lint-staged para bloquear commits sem formato correto

### UX / Estilização
- [ ] Loading skeletons (shadcn `Skeleton`) em ProductList, UserList
- [ ] Animações de transição de rota com Framer Motion
- [ ] Modo offline / PWA com Service Worker
- [ ] Internacionalização (i18n) com `react-i18next`
- [ ] Acessibilidade: audit com axe-core, foco gerenciado em modais

### Infraestrutura
- [ ] Docker Compose completo (API + PostgreSQL + frontend nginx)
- [ ] GitHub Actions: CI com lint + test + build por PR
- [ ] Variáveis de ambiente validadas em runtime (`zod` no Vite config)
- [ ] Swagger / Scalar UI habilitado em dev para documentação da API

---

## Convenções de Commit (pt-BR)

```
implementa: <descrição da feature>
corrige:    <descrição do bug>
refatora:   <descrição da refatoração>
tarefa:     <configuração, dependências, CI>
testes:     <adição ou correção de testes>
docs:       <documentação>
```

---

## Notas para Futuras Sessões com IA

- Sempre rodar `npm run build && npx vitest run` antes de commitar
- Commits em **português brasileiro**
- `Button` usa `@base-ui/react` — não suporta `asChild`; usar `<Link>` com classes manuais para botão-link
- `UserRole` aceita apenas `'Admin' | 'Manager' | 'User'`
- Cores CSS via OKLCH no `index.css` — não usar hex/rgb para variáveis de tema
- MSW handlers em `src/test/handlers.ts` — atualizar ao adicionar novas entidades
- `corIcon` no Sidebar define a cor do ícone com glow automático via `currentColor`
