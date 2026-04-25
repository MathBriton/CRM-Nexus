using BCrypt.Net;
using DevStore.Api.DTOs;
using DevStore.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevStore.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IUserRepository userRepository, ITokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await userRepository.BuscarPorUsernameAsync(request.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Credenciais inválidas." });

        var token = tokenService.GerarToken(user);
        var expiracao = DateTime.UtcNow.AddHours(8);

        return Ok(new LoginResponse(token, user.Name, user.Role.ToString(), expiracao));
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var username = User.Identity?.Name;
        var name = User.FindFirst("name")?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        return Ok(new { id, username, name, role });
    }
}
