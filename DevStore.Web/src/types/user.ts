export type UserRole = 'Admin' | 'Manager' | 'User'

export interface User {
  id: number
  username: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface CreateUserRequest {
  username: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name: string
  email: string
}
