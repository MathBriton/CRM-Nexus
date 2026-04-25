namespace DevStore.Api.DTOs;

public record LoginResponse(
    string Token,
    int Id,
    string Username,
    string Name,
    string Role,
    DateTime ExpiresAt);
