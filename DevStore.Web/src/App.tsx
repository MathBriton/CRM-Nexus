import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoginPage } from '@/pages/LoginPage'
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
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/receiving" element={<ReceivingPage />} />
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/inputs" element={<InputsPage />} />
            <Route path="/technical-sheets" element={<TechnicalSheetsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/permissions" element={<PermissionsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
