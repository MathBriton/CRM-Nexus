import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6">
          <div className="flex max-w-md flex-col items-center gap-3 px-4 text-center">
            <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">Algo deu errado</h1>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ?? 'Erro inesperado na aplicação.'}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
