using BCrypt.Net;
using DevStore.Api.DTOs;
using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevStore.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("users")]
public class UsersController(IUserRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await repository.ListarAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await repository.BuscarPorIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        var user = new User(request.Username, request.Name, request.Email, request.Role);
        user.SetPasswordHash(BCrypt.Net.BCrypt.HashPassword(request.Password));
        await repository.AdicionarAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await repository.BuscarPorIdAsync(id);
        if (user is null) return NotFound();
        user.Update(request.Name, request.Email);
        await repository.AtualizarAsync(user);
        return NoContent();
    }

    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest request)
    {
        var user = await repository.BuscarPorIdAsync(id);
        if (user is null) return NotFound();
        user.AlterarRole(request.Role);
        await repository.AtualizarAsync(user);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var user = await repository.BuscarPorIdAsync(id);
        if (user is null) return NotFound();
        user.Desativar();
        await repository.AtualizarAsync(user);
        return NoContent();
    }
}
