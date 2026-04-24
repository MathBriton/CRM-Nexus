namespace DevStore.Api.DTOs;

public record UpdateProductRequest(string Name, string Description, decimal Price, int Stock);
