namespace DevStore.Api.DTOs;

public record LoginResponse(string Token, string Name, string Role, DateTime ExpiresAt);
