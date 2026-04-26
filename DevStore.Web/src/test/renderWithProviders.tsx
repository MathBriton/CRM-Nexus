import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

interface Options {
  route?: string
}

export function renderWithProviders(ui: ReactElement, { route = '/' }: Options = {}) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  )
}
