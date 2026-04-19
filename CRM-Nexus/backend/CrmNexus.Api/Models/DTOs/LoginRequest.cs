using System.ComponentModel.DataAnnotations;

namespace CrmNexus.Api.Models.DTOs;

// DTO de ENTRADA — só o que o cliente envia. Nunca expor a entidade diretamente.
// Paralelo SWNet: equivale aos campos capturados via Request.Form no ASP Classic.
public class LoginRequest
{
    [Required(ErrorMessage = "E-mail obrigatório")]
    [EmailAddress(ErrorMessage = "E-mail inválido")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Senha obrigatória")]
    [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
    public string Senha { get; init; } = string.Empty;
}
