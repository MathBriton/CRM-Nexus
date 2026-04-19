using CrmNexus.Api.Models.DTOs;

namespace CrmNexus.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct);
}
