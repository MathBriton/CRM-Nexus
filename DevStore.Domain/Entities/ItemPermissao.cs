namespace DevStore.Domain.Entities;

public record ItemPermissao(
    string Codigo,
    string Nome,
    string Categoria,
    bool Habilitado);
