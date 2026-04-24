namespace DevStore.Api.DTOs;

public record CreateProductRequest(string Name, string Description, decimal Price, int Stock);
