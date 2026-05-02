using DevStore.Domain.Entities;

namespace DevStore.Domain.Interfaces;

public interface IPermissaoNexusRepository
{
    Task<IEnumerable<NexusUsuario>> ListarUsuariosAsync();

    Task<(IEnumerable<ItemPermissao> Servicos, IEnumerable<ItemPermissao> Consultas)> CarregarPermissoesAsync(
        string matricula, string filial);

    Task SalvarPermissoesAsync(
        string matricula,
        string filial,
        IEnumerable<string> servicosHabilitados,
        IEnumerable<string> consultasHabilitadas);

    Task ImportarPermissoesAsync(
        string matriculaOrigem,
        string filialOrigem,
        string matriculaDestino,
        string filialDestino);
}
