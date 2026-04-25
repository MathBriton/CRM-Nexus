using DevStore.Domain.Entities;

namespace DevStore.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> BuscarPorUsernameAsync(string username);
    Task<User?> BuscarPorIdAsync(int id);
    Task<IEnumerable<User>> ListarAsync();
    Task AdicionarAsync(User user);
    Task AtualizarAsync(User user);
    Task<bool> ExisteAlgumAsync();
}
