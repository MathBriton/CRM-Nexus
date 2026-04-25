import { describe, it, expect } from 'vitest'
import { userService } from './userService'
import { usuarios } from '../test/handlers'

describe('userService', () => {
  it('listar: retorna todos os usuários', async () => {
    const resultado = await userService.listar()
    expect(resultado).toHaveLength(2)
    expect(resultado[0].username).toBe('admin')
  })

  it('buscarPorId: retorna usuário existente', async () => {
    const resultado = await userService.buscarPorId(1)
    expect(resultado.username).toBe('admin')
  })

  it('buscarPorId: lança erro para id inexistente', async () => {
    await expect(userService.buscarPorId(999)).rejects.toThrow()
  })

  it('criar: retorna usuário criado com status 201', async () => {
    const resultado = await userService.criar({
      username: 'novousr',
      name: 'Novo Usuário',
      email: 'novo@dev.com',
      password: 'Senha@123',
      role: 'User',
    })
    expect(resultado.id).toBeDefined()
    expect(resultado.username).toBe('novousr')
  })

  it('atualizar: resolve sem erro para id existente', async () => {
    await expect(
      userService.atualizar(usuarios[0].id, { name: 'Admin Atualizado', email: 'admin@dev.com' })
    ).resolves.toBeUndefined()
  })

  it('atualizar: lança erro para id inexistente', async () => {
    await expect(
      userService.atualizar(999, { name: 'X', email: 'x@dev.com' })
    ).rejects.toThrow()
  })

  it('alterarRole: resolve sem erro para id existente', async () => {
    await expect(
      userService.alterarRole(usuarios[0].id, 'Manager')
    ).resolves.toBeUndefined()
  })

  it('desativar: resolve sem erro para id existente', async () => {
    await expect(userService.desativar(usuarios[0].id)).resolves.toBeUndefined()
  })

  it('desativar: lança erro para id inexistente', async () => {
    await expect(userService.desativar(999)).rejects.toThrow()
  })
})
