namespace CrmNexus.Api.Models.Entities;

// Espelho direto da tabela auth.Usuarios — sem lógica, só dados.
// Paralelo SWNet: seria o recordset retornado pelo ADODB após SELECT na tabela de usuários.
public class Usuario
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string SenhaHash { get; init; } = string.Empty; // bcrypt — NUNCA expor via API
    public byte Nivel { get; init; }
    public bool Ativo { get; init; }
}
