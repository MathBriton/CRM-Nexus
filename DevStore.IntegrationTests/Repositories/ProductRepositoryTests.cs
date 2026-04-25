using DevStore.Domain.Entities;
using DevStore.Domain.Interfaces;
using DevStore.Infrastructure.Data;
using DevStore.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace DevStore.IntegrationTests.Repositories;

public class ProductRepositoryTests(ApiFactory factory)
    : IClassFixture<ApiFactory>, IAsyncLifetime
{
    private IServiceScope _scope = null!;
    private IProductRepository _repository = null!;
    private DevStoreDbContext _db = null!;

    public Task InitializeAsync()
    {
        _scope = factory.Services.CreateScope();
        _repository = _scope.ServiceProvider.GetRequiredService<IProductRepository>();
        _db = _scope.ServiceProvider.GetRequiredService<DevStoreDbContext>();
        _db.Products.RemoveRange(_db.Products);
        return _db.SaveChangesAsync();
    }

    public Task DisposeAsync()
    {
        _scope.Dispose();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task GetAllAsync_SemProdutos_RetornaListaVazia()
    {
        var resultado = await _repository.GetAllAsync();

        resultado.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_ComProdutos_RetornaTodos()
    {
        _db.Products.AddRange(
            new Product("Produto A", "Desc A", 10m, 1),
            new Product("Produto B", "Desc B", 20m, 2));
        await _db.SaveChangesAsync();

        var resultado = await _repository.GetAllAsync();

        resultado.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByIdAsync_IdExistente_RetornaProduto()
    {
        var produto = new Product("Produto", "Desc", 50m, 5);
        _db.Products.Add(produto);
        await _db.SaveChangesAsync();

        var resultado = await _repository.GetByIdAsync(produto.Id);

        resultado.Should().NotBeNull();
        resultado!.Name.Should().Be("Produto");
    }

    [Fact]
    public async Task GetByIdAsync_IdInexistente_RetornaNull()
    {
        var resultado = await _repository.GetByIdAsync(999);

        resultado.Should().BeNull();
    }

    [Fact]
    public async Task AddAsync_ProdutoValido_PersisteBanco()
    {
        var produto = new Product("Novo", "Desc", 99m, 3);

        await _repository.AddAsync(produto);

        var salvo = await _db.Products.FindAsync(produto.Id);
        salvo.Should().NotBeNull();
        salvo!.Name.Should().Be("Novo");
    }

    [Fact]
    public async Task UpdateAsync_ProdutoExistente_AtualizaBanco()
    {
        var produto = new Product("Antes", "Desc", 10m, 1);
        _db.Products.Add(produto);
        await _db.SaveChangesAsync();
        _db.ChangeTracker.Clear();

        var paraAtualizar = await _repository.GetByIdAsync(produto.Id);
        paraAtualizar!.Update("Depois", "Nova desc", 20m, 2);
        await _repository.UpdateAsync(paraAtualizar);
        _db.ChangeTracker.Clear();

        var atualizado = await _db.Products.FindAsync(produto.Id);
        atualizado!.Name.Should().Be("Depois");
        atualizado.Price.Should().Be(20m);
    }

    [Fact]
    public async Task DeleteAsync_IdExistente_RemoveDoBanco()
    {
        var produto = new Product("Remover", "Desc", 10m, 1);
        _db.Products.Add(produto);
        await _db.SaveChangesAsync();

        await _repository.DeleteAsync(produto.Id);

        var removido = await _db.Products.FindAsync(produto.Id);
        removido.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_IdInexistente_NaoLancaExcecao()
    {
        var acao = async () => await _repository.DeleteAsync(999);

        await acao.Should().NotThrowAsync();
    }
}
