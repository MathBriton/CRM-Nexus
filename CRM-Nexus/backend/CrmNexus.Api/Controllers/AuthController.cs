using CrmNexus.Api.Models.DTOs;
using CrmNexus.Api.Models.Responses;
using CrmNexus.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrmNexus.Api.Controllers;

// [ApiController] ativa: validação automática do ModelState, binding de JSON no body,
// e respostas 400 automáticas quando o DTO falha nas DataAnnotations.
// Paralelo SWNet: se Request.Form("email") = "" você fazia IF manual — aqui o framework cuida.
[ApiController]
[Route("api/[controller]")]  // → /api/auth
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]  // → POST /api/auth/login
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        [FromBody] LoginRequest request,
        CancellationToken ct)
    {
        var result = await authService.LoginAsync(request, ct);

        if (result is null)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("E-mail ou senha inválidos."));

        return Ok(ApiResponse<LoginResponse>.Ok(result, "Login realizado com sucesso."));
    }
}
