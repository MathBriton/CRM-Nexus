import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuloPage } from '@/components/modulo/ModuloPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Administrador */}
              <Route path="/admin/acessos-usuarios" element={<ModuloPage />} />
              <Route path="/admin/alterar-usuario-nexus" element={<ModuloPage />} />
              <Route path="/admin/cadastrar-usuario-nexus" element={<ModuloPage />} />
              <Route path="/admin/cancelar-usuarios" element={<ModuloPage />} />
              <Route path="/admin/criacao-usuarios-ad" element={<ModuloPage />} />
              <Route path="/admin/desativar-usuario-nexus" element={<ModuloPage />} />
              <Route path="/admin/gerenciar-menus" element={<ModuloPage />} />
              <Route path="/admin/permissoes-usuario" element={<ModuloPage />} />
              <Route path="/admin/relatorio-permissoes" element={<ModuloPage />} />
              <Route path="/admin/revisao-usuarios" element={<ModuloPage />} />

              {/* Cadastros FNC */}
              <Route path="/cadastros-fnc/aprovador" element={<ModuloPage />} />
              <Route path="/cadastros-fnc/defeitos" element={<ModuloPage />} />
              <Route path="/cadastros-fnc/responsavel" element={<ModuloPage />} />
              <Route path="/cadastros-fnc/setores" element={<ModuloPage />} />

              {/* Cadastros Orçamento */}
              <Route path="/cadastros-orcamento/analista" element={<ModuloPage />} />
              <Route path="/cadastros-orcamento/aprovadores" element={<ModuloPage />} />
              <Route path="/cadastros-orcamento/faixas-aprovador" element={<ModuloPage />} />

              {/* Cavaco/Aparas */}
              <Route path="/cavaco-aparas/cadastro-fornecedor" element={<ModuloPage />} />
              <Route path="/cavaco-aparas/controle-recebimento" element={<ModuloPage />} />

              {/* Cliente */}
              <Route path="/cliente/cadastro-unificado" element={<ModuloPage />} />

              {/* Compras */}
              <Route path="/compras/classificar-notas" element={<ModuloPage />} />

              {/* Desenvolvimento */}
              <Route path="/desenvolvimento/alteracao-produtos" element={<ModuloPage />} />
              <Route path="/desenvolvimento/aprovacao-comercial-spd" element={<ModuloPage />} />
              <Route path="/desenvolvimento/lote-piloto" element={<ModuloPage />} />
              <Route path="/desenvolvimento/solicitacao-spd-v2" element={<ModuloPage />} />
              <Route path="/desenvolvimento/solicitacao-spd" element={<ModuloPage />} />

              {/* Expedição */}
              <Route path="/expedicao/checklist-transporte" element={<ModuloPage />} />
              <Route path="/expedicao/gerenciar-cargas" element={<ModuloPage />} />

              {/* Financeiro */}
              <Route path="/financeiro/alterar-risco" element={<ModuloPage />} />
              <Route path="/financeiro/cadastro-canhoto" element={<ModuloPage />} />
              <Route path="/financeiro/solicitar-aumento-credito" element={<ModuloPage />} />
              <Route path="/financeiro/solicitar-transferencia-credito" element={<ModuloPage />} />
              <Route path="/financeiro/validadores-credito" element={<ModuloPage />} />

              {/* Pedidos */}
              <Route path="/pedidos/alterar-pedidos-brasil" element={<ModuloPage />} />
              <Route path="/pedidos/entrega-fim-semana" element={<ModuloPage />} />
              <Route path="/pedidos/inclusao-obs-nf" element={<ModuloPage />} />
              <Route path="/pedidos/liberar-emissao" element={<ModuloPage />} />
              <Route path="/pedidos/orcamento-brasil" element={<ModuloPage />} />
              <Route path="/pedidos/parametros" element={<ModuloPage />} />
              <Route path="/pedidos/pedido-chapa" element={<ModuloPage />} />
              <Route path="/pedidos/pedidos" element={<ModuloPage />} />
              <Route path="/pedidos/pedidos-brasil" element={<ModuloPage />} />
              <Route path="/pedidos/pedidos-digitados" element={<ModuloPage />} />
              <Route path="/pedidos/solicitar-alteracao" element={<ModuloPage />} />

              {/* RH */}
              <Route path="/rh/importar-adp" element={<ModuloPage />} />
              <Route path="/rh/impressao-cracha" element={<ModuloPage />} />

              {/* SGQ */}
              <Route path="/sgq/analisar-fnc" element={<ModuloPage />} />
              <Route path="/sgq/aprovacao-fnc" element={<ModuloPage />} />
              <Route path="/sgq/cadastro-refugo-ppm" element={<ModuloPage />} />
              <Route path="/sgq/cadastro-fnc-brasil" element={<ModuloPage />} />
              <Route path="/sgq/responder-fnc" element={<ModuloPage />} />

              {/* Utilitários */}
              <Route path="/utilitarios/alterar-senha" element={<ModuloPage />} />

              {/* Validações */}
              <Route path="/validacoes/papel" element={<ModuloPage />} />
              <Route path="/validacoes/parametros-validacao" element={<ModuloPage />} />
              <Route path="/validacoes/solicitacoes-credito" element={<ModuloPage />} />
              <Route path="/validacoes/validar-alteracao-pedido" element={<ModuloPage />} />
              <Route path="/validacoes/validar-pedido" element={<ModuloPage />} />
              <Route path="/validacoes/validar-pedido-brasil" element={<ModuloPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
