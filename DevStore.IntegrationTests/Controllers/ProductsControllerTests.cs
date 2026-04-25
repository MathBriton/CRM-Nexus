using System.Net;
using System.Net.Http.Json;
using DevStore.Api.DTOs;
using DevStore.Domain.Entities;
using DevStore.Infrastructure.Data;
using DevStore.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace DevStore.IntegrationTests.Controllers;

public class ProductsControllerTests(ApiFactory factory)
    : IClassFixture<ApiFactory>, IAsyncLifetime
{
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        _client = await factory.CreateAuthenticatedClientAsync();

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DevStoreDbContext>();
        db.Products.RemoveRange(db.Products);
        await db.SaveChangesAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private async Task<Product> CriarProdutoNoBanco(string nome = "Produto", decimal preco = 99m, int estoque = 5)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DevStoreDbContext>();
        var produto = new Product(nome, "Descrição", preco, estoque);
        db.Products.Add(produto);
        await db.SaveChangesAsync();
        return produto;
    }

    [Fact]
    public async Task GET_Products_SemAutorizacao_Retorna401()
    {
        var clientSemToken = factory.CreateClient();
        var resposta = await clientSemToken.GetAsync("/products");
        resposta.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Products_SemProdutos_Retorna200ComListaVazia()
    {
        var resposta = await _client.GetAsync("/products");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
        var lista = await resposta.Content.ReadFromJsonAsync<List<object>>();
        lista.Should().BeEmpty();
    }

    [Fact]
    public async Task GET_Products_ComProdutos_Retorna200ComTodos()
    {
        await CriarProdutoNoBanco("A");
        await CriarProdutoNoBanco("B");

        var resposta = await _client.GetAsync("/products");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
        var lista = await resposta.Content.ReadFromJsonAsync<List<object>>();
        lista.Should().HaveCount(2);
    }

    [Fact]
    public async Task GET_ProductsId_IdExistente_Retorna200()
    {
        var produto = await CriarProdutoNoBanco();

        var resposta = await _client.GetAsync($"/products/{produto.Id}");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GET_ProductsId_IdInexistente_Retorna404()
    {
        var resposta = await _client.GetAsync("/products/999");

        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task POST_Products_DadosValidos_Retorna201()
    {
        var request = new CreateProductRequest("Notebook", "Notebook gamer", 4999m, 10);

        var resposta = await _client.PostAsJsonAsync("/products", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.Created);
        resposta.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task PUT_ProductsId_IdExistente_Retorna204()
    {
        var produto = await CriarProdutoNoBanco();
        var request = new UpdateProductRequest("Nome atualizado", "Desc atualizada", 199m, 3);

        var resposta = await _client.PutAsJsonAsync($"/products/{produto.Id}", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task PUT_ProductsId_IdInexistente_Retorna404()
    {
        var request = new UpdateProductRequest("Nome", "Desc", 100m, 1);

        var resposta = await _client.PutAsJsonAsync("/products/999", request);

        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DELETE_ProductsId_IdExistente_Retorna204()
    {
        var produto = await CriarProdutoNoBanco();

        var resposta = await _client.DeleteAsync($"/products/{produto.Id}");

        resposta.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DELETE_ProductsId_IdInexistente_Retorna404()
    {
        var resposta = await _client.DeleteAsync("/products/999");

        resposta.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
