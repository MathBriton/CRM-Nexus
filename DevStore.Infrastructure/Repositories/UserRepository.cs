using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using DevStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DevStore.Infrastructure.Repositories;

public class UserRepository(DevStoreDbContext context) : IUserRepository
{
    public async Task<User?> BuscarPorUsernameAsync(string username) =>
        await context.Users.FirstOrDefaultAsync(u => u.Username == username.ToLowerInvariant() && u.IsActive);

    public async Task<User?> BuscarPorIdAsync(int id) =>
        await context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> ListarAsync() =>
        await context.Users.AsNoTracking().ToListAsync();

    public async Task AdicionarAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task<bool> ExisteAlgumAsync() =>
        await context.Users.AnyAsync();
}
