using DevStore.Domain.Entities;

namespace DevStore.Domain.Interfaces;

public interface ITokenService
{
    string GerarToken(User user);
}
