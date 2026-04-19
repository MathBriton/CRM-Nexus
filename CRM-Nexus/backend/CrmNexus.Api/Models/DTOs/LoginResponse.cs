namespace CrmNexus.Api.Models.DTOs;

// DTO de SAÍDA — só o que o cliente precisa saber. SenhaHash nunca sai daqui.
// O frontend vai guardar o Token no localStorage e usar nas próximas requisições.
public class LoginResponse
{
    public string Token { get; init; } = string.Empty;
    public string Nome { get; init; } = string.Empty;
    public byte Nivel { get; init; }
    public DateTime ExpiresAt { get; init; }
}
