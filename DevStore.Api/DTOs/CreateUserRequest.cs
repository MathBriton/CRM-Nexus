using DevStore.Domain.Enums;

namespace DevStore.Api.DTOs;

public record CreateUserRequest(
    string Username,
    string Name,
    string Email,
    string Password,
    UserRole Role = UserRole.User);
