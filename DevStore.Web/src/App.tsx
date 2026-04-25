import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ModuloPage } from '@/components/modulo/ModuloPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProductsPage } from '@/pages/products/ProductsPage'
import { ReceivingPage } from '@/pages/receiving/ReceivingPage'
import { FinancialPage } from '@/pages/financial/FinancialPage'
import { InputsPage } from '@/pages/inputs/InputsPage'
import { TechnicalSheetsPage } from '@/pages/technical-sheets/TechnicalSheetsPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { PermissionsPage } from '@/pages/permissions/PermissionsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Produtos */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/estoque" element={<ModuloPage />} />
            <Route path="/products/precos" element={<ModuloPage />} />

            {/* Recebimento */}
            <Route path="/receiving" element={<ReceivingPage />} />
            <Route path="/receiving/orders" element={<ModuloPage />} />
            <Route path="/receiving/invoices" element={<ModuloPage />} />
            <Route path="/receiving/suppliers" element={<ModuloPage />} />

            {/* Financeiro */}
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/financial/payables" element={<ModuloPage />} />
            <Route path="/financial/receivables" element={<ModuloPage />} />
            <Route path="/financial/cost-centers" element={<ModuloPage />} />

            {/* Insumos */}
            <Route path="/inputs" element={<InputsPage />} />
            <Route path="/inputs/cadastro" element={<ModuloPage />} />
            <Route path="/inputs/movements" element={<ModuloPage />} />
            <Route path="/inputs/requests" element={<ModuloPage />} />

            {/* Fichas Técnicas */}
            <Route path="/technical-sheets" element={<TechnicalSheetsPage />} />
            <Route path="/technical-sheets/sheets" element={<ModuloPage />} />
            <Route path="/technical-sheets/composition" element={<ModuloPage />} />
            <Route path="/technical-sheets/quality" element={<ModuloPage />} />

            {/* Usuários */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/groups" element={<ModuloPage />} />
            <Route path="/users/history" element={<ModuloPage />} />

            {/* Permissões */}
            <Route path="/permissions" element={<PermissionsPage />} />
            <Route path="/permissions/profiles" element={<ModuloPage />} />
            <Route path="/permissions/audit" element={<ModuloPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
