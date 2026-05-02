namespace DevStore.Api.DTOs;

public record NexusUsuarioResponse(int Id, string Matricula, string Filial, string Nome, string Login);

public record ItemPermissaoResponse(string Codigo, string Nome, string Categoria, bool Habilitado);

public record PermissoesUsuarioResponse(
    IEnumerable<ItemPermissaoResponse> Servicos,
    IEnumerable<ItemPermissaoResponse> Consultas);

public record SalvarPermissoesRequest(
    IEnumerable<string> ServicosHabilitados,
    IEnumerable<string> ConsultasHabilitadas);

public record ImportarPermissoesRequest(string MatriculaOrigem, string FilialOrigem);
