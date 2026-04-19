using CrmNexus.Api.Models.Entities;

namespace CrmNexus.Api.Repositories;

public interface IAuthRepository
{
    Task<Usuario?> BuscarPorEmailAsync(string email, CancellationToken ct);
}
