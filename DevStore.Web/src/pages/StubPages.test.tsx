import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ReceivingPage } from './receiving/ReceivingPage'
import { FinancialPage } from './financial/FinancialPage'
import { InputsPage } from './inputs/InputsPage'
import { TechnicalSheetsPage } from './technical-sheets/TechnicalSheetsPage'
import { UsersPage } from './users/UsersPage'
import { PermissionsPage } from './permissions/PermissionsPage'

describe('Páginas stub dos módulos', () => {
  it('ReceivingPage exibe título', () => {
    renderWithProviders(<ReceivingPage />)
    expect(screen.getByRole('heading', { name: /recebimento/i })).toBeInTheDocument()
  })

  it('FinancialPage exibe título', () => {
    renderWithProviders(<FinancialPage />)
    expect(screen.getByRole('heading', { name: /financeiro/i })).toBeInTheDocument()
  })

  it('InputsPage exibe título', () => {
    renderWithProviders(<InputsPage />)
    expect(screen.getByRole('heading', { name: /insumos/i })).toBeInTheDocument()
  })

  it('TechnicalSheetsPage exibe título', () => {
    renderWithProviders(<TechnicalSheetsPage />)
    expect(screen.getByRole('heading', { name: /fichas técnicas/i })).toBeInTheDocument()
  })

  it('UsersPage exibe título', () => {
    renderWithProviders(<UsersPage />)
    expect(screen.getByRole('heading', { name: /usuários/i })).toBeInTheDocument()
  })

  it('PermissionsPage exibe título', () => {
    renderWithProviders(<PermissionsPage />)
    expect(screen.getByRole('heading', { name: /permissões/i })).toBeInTheDocument()
  })
})
