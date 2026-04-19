using System.Data;
using CrmNexus.Api.Models.Entities;
using Dapper;

namespace CrmNexus.Api.Repositories;

// Paralelo SWNet: este arquivo é o equivalente ao bloco de conexão + rs.Open() do ASP Classic,
// mas tipado, testável e sem gerenciar conexão manualmente.
public class AuthRepository(IDbConnection db) : IAuthRepository
{
    // Convenção do projeto: queries SQL como const no topo — nunca inline no método.
    private const string SqlBuscarPorEmail = """
        SELECT Id, Nome, Email, SenhaHash, Nivel, Ativo
        FROM auth.Usuarios
        WHERE Email = @Email AND Ativo = 1
        """;

    public async Task<Usuario?> BuscarPorEmailAsync(string email, CancellationToken ct)
    {
        // QueryFirstOrDefaultAsync retorna null se não encontrar — sem exceção.
        // Dapper mapeia as colunas do SELECT para as propriedades de Usuario automaticamente.
        return await db.QueryFirstOrDefaultAsync<Usuario>(
            SqlBuscarPorEmail,
            new { Email = email });
    }
}
