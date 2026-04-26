import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex max-w-md flex-col items-center gap-4 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-700/20">
          <SearchX className="h-10 w-10 text-purple-400" />
        </div>
        <div className="space-y-1">
          <p className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-7xl font-extrabold text-transparent">
            404
          </p>
          <h1 className="text-xl font-semibold">Página não encontrada</h1>
          <p className="text-muted-foreground text-sm">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
