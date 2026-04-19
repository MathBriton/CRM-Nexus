using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CrmNexus.Api.Models.DTOs;
using CrmNexus.Api.Repositories;
using Microsoft.IdentityModel.Tokens;

namespace CrmNexus.Api.Services;

// O Service não sabe que existe um banco — só fala com o Repository via interface.
// Isso permite trocar o Repository por um mock em testes sem mudar nada aqui.
public class AuthService(IAuthRepository repository, IConfiguration config) : IAuthService
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var usuario = await repository.BuscarPorEmailAsync(request.Email, ct);

        // Retorna null tanto para "usuário não existe" quanto para "senha errada".
        // Nunca informe qual dos dois falhou — isso é enumeração de usuários.
        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
            return null;

        var expiresAt = DateTime.UtcNow.AddHours(
            config.GetValue<int>("Jwt:ExpiresInHours"));

        var token = GerarToken(usuario.Id, usuario.Nome, usuario.Nivel, expiresAt);

        return new LoginResponse
        {
            Token     = token,
            Nome      = usuario.Nome,
            Nivel     = usuario.Nivel,
            ExpiresAt = expiresAt
        };
    }

    private string GerarToken(int userId, string nome, byte nivel, DateTime expiresAt)
    {
        // Claims são os "campos" dentro do JWT — equivalente às variáveis de sessão do SWNet.
        // Paralelo: Session("NIVEL") = nivel  →  new Claim("nivel", nivel.ToString())
        var claims = new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim("nome",   nome),
            new Claim("nivel",  nivel.ToString())
        };

        var jwtSection = config.GetSection("Jwt");
        var key        = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["SecretKey"]!));
        var creds      = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             jwtSection["Issuer"],
            audience:           jwtSection["Audience"],
            claims:             claims,
            expires:            expiresAt,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
