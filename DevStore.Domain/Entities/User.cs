using DevStore.Domain.Enums;

namespace DevStore.Domain.Entities;

public class User
{
    public int Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected User() { }

    public User(string username, string name, string email, UserRole role = UserRole.User)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(username);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        Username = username.ToLowerInvariant();
        Name = name;
        Email = email.ToLowerInvariant();
        Role = role;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    public void SetPasswordHash(string hash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(hash);
        PasswordHash = hash;
    }

    public void Update(string name, string email)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        Name = name;
        Email = email.ToLowerInvariant();
    }

    public void AlterarRole(UserRole role) => Role = role;

    public void Desativar() => IsActive = false;

    public void Reativar() => IsActive = true;
}
