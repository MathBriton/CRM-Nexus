export interface Usuario {
  id: number
  name: string
  username: string
}

export interface AuthState {
  user: Usuario | null
  token: string | null
}
